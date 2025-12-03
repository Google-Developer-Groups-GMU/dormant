package scheduler

import (
	"context"
	"fmt"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

func Run(ctx context.Context, courseIDs []string, userID string) ([]types.Schedule, error) {
	// 1. fetch the specific sections for the courses the user selected
	sections, err := GetSectionsByCourseIDs(ctx, courseIDs)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch sections: %w", err)
	}

	// 2. prepare group sections by CourseID so the algorithm can pick one from each bucket
	courseBuckets := make(map[string][]types.Section)
	for _, section := range sections {
		courseBuckets[section.CourseID] = append(courseBuckets[section.CourseID], section)
	}

	// 3. CALCULATE: run the backtracking algorithm
	generatedSchedules := generatePermutations(courseBuckets)

	// 4. SAVE: save generated schedules to Firestore

	// saveSchedules(ctx, userID, generatedSchedules)

	return generatedSchedules, nil
}

// fetches detailed meeting times (Mon/Wed 10am) which the frontend will not have
// crucial for generating permutations and checking conflicts
func GetSectionsByCourseIDs(ctx context.Context, courseIDs []string) ([]types.Section, error) {
	// TODO: connect this to your actual firestore
	// query: SELECT * FROM sections WHERE course_id IN (courseIDs...)

	return []types.Section{}, nil
}

// generatePermutations is a placeholder for your conflict-detection algorithm
func generatePermutations(courses map[string][]types.Section) []types.Schedule {
	var results []types.Schedule

	// TODO: implement recursive backtracking here
	// 1. pick section from Course A
	// 2. pick section from Course B
	// 3. check overlap
	// 4. if valid add to results

	return results
}
