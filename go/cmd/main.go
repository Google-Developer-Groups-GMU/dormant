package main

import (
	"net/http"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/auth"
	"github.com/gin-gonic/gin"
)

func main() {
	// initialize Gin router
	r := gin.Default()

	// health check route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "health check ok"})
	})

	// root route
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "GDG GMU Dormant API"})
	})

	// initialize authentication
	auth.NewAuth()

	//  authentication routes
	r.GET("/auth/:provider", auth.SignInWithProvider)
	r.GET("/auth/:provider/callback", auth.CallbackHandler)
	r.GET("/auth/signout", auth.SignOutHandler)

	r.Run(":5000")
}
