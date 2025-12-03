package auth

import (
	"log"
	"net/http"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/firestore"
	"github.com/gin-gonic/gin"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
)

// get user profile, fetching data from firestore
func GetUserProfile(c *gin.Context) {
	session, err := gothic.Store.Get(c.Request, "user-session")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
		return
	}

	val := session.Values["user_id"]
	if val == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
		return
	}

	userID, ok := val.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid session data"})
		return
	}

	// fetch user data from firestore
	user, err := firestore.GetUser(c.Request.Context(), userID)
	if err != nil {
		log.Printf("Firestore error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user data"})
		return
	}

	if user == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "User profile unavailable (DB not connected)"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"UserID":    user.ID,
		"Name":      user.Name,
		"Email":     user.Email,
		"AvatarURL": user.AvatarURL,
	})
}

// // // // // // // //
// devdevdevdevdevde //
// // // // // // // //
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
