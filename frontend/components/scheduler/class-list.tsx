import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CourseResult, Schedule, Section } from "@/lib/classes";
import { BACKEND_URL } from "@/lib/constants";
import { dayMap, formatTime, useAuth } from "@/lib/utils";

export default function ClassList() {
    const { user } = useAuth();

    // state for the users saved schedule
    const [myClasses, setMyClasses] = useState<Section[]>([]);

    const [showForm, setShowForm] = useState(false);

    // selection state for the add class form
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<CourseResult[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<CourseResult | null>(
        null
    );
    const [availableSections, setAvailableSections] = useState<Section[]>([]);
    const [selectedSection, setSelectedSection] = useState<Section | null>(
        null
    );

    // search courses
    // hits RAM cache
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        // optimize: don't search again if the selected course matches the query
        if (selectedCourse && searchQuery === selectedCourse.id) {
            return;
        }

        const fetchCourses = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/search?q=${searchQuery}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data || []);
                }
            } catch (error) {
                console.error("Failed to search courses:", error);
            }
        };

        const timeoutId = setTimeout(fetchCourses, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // fetch sections
    // hits firestore lazy load
    useEffect(() => {
        if (!selectedCourse) return;

        const fetchSections = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/sections?courseID=${selectedCourse.id}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setAvailableSections(data || []);
                }
            } catch (error) {
                console.error("Failed to fetch sections:", error);
            }
        };

        fetchSections();
        setSelectedSection(null);
    }, [selectedCourse]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSection) return;

        // add full section object to the list
        setMyClasses([...myClasses, selectedSection]);

        // reset form
        setShowForm(false);
        setSearchQuery("");
        setSelectedCourse(null);
        setSelectedSection(null);
    };

    const handleSaveSchedule = async () => {
        if (myClasses.length === 0) {
            alert("Your schedule is empty!");
            return;
        }

        if (!user || !user.UserID) {
            alert("You must be logged in to save a schedule.");
            return;
        }

        setIsSaving(true);

        const userID = user.UserID;
        const payload: Schedule = {
            id: "",
            userId: userID,
            name: scheduleName,
            sections: myClasses,
        };

        try {
            // r.POST("/users/:userID/schedules", api.SaveSchedule)
            const res = await fetch(
                `${BACKEND_URL}/users/${userID}/schedules`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                const data = await res.json();
                alert(`Success! Schedule saved.`);
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to connect to server.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-muted-foreground">
                    Current Semester
                </h2>

                <Dialog.Dialog open={showForm} onOpenChange={setShowForm}>
                    <Dialog.DialogTrigger asChild>
                        <Button className="bg-muted-foreground hover:bg-muted-foreground/90 text-white text-sm">
                            Add Class
                        </Button>
                    </Dialog.DialogTrigger>

                    <Dialog.DialogContent className="sm:max-w-[500px] bg-white rounded-lg p-6">
                        <Dialog.DialogHeader>
                            <Dialog.DialogTitle>Add Class</Dialog.DialogTitle>
                            <Dialog.DialogDescription>
                                Search for a course and select your section.
                            </Dialog.DialogDescription>
                        </Dialog.DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 mt-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    1. Search Course
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. CS 110"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                        disabled={!!selectedCourse}
                                    />
                                    {searchResults.length > 0 &&
                                        !selectedCourse && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                                                {searchResults.map((course) => (
                                                    <button
                                                        key={course.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCourse(
                                                                course
                                                            );
                                                            setSearchQuery(
                                                                course.id
                                                            );
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                                    >
                                                        <span className="font-bold">
                                                            {course.id}
                                                        </span>
                                                        <span className="text-gray-500 ml-2">
                                                            - {course.title}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                </div>
                                {selectedCourse && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCourse(null);
                                            setSearchQuery("");
                                        }}
                                        className="text-xs text-blue-500 hover:underline"
                                    >
                                        Change Course
                                    </button>
                                )}
                            </div>

                            {selectedCourse && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        2. Select Section
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md outline-none bg-white"
                                        onChange={(e) => {
                                            const sec = availableSections.find(
                                                (s) => s.id === e.target.value
                                            );
                                            setSelectedSection(sec || null);
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            -- Choose a Section --
                                        </option>
                                        {availableSections.map((sec) => (
                                            <option key={sec.id} value={sec.id}>
                                                Section {sec.section} -{" "}
                                                {sec.professor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedSection && (
                                <div className="p-3 bg-gray-50 rounded-md border text-sm">
                                    <p className="font-semibold text-gray-700">
                                        Summary:
                                    </p>
                                    <p>
                                        {selectedCourse?.id} -{" "}
                                        {selectedCourse?.title}
                                    </p>
                                    <p>Prof: {selectedSection.professor}</p>
                                    <div className="mt-2 text-gray-500">
                                        {selectedSection.meetings.map(
                                            (m, i) => (
                                                <div key={i}>
                                                    {dayMap[m.day]}{" "}
                                                    {formatTime(m.startTime)} -{" "}
                                                    {formatTime(m.endTime)} (
                                                    {m.location})
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            <Dialog.DialogFooter>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!selectedSection}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Add to Schedule
                                </Button>
                            </Dialog.DialogFooter>
                        </form>
                    </Dialog.DialogContent>
                </Dialog.Dialog>
            </div>

            <div className="space-y-3">
                {myClasses.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">
                        No classes added yet.
                    </p>
                )}
                {myClasses.map((cls) => (
                    <div
                        key={cls.id}
                        className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-bold text-lg">
                                {cls.courseId}{" "}
                                <span className="text-gray-500 text-sm font-normal">
                                    Section {cls.section}
                                </span>
                            </h3>
                            <p className="text-sm text-gray-600">
                                {cls.professor}
                            </p>
                        </div>
                        <div className="text-right text-sm">
                            {cls.meetings.map((m, i) => (
                                <div key={i} className="text-gray-700">
                                    <span className="font-medium">
                                        {dayMap[m.day]}
                                    </span>{" "}
                                    {formatTime(m.startTime)} -{" "}
                                    {formatTime(m.endTime)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
