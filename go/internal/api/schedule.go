package api

// handlers for API routes
// schedule generation, saving schedules, etc.
// this is about dealing with ALREADY GENERATED schedules
// (user should be able to have multiple saved possible schedules)
// (like plan A, plan B, ...)
// not generating schedules from scratch
// that is done in the scheduler module

import (
	"net/http"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/scheduler"
	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
	"github.com/gin-gonic/gin"
)

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

// save schedule
func SaveSchedule(c *gin.Context) {
	// TODO: implement saving schedule to Firestore
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented"})
}

// get saved schedules
func GetSavedSchedules(c *gin.Context) {
	// TODO: implement fetching saved schedules from Firestore
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented"})
}

// delete saved schedule
func DeleteSavedSchedule(c *gin.Context) {
	// TODO: implement deleting saved schedule from Firestore
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented"})
}

// update saved schedule
func UpdateSavedSchedule(c *gin.Context) {
	// TODO: implement updating saved schedule in Firestore
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented"})
}
