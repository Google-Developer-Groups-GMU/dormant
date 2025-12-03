package api

import (
	"net/http"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/scheduler"
	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
	"github.com/gin-gonic/gin"
)

// we are not implementing usual CRUD for schedules since they are
// generated on the fly and saved as needed.

// POST /api/generate
// input: { "courseIds": ["CS101", "MATH200"] }
// output: Returns the generated schedules (and saves them to DB)
func GenerateSchedule(c *gin.Context) {
	var req types.GenerateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// validate input with max courses limit of 7
	// maybe we can change this into credit limit later
	if len(req.CourseIDs) > 7 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Too many courses selected"})
		return
	}

	// 1. fetch section data from firestore
	// 2. run backtracking algorithm to generate valid schedules
	// 3. save results to schedules collection
	generatedSchedules, err := scheduler.Run(c.Request.Context(), req.CourseIDs, req.UserID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// return results immediately so frontend can display them
	c.JSON(http.StatusOK, generatedSchedules)
}
