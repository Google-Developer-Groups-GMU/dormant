package firestore

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

var Client *firestore.Client

// init firestore client
func Init() error {
	projectID := os.Getenv("GOOGLE_PROJECT_ID")
	if projectID == "" {
		log.Println("Warning: GOOGLE_PROJECT_ID not set in .env, Firestore features will be disabled")
		return nil
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
		return nil
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
		return nil, nil
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
