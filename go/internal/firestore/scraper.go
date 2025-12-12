package firestore

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

// saves the high-level course metadata ex) CS101, Title
// we use map to avoid redundant writes in the scraper
func SaveCourse(ctx context.Context, course types.Course) error {
	if Client == nil {
		return nil
	}

	// this will overwrite existing course data if the course ID already exists
	// which is fine since we want the latest data
	_, err := Client.Collection("courses").Doc(course.ID).Set(ctx, course)
	if err != nil {
		log.Printf("Failed to save course %s: %v", course.ID, err)
		return err
	}
	return nil
}

// saves a specific class section ex) CS101-001, Time, Location
func SaveSection(ctx context.Context, section types.Section) error {
	if Client == nil {
		return nil
	}

	_, err := Client.Collection("sections").Doc(section.ID).Set(ctx, section)
	if err != nil {
		return err
	}

	// add this section ID to the parent course's "section_ids" array for optimal querying
	// read courses/{courseID} to get all sections, grab the section_ids array
	// then do a direct batch fetch for those section IDs

	// firestore "ArrayUnion" adds the ID only if it's not already there
	_, err = Client.Collection("courses").Doc(section.CourseID).Update(ctx, []firestore.Update{
		{
			Path:  "section_ids",
			Value: firestore.ArrayUnion(section.ID),
		},
	})

	// Note: If the course doc doesn't exist yet, Update() might fail.
	// Since you save the Course object first in your main loop, this is safe.
	if err != nil {
		// Log warning but don't fail the whole scrape
		log.Printf("Warning: Failed to link section %s to course %s: %v", section.ID, section.CourseID, err)
	}

	return nil
}
