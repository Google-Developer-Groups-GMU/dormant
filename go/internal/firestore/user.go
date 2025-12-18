package firestore

import (
	"context"
	"errors"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

// save or update user document after authentication
// users/{userID}
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
// users/{userID}
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

// save or update user schedule in subcollection
// users/{userID}/schedules/{scheduleID}
func SaveUserSchedule(ctx context.Context, userID string, schedule types.Schedule) error {
	if Client == nil {
		return fmt.Errorf("firestore client is not initialized")
	}

	// reference subcollection
	// users/{userID}/schedules/{scheduleID}
	coll := Client.Collection("users").Doc(userID).Collection("schedules")

	// create a new Doc ID if one doesn't exist
	if schedule.ID == "" {
		schedule.ID = coll.NewDoc().ID
	}

	// save the full struct
	// the approach here is snapshot based; we overwrite the whole doc each time
	_, err := coll.Doc(schedule.ID).Set(ctx, schedule)
	return err
}

// fetch all schedules for a user
// users/{userID}/schedules/
func GetUserSchedules(ctx context.Context, userID string) ([]types.Schedule, error) {
	if Client == nil {
		return nil, fmt.Errorf("database client is not initialized")
	}

	// fetch all docs in the subcollection
	iter := Client.Collection("users").Doc(userID).Collection("schedules").Documents(ctx)
	var schedules []types.Schedule

	for {
		doc, err := iter.Next()

		if err == iterator.Done {
			break
		}

		if err != nil {
			return nil, err
		}

		var s types.Schedule
		if err := doc.DataTo(&s); err != nil {
			continue
		}
		schedules = append(schedules, s)
	}
	return schedules, nil
}
