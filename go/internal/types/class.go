package types

type Course struct {
	ID          string `json:"id"`
	Department  string `json:"department"` // CS
	Code        string `json:"code"`       // 110
	Title       string `json:"title"`      // Intro to CS
	Description string `json:"description"`
	Credits     int    `json:"credits"` // 3
}

type Section struct {
	ID        string `json:"id"`
	CourseID  string `json:"course_id"`
	Section   string `json:"section"` // "001"
	Professor string `json:"professor"`

	// visual data
	Location string `json:"location"`

	// backend data
	// using nested struct for meetings because a single section
	// might meet at different times on different days
	Meetings []Meeting `json:"meetings"`
}

// single time slot
// section like Mon/Wed 10-11 will have two Meeting entries
type Meeting struct {
	Day       int    `json:"day"`        // 0=Sun, 1=Mon, ..., 6=Sat
	StartTime int    `json:"start_time"` // minutes from midnight (e.g. 600)
	EndTime   int    `json:"end_time"`
	Location  string `json:"location"` // meeting location
}

type Schedule struct {
	ID       string    `json:"id"`
	UserID   string    `json:"user_id"`
	Name     string    `json:"name"`
	Sections []Section `json:"sections"`
}
