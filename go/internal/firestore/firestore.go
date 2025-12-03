package firestore

// like mentioned in auth.go, we are committing to using goth and gothic session management
// we will be CRUD server side instead of client side fetch/writes
// which are implemented here in this file

import (
	"context"
	"errors"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

var Client *firestore.Client

// NOTE: DO NOT use json key to initialize the client unless you are ready to pay for secret manager
// (it is okay to do in local dev, but bad practice for production and you will have to pay for it)
//
// you will suffer and want to delete everything when you are deploying to GCP under free tier
// hours spent realizing this mistake: ~8

// init firestore client
func Init() error {
	projectID := os.Getenv("GOOGLE_PROJECT_ID")
	if projectID == "" {
		return errors.New("project ID is not set in env variables")
	}

	var err error
	// using background context so the client lives as long as the app lives
	Client, err = firestore.NewClient(context.Background(), projectID)
	if err != nil {
		return err
	}

	log.Println("Firestore initialized successfully")
	return nil
}

// clean up the firestore client
func Close() {
	if Client != nil {
		Client.Close()
	}
}

// save or update user document
func SaveUserToFirestore(ctx context.Context, user types.User) error {
	if Client == nil {
		return errors.New("firestore client is not initialized")
	}

	// update existing fields or create if new
	_, err := Client.Collection("users").Doc(user.ID).Set(ctx, map[string]interface{}{
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"avatar_url": user.AvatarURL,
	}, firestore.MergeAll)

	if err != nil {
		log.Printf("Firestore write error: %v", err)
		return err
	}

	log.Printf("User %s saved to Firestore", user.ID)
	return nil
}

// fetch user document by ID
func GetUser(ctx context.Context, userID string) (*types.User, error) {
	if Client == nil {
		return nil, errors.New("firestore client is not initialized")
	}

	doc, err := Client.Collection("users").Doc(userID).Get(ctx)
	if err != nil {
		return nil, err
	}

	var user types.User
	if err := doc.DataTo(&user); err != nil {
		return nil, err
	}

	return &user, nil
}
