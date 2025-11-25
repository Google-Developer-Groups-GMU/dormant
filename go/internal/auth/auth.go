package auth

/*
authentication using the Goth library with Google as the provider

why Gin as framework not Gorilla Mux or Chi?
Gin is faster, simper to use. built in middleware, documentation is better.
it uses its own context which makes it easier to pass data around. Much much easier.
we are locking our project ecosystem to gin anyways, so it makes sense to use gin here as well.


*/

import (
	"context"
	"encoding/gob" // Add this
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

// custom type for context keys to avoid collisions
type contextKey string

// constants for session management and context keys
const (
	key      string = "auth-session"
	MaxAge   int    = 86400 * 30
	Path     string = "/"
	HttpOnly bool   = true
	Secure   bool   = false
	isDev    bool   = true
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

	// get/create session for the user
	session, _ := gothic.Store.Get(c.Request, "user-session")

	// store user data in the session
	// TODO: just store user.UserID and look up the rest from DB
	session.Values["user"] = user

	// save the session/writes cookie
	err = session.Save(c.Request, c.Writer)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, "http://localhost:3000/")
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

// get user profile, limited to necessary fields only
func GetUserProfile(c *gin.Context) {
	session, err := gothic.Store.Get(c.Request, "user-session")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
		return
	}

	val := session.Values["user"]
	if val == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
		return
	}

	user, ok := val.(goth.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid session data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"UserID":    user.UserID,
		"Name":      user.Name,
		"Email":     user.Email,
		"AvatarURL": user.AvatarURL,
	})
}

// dev
//
// get user state, not used; for dev purposes only
func GetUser(c *gin.Context) {
	session, _ := gothic.Store.Get(c.Request, "user-session")
	val := session.Values["user"]

	if val == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not logged in"})
		return
	}

	user, ok := val.(goth.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Session data corrupted"})
		return
	}

	c.JSON(http.StatusOK, user)
}
