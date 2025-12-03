package auth

// authentication using the Goth library with Google as the provider

// NOTE: why Gin as framework not Gorilla Mux or Chi?
// Gin is faster, simpler to use with built in middleware, documentation is better
// it uses its own context which makes it easier to pass data around; much much easier.
// we are locking our project ecosystem to gin anyways, so it makes sense to use gin here as well.

// we are committing to using goth/gothic for auth as well, because it supports multiple providers
// just in case we want to add more providers in the future
// it makes it a little more complex, but more flexible

// we are forced to commit to using gothic's session management as well
// which means we have to implement CRUD server side instead of client side fetch/writes

import (
	"context"
	"encoding/gob"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/firestore"
	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

// constants for session management and context keys
const (
	key      string = "auth-session"
	MaxAge   int    = 86400 * 30
	Path     string = "/"
	HttpOnly bool   = true
	Secure   bool   = false // set to true in production with HTTPS
)

func init() {
	// register the goth.User struct so gorilla/sessions can serialize
	gob.Register(goth.User{})
}

// init authentication providers and session store
func NewAuth() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(".env file failed to load")
	}

	googleClientId := os.Getenv("CLIENT_ID")
	googleClientSecret := os.Getenv("CLIENT_SECRET")
	googleCallbackURL := os.Getenv("CLIENT_CALLBACK_URL")

	log.Printf("Auth Callback URL: %s", googleCallbackURL)

	store := sessions.NewCookieStore([]byte(key))
	store.MaxAge(MaxAge)
	store.Options.Path = Path
	store.Options.HttpOnly = HttpOnly
	store.Options.Secure = Secure

	gothic.Store = store

	goth.UseProviders(google.New(googleClientId, googleClientSecret, googleCallbackURL))
}

// signin handler
func SignInWithProvider(c *gin.Context) {
	provider := c.Param("provider")

	// SA1029: gothic library requires the key to be the string "provider"
	// gothic REQUIRES string key "provider" in context. custom type won't work here
	// because gothic was written before this practice, we can simply ignore the warning
	ctx := context.WithValue(c.Request.Context(), "provider", provider)
	c.Request = c.Request.WithContext(ctx)

	gothic.BeginAuthHandler(c.Writer, c.Request)
}

// callback handler
func CallbackHandler(c *gin.Context) {
	provider := c.Param("provider")

	// SA1029: gothic library requires the key to be the string "provider"
	ctx := context.WithValue(c.Request.Context(), "provider", provider)
	c.Request = c.Request.WithContext(ctx)

	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	// save user to Firestore
	firestore.SaveUserToFirestore(c.Request.Context(), types.User{
		ID:        user.UserID,
		Name:      user.Name,
		Email:     user.Email,
		AvatarURL: user.AvatarURL,
	})

	// get/create session for the user
	session, _ := gothic.Store.Get(c.Request, "user-session")

	// store ONLY the user ID in the session
	session.Values["user_id"] = user.UserID

	// save the session/writes cookie
	err = session.Save(c.Request, c.Writer)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, os.Getenv("FRONTEND_URL"))
}

// signout handler
func SignOutHandler(c *gin.Context) {
	session, err := gothic.Store.Get(c.Request, "user-session")
	if err != nil {
		// still return OK so frontend can clear state
		log.Println("signout: session get error:", err)
		c.JSON(http.StatusOK, gin.H{"message": "signed out"})
		return
	}

	// remove values and expire cookie
	session.Values = map[interface{}]interface{}{}
	session.Options.MaxAge = -1

	if err := session.Save(c.Request, c.Writer); err != nil {
		log.Println("signout: session save error:", err)
		// still return OK so frontend can clear state
	}

	c.JSON(http.StatusOK, gin.H{"message": "signed out"})
}
