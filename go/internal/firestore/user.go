package firestore

import (
	"context"
	"errors"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

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
