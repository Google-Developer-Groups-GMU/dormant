package types

type BannerResponse struct {
	Success    bool            `json:"success"`
	TotalCount int             `json:"totalCount"`
	Data       []BannerSection `json:"data"`
}

// matches the messy object inside the "data" array
type BannerSection struct {
	ID             int    `json:"id"`
	Term           string `json:"term"`
	CRN            string `json:"courseReferenceNumber"`
	Subject        string `json:"subject"`
	CourseNumber   string `json:"courseNumber"`
	SequenceNumber string `json:"sequenceNumber"`
	Title          string `json:"courseTitle"`

	// the nested meetings array is the most important
	MeetingsFaculty []struct {
		MeetingTime struct {
			BeginTime string `json:"beginTime"` // "1000" (HHMM)
			EndTime   string `json:"endTime"`   // "1115"
			Building  string `json:"building"`
			Room      string `json:"room"`
			Monday    bool   `json:"monday"`
			Tuesday   bool   `json:"tuesday"`
			Wednesday bool   `json:"wednesday"`
			Thursday  bool   `json:"thursday"`
			Friday    bool   `json:"friday"`
			Saturday  bool   `json:"saturday"`
			Sunday    bool   `json:"sunday"`
		} `json:"meetingTime"`
		Faculty []struct {
			DisplayName string `json:"displayName"`
			Email       string `json:"email"`
		} `json:"faculty"`
	} `json:"meetingsFaculty"`
}
