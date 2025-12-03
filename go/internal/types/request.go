package types

type GenerateRequest struct {
	UserID    string   `json:"user_id"`
	CourseIDs []string `json:"course_ids"` // ["CS110", "MATH200"]
}
