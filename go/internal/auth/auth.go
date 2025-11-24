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
	key         string     = "auth-session"
	providerKey contextKey = "provider"
	MaxAge      int        = 86400 * 30
	Path        string     = "/"
	HttpOnly    bool       = true
	Secure      bool       = false
	isDev       bool       = true
)

// init authentication providers and session store
func NewAuth() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(".env file failed to load!")
	}

	googleClientId := os.Getenv("CLIENT_ID")
	googleClientSecret := os.Getenv("CLIENT_SECRET")
	googleCallbackURL := os.Getenv("CLIENT_CALLBACK_URL")

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
	ctx := context.WithValue(c.Request.Context(), providerKey, provider)
	c.Request = c.Request.WithContext(ctx)

	gothic.BeginAuthHandler(c.Writer, c.Request)
}

// callback handler
func CallbackHandler(c *gin.Context) {
	provider := c.Param("provider")
	ctx := context.WithValue(c.Request.Context(), providerKey, provider)
	c.Request = c.Request.WithContext(ctx)

	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// signout handler
func SignOutHandler(c *gin.Context) {
	err := gothic.Logout(c.Writer, c.Request)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User logged out successfully",
	})
}
