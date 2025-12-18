// the time slots for a single meeting of a section
export interface Meeting {
    day: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: number; // minutes from midnight (e.g. 600 = 10:00 AM)
    endTime: number; // minutes from midnight
    location: string; // "Horizon Hall 1010"
}

// section within a course chosen by the user
export interface Section {
    id: string; // CRN ex) "17837"
    courseId: string; // "CS100" - link to parent course collection
    section: string; // "001" - section number
    professor: string; // "Smith, John"

    meetings: Meeting[];
}

// schedule created by the user
export interface Schedule {
    id: string;
    userId: string;
    name: string; // "plan A"
    sections: Section[];
}

// course information retrieved from the course catalog
export interface CourseResult {
    id: string; // "CS110"
    title: string; // "Principles of Computing"
    code: string; // "110"
}
