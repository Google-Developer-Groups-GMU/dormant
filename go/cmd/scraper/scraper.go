package main

// scraper for GMU courses
// performs guest handshake to get session cookie + synchronizer token
// then fetches course data for a given subject and term
// outputs the raw JSON response to stdout
//

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/Google-Developer-Groups-GMU/dormant/go/internal/types"
)

const (
	BaseURL = "https://ssbstureg.gmu.edu/StudentRegistrationSsb"
	Term    = "202610" // spring 2026 term
)

// subjects to scrape
var Subject = []string{"CS", "ACCT", "MATH"}

func main() {
	// initialize HTTP client with cookie jar
	// NOTE: handles JSESSIONID automatically
	jar, _ := cookiejar.New(nil)
	client := &http.Client{
		Jar:     jar,
		Timeout: 15 * time.Second,
	}

	// guest handshake to get X-Synchronizer-Token
	fmt.Println("== 1 == visiting Search Page to get Token...")

	// visit the main page just to parse the token from the HTML
	targetURL := BaseURL + "/ssb/classSearch/classSearch"

	req, _ := http.NewRequest("GET", targetURL, nil)
	setHeaders(req, "")

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	bodyString := string(bodyBytes)

	if resp.StatusCode != 200 {
		log.Fatalf("Server returned %d", resp.StatusCode)
	}

	// regex to find window.synchronizerToken
	re := regexp.MustCompile(`name="synchronizerToken"\s+content="([^"]+)"`)
	matches := re.FindStringSubmatch(bodyString)

	if len(matches) < 2 {
		// dumping HTML page for debugging
		os.WriteFile("debug_page.html", bodyBytes, 0644)
		log.Fatal("Could not find X-Synchronizer-Token in HTML.")
	}
	token := matches[1]
	fmt.Printf("   > Token Found: %s\n", token)

	// setting the term
	// all requests will happen after setting the term
	fmt.Println("== 2 == setting term to", Term, "...")

	formData := url.Values{}
	formData.Set("term", Term)
	formData.Set("studyPath", "")
	formData.Set("studyPathText", "")
	formData.Set("startDatepicker", "")
	formData.Set("endDatepicker", "")

	// NOTE: use the "uniqueSessionId" just to be safe
	uniqueID := fmt.Sprintf("guest%d", time.Now().Unix())
	termUrl := fmt.Sprintf("%s/ssb/term/search?mode=search&uniqueSessionId=%s", BaseURL, uniqueID)

	req, _ = http.NewRequest("POST", termUrl, strings.NewReader(formData.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// attach the token header
	setHeaders(req, token)

	resp, err = client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	resp.Body.Close()

	// search for classes
	subject := Subject
	fmt.Printf("== 3 == fetching classes for %s...\n", subject)

	// pageMaxSize is set to 50
	// in prod it will need to loop through pages if more than 50 results
	// until "data" is empty or "totalRows" is reached
	apiURL := fmt.Sprintf(
		"%s/ssb/searchResults/searchResults?txt_subject=%s&txt_term=%s&startDatepicker=&endDatepicker=&pageOffset=0&pageMaxSize=50&sortColumn=subjectDescription&sortDirection=asc&uniqueSessionId=%s",
		BaseURL, subject, Term, uniqueID,
	)

	req, _ = http.NewRequest("GET", apiURL, nil)
	// attach the token header
	setHeaders(req, token)

	resp, err = client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	bodyBytes, _ = io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		log.Fatalf("error %d: %s", resp.StatusCode, string(bodyBytes))
	}

	fmt.Printf("received %d bytes of JSON.\n", len(bodyBytes))
	fmt.Println(string(bodyBytes[:2000]))
}

// set the headers
func setHeaders(req *http.Request, token string) {
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "application/json, text/javascript, */*; q=0.01")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")

	if token != "" {
		req.Header.Set("X-Synchronizer-Token", token)
	}
}

// parse into section type
func parseBannerSection(raw types.BannerSection) types.Section {
	// 1. Basic Info
	sec := types.Section{
		ID:       raw.CRN,                        // CRN as the unique ID
		CourseID: raw.Subject + raw.CourseNumber, // ex) CS100
		Section:  raw.SequenceNumber,
		// first professor if available
		Professor: "TBA",
	}

	if len(raw.MeetingsFaculty) > 0 && len(raw.MeetingsFaculty[0].Faculty) > 0 {
		sec.Professor = raw.MeetingsFaculty[0].Faculty[0].DisplayName
	}

	// parse meetings
	for _, mf := range raw.MeetingsFaculty {
		mt := mf.MeetingTime

		// converting 1000 -> 600 minutes
		startMin := parseTimeStr(mt.BeginTime)
		endMin := parseTimeStr(mt.EndTime)
		loc := mt.Building + " " + mt.Room

		// banner stores days as booleans
		// need to create a meeting for EACH true day
		daysMap := map[int]bool{
			0: mt.Sunday, 1: mt.Monday, 2: mt.Tuesday,
			3: mt.Wednesday, 4: mt.Thursday, 5: mt.Friday, 6: mt.Saturday,
		}

		for dayCode, isActive := range daysMap {
			if isActive {
				sec.Meetings = append(sec.Meetings, types.Meeting{
					Day:       dayCode,
					StartTime: startMin,
					EndTime:   endMin,
					Location:  loc,
				})
			}
		}
	}
	return sec
}

// parsing time: 1330 -> 810
func parseTimeStr(t string) int {
	if len(t) != 4 {
		return 0
	}
	hh, _ := strconv.Atoi(t[:2])
	mm, _ := strconv.Atoi(t[2:])
	return (hh * 60) + mm
}
