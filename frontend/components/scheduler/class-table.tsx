"use client";

import { useState } from "react";
import * as Table from "@/components/ui/table";
import { Section } from "@/lib/classes";
import { dayMap, formatTime, timeStringToMinutes } from "@/lib/utils";

export default function ClassTable() {
    const [classes, setClasses] = useState<Section[]>([
        {
            id: "1",
            courseId: "CS101",
            section: "001",
            professor: "Dr. Smith",
            meetings: [
                { day: 1, startTime: 540, endTime: 630, location: "Room 204" },
                { day: 3, startTime: 540, endTime: 630, location: "Room 204" },
                { day: 5, startTime: 540, endTime: 630, location: "Room 204" },
            ],
        },
        {
            id: "2",
            courseId: "MATH201",
            section: "002",
            professor: "Dr. Johnson",
            meetings: [
                { day: 2, startTime: 660, endTime: 750, location: "Room 305" },
                { day: 4, startTime: 660, endTime: 750, location: "Room 305" },
            ],
        },
    ]);

    // grid time slots from 8:00 AM to 4:00 PM
    const timeSlots = [
        "8:00 AM",
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
    ];

    return (
        <div className="flex-1 space-y-8">
            <div className="bg-white border border-ring/30 overflow-hidden rounded-md">
                <Table.Table>
                    <Table.TableHeader>
                        <Table.TableRow className="bg-muted/50 hover:bg-muted/50">
                            <Table.TableHead>Class</Table.TableHead>
                            <Table.TableHead>Section</Table.TableHead>
                            <Table.TableHead>Professor</Table.TableHead>
                            <Table.TableHead>Schedule Details</Table.TableHead>
                        </Table.TableRow>
                    </Table.TableHeader>
                    <Table.TableBody>
                        {classes.length === 0 && (
                            <Table.TableRow>
                                <Table.TableCell
                                    colSpan={4}
                                    className="text-center h-24 text-muted-foreground"
                                >
                                    No classes added.
                                </Table.TableCell>
                            </Table.TableRow>
                        )}
                        {classes.map((section) => (
                            <Table.TableRow key={section.id}>
                                <Table.TableCell>
                                    <span>{section.courseId}</span>
                                </Table.TableCell>
                                <Table.TableCell>
                                    <span className="px-2 py-1 rounded-md text-xs bg-muted text-foreground border border-ring/30">
                                        {section.section}
                                    </span>
                                </Table.TableCell>
                                <Table.TableCell className="text-muted-foreground">
                                    {section.professor}
                                </Table.TableCell>
                                <Table.TableCell>
                                    <div className="flex gap-3">
                                        {section.meetings.map((m, idx) => (
                                            <div
                                                key={idx}
                                                className="text-xs text-muted-foreground flex items-center gap-1"
                                            >
                                                <span className="font-semibold text-foreground">
                                                    {dayMap[m.day]}
                                                </span>
                                                <span>
                                                    {formatTime(m.startTime)} -{" "}
                                                    {formatTime(m.endTime)}
                                                </span>
                                                <span className="text-muted-foreground/50">
                                                    ({m.location})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Table.TableCell>
                            </Table.TableRow>
                        ))}
                    </Table.TableBody>
                </Table.Table>
            </div>

            {classes.length > 0 && (
                <div className="bg-white border border-ring/30 overflow-hidden rounded-md">
                    <div className="grid grid-cols-[70px_repeat(5,1fr)] border-b border-ring/30 bg-muted/50">
                        <div className="p-1 border-r border-ring/30 text-xs font-semibold text-muted-foreground text-center">
                            Time
                        </div>
                        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                            <div
                                key={day}
                                className="p-1 border-r last:border-r-0 border-ring/30 text-xs font-semibold text-muted-foreground text-center"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {timeSlots.map((timeLabel) => {
                        const slotStart = timeStringToMinutes(timeLabel);
                        const slotEnd = slotStart + 60;

                        return (
                            <div
                                key={timeLabel}
                                className="grid grid-cols-[70px_repeat(5,1fr)] border-b last:border-b-0 border-ring/30 min-h-[80px]"
                            >
                                <div className="border-r border-ring/30 text-xs text-muted-foreground flex items-start justify-center pt-1 bg-muted/5">
                                    {timeLabel}
                                </div>

                                {[1, 2, 3, 4, 5].map((dayIndex) => {
                                    // 1=Mon, 2=Tue...
                                    // find a meeting that happens on this day AND starts in this hour slot
                                    // NOTE: this logic assumes one class per slot for simplicity
                                    let matchedSection = null;
                                    let matchedMeeting = null;

                                    for (const section of classes) {
                                        const meeting = section.meetings.find(
                                            (m) =>
                                                m.day === dayIndex &&
                                                m.startTime >= slotStart &&
                                                m.startTime < slotEnd
                                        );
                                        if (meeting) {
                                            matchedSection = section;
                                            matchedMeeting = meeting;
                                            break;
                                        }
                                    }

                                    return (
                                        <div
                                            key={dayIndex}
                                            className="border-r last:border-r-0 border-ring/30 p-1 relative"
                                        >
                                            {matchedSection &&
                                                matchedMeeting && (
                                                    <div className="bg-accent border p-1 h-full flex flex-col justify-between text-xs">
                                                        <div>
                                                            <div className="font-semibold">
                                                                {
                                                                    matchedSection.courseId
                                                                }
                                                            </div>
                                                            <div className="scale-90 origin-top-left">
                                                                {
                                                                    matchedMeeting.location
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="text-[10px] font-medium">
                                                            {formatTime(
                                                                matchedMeeting.startTime
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
