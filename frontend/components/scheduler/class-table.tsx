"use client";

import { useState } from "react";

import * as Table from "@/components/ui/table";
import { ClassInfo } from "@/lib/classes";

export default function ClassTable() {
    const [classes, setClasses] = useState<ClassInfo[]>([
        {
            id: "1",
            className: "Computer Science 101",
            section: "A",
            professor: "Dr. Smith",
            time: "9:00 AM - 10:30 AM",
            location: "Room 204",
            days: ["Mon", "Wed", "Fri"],
            startDate: "1 Aug 2024",
            endDate: "10 Dec 2024",
        },
        {
            id: "2",
            className: "Mathematics 201",
            section: "B",
            professor: "Dr. Johnson",
            time: "11:00 AM - 12:30 PM",
            location: "Room 305",
            days: ["Tue", "Thu"],
            startDate: "1 Aug 2024",
            endDate: "10 Dec 2024",
        },
    ]);

    return (
        <div className="flex-1">
            <div className="bg-white border border-ring/30 overflow-hidden">
                <Table.Table>
                    <Table.TableHeader>
                        <Table.TableRow className="bg-background hover:bg-background">
                            <Table.TableHead>Class</Table.TableHead>
                            <Table.TableHead>Section</Table.TableHead>
                            <Table.TableHead>Professor</Table.TableHead>
                            <Table.TableHead>Time</Table.TableHead>
                            <Table.TableHead>Location</Table.TableHead>
                            <Table.TableHead>Days</Table.TableHead>
                            <Table.TableHead>Duration</Table.TableHead>
                        </Table.TableRow>
                    </Table.TableHeader>
                    <Table.TableBody>
                        {classes.map((classInfo) => (
                            <Table.TableRow key={classInfo.id}>
                                <Table.TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center text-white text-xs">
                                            {classInfo.className.charAt(0)}
                                        </div>
                                        <span className="text-muted-foreground font-medium">
                                            {classInfo.className}
                                        </span>
                                    </div>
                                </Table.TableCell>
                                <Table.TableCell>
                                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                        {classInfo.section}
                                    </span>
                                </Table.TableCell>
                                <Table.TableCell className="text-foreground/50">
                                    {classInfo.professor}
                                </Table.TableCell>
                                <Table.TableCell className="text-foreground/50">
                                    {classInfo.time}
                                </Table.TableCell>
                                <Table.TableCell className="text-foreground/50">
                                    {classInfo.location}
                                </Table.TableCell>
                                <Table.TableCell>
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {classInfo.days.map((day) => (
                                            <span
                                                key={day}
                                                className="text-xs text-muted-foreground font-medium"
                                            >
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                </Table.TableCell>
                                <Table.TableCell className="text-foreground/50 text-xs">
                                    {classInfo.startDate} - {classInfo.endDate}
                                </Table.TableCell>
                            </Table.TableRow>
                        ))}
                    </Table.TableBody>
                </Table.Table>
            </div>

            {classes.length > 0 && (
                <div className="bg-white border border-ring/30 overflow-hidden mt-3">
                    <div className="grid grid-cols-[100px_3fr_3fr_3fr_3fr_3fr_100px] border-b border-ring/30">
                        <div className="p-2 bg-background border-r border-ring/30 text-sm text-foreground/50">
                            Time
                        </div>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Weekend"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="p-2 bg-background border-r last:border-r-0 border-ring/30 text-sm text-foreground/50 text-center"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    {[
                        "8:00 AM",
                        "9:00 AM",
                        "10:00 AM",
                        "11:00 AM",
                        "12:00 PM",
                        "1:00 PM",
                        "2:00 PM",
                        "3:00 PM",
                        "4:00 PM",
                    ].map((time) => (
                        <div
                            key={time}
                            className="grid grid-cols-[100px_3fr_3fr_3fr_3fr_3fr_100px] border-b last:border-b-0 border-ring/30"
                        >
                            <div className="p-2 border-r border-ring/30 text-sm text-foreground/50">
                                {time}
                            </div>
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Weekend"].map(
                                (day) => {
                                    const classForSlot = classes.find((c) =>
                                        c.days.includes(day)
                                    );
                                    return (
                                        <div
                                            key={day}
                                            className="border-r last:border-r-0 border-ring/30"
                                        >
                                            {classForSlot && (
                                                <div className="bg-muted-foreground/5 p-2">
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {classForSlot.className}
                                                    </div>
                                                    <div className="text-xs text-foreground/50 mt-1">
                                                        {classForSlot.location}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
