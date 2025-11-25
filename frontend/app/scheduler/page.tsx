"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ClassInfo } from "@/lib/classes";
import { useAuth } from "@/lib/utils";

import gdg_logo from "@/public/logo.png";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SchedulerPage() {
    const router = useRouter();
    const { user, loading, handleSignOut } = useAuth();
    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

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
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        className: "",
        section: "",
        professor: "",
        time: "",
        location: "",
        days: [] as string[],
        startDate: "",
        endDate: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newClass: ClassInfo = {
            ...formData,
            id: Date.now().toString(),
        };
        setClasses([...classes, newClass]);
        setFormData({
            className: "",
            section: "",
            professor: "",
            time: "",
            location: "",
            days: [],
            startDate: "",
            endDate: "",
        });
        setShowForm(false);
    };

    const toggleDay = (day: string) => {
        setFormData((prev) => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter((d) => d !== day)
                : [...prev.days, day],
        }));
    };
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fbfaf9]">
                <Spinner />
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-[#fbfaf9]">
                {/* Dashboard Interface */}
                <div className="max-w-[1400px] mx-auto">
                    <div className="relative bg-white rounded-lg shadow-lg border border-ring/30 overflow-hidden m-4">
                        <div className="flex items-center justify-between p-4 border-b border-ring/30">
                            <div
                                className="text-muted-foreground font-serif font-normal text-lg flex items-center hover:cursor-pointer"
                                onClick={() => (window.location.href = "/")}
                            >
                                <Image
                                    src={gdg_logo}
                                    alt="GDG Logo"
                                    width={20}
                                    height={20}
                                    className="inline-block mx-2 w-6 h-auto"
                                />
                                dormant.
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {user.Email}
                                <div className="w-8 h-8 bg-muted-foreground rounded-full">
                                    <Image
                                        src={user.AvatarURL}
                                        alt="User Avatar"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar and Main Content */}
                        <div className="flex">
                            {/* Sidebar */}
                            <div className="w-48 bg-[#fbfaf9] border-r border-ring/30 p-4">
                                <nav className="space-y-2">
                                    <div className="text-xs font-medium text-[#605a57] uppercase tracking-wide mb-3">
                                        Navigation
                                    </div>
                                    {[
                                        "Home",
                                        "Customers",
                                        "Billing",
                                        "Schedules",
                                        "Invoices",
                                        "Products",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className={`text-sm py-1 cursor-pointer ${
                                                item === "Schedules"
                                                    ? "text-muted-foreground font-medium"
                                                    : "text-muted-foreground/60 hover:text-muted-foreground/80"
                                            }`}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-muted-foreground">
                                        Schedules
                                    </h2>
                                    <Button
                                        onClick={() => setShowForm(!showForm)}
                                        className="bg-muted-foreground hover:bg-muted-foreground/90 text-white text-sm"
                                    >
                                        {showForm
                                            ? "View schedules"
                                            : "Create schedule"}
                                    </Button>
                                </div>

                                {/* Form View */}
                                {showForm ? (
                                    <div className="bg-white border border-ring/30 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
                                            Add New Class
                                        </h3>
                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Class Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.className
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                className:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Section
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.section}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                section:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Professor
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.professor
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                professor:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Time
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.time}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                time: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder="9:00 AM - 10:30 AM"
                                                        className="w-full px-3 py-2 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            location:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                    Days
                                                </label>
                                                <div className="flex gap-2">
                                                    {[
                                                        "Mon",
                                                        "Tue",
                                                        "Wed",
                                                        "Thu",
                                                        "Fri",
                                                        "Sat",
                                                        "Sun",
                                                    ].map((day) => (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleDay(day)
                                                            }
                                                            className={`px-3 py-1 rounded-md text-sm ${
                                                                formData.days.includes(
                                                                    day
                                                                )
                                                                    ? "bg-muted-foreground text-white"
                                                                    : "bg-[#fbfaf9] border border-ring/30 text-muted-foreground"
                                                            }`}
                                                        >
                                                            {day}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.startDate
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                startDate:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        placeholder="1 Aug 2024"
                                                        className="w-full px-3 py-2 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.endDate}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                endDate:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        placeholder="10 Dec 2024"
                                                        className="w-full px-3 py-2 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    type="submit"
                                                    className="bg-muted-foreground hover:bg-muted-foreground/90 text-white"
                                                >
                                                    Add Class
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowForm(false)
                                                    }
                                                    className="bg-white border border-ring/30 text-muted-foreground hover:bg-[#fbfaf9]"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    // Table View
                                    <div className="bg-white border border-ring/30 rounded-lg overflow-hidden">
                                        <div className="grid grid-cols-7 gap-4 p-4 bg-[#fbfaf9] border-b border-ring/30 text-sm font-medium text-[#605a57]">
                                            <div>Class</div>
                                            <div>Section</div>
                                            <div>Professor</div>
                                            <div>Time</div>
                                            <div>Location</div>
                                            <div>Days</div>
                                            <div>Duration</div>
                                        </div>

                                        {/* Table Rows */}
                                        {classes.map((classInfo, i) => (
                                            <div
                                                key={classInfo.id}
                                                className="grid grid-cols-7 gap-4 p-4 border-b border-ring/30 text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center text-white text-xs">
                                                        {classInfo.className.charAt(
                                                            0
                                                        )}
                                                    </div>
                                                    <span className="text-muted-foreground font-medium">
                                                        {classInfo.className}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                                        {classInfo.section}
                                                    </span>
                                                </div>
                                                <div className="text-[#605a57] flex items-center">
                                                    {classInfo.professor}
                                                </div>
                                                <div className="text-[#605a57] flex items-center">
                                                    {classInfo.time}
                                                </div>
                                                <div className="text-[#605a57] flex items-center">
                                                    {classInfo.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {classInfo.days.map(
                                                        (day) => (
                                                            <span
                                                                key={day}
                                                                className="text-xs text-muted-foreground font-medium"
                                                            >
                                                                {day}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                                <div className="text-[#605a57] flex items-center text-xs">
                                                    {classInfo.startDate} -{" "}
                                                    {classInfo.endDate}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Timetable View Section */}
                                {!showForm && classes.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
                                            Weekly Timetable
                                        </h3>
                                        <div className="bg-white border border-ring/30 rounded-lg overflow-hidden">
                                            <div className="grid grid-cols-8 border-b border-ring/30">
                                                <div className="p-3 bg-[#fbfaf9] border-r border-ring/30 text-sm font-medium text-[#605a57]">
                                                    Time
                                                </div>
                                                {[
                                                    "Mon",
                                                    "Tue",
                                                    "Wed",
                                                    "Thu",
                                                    "Fri",
                                                    "Sat",
                                                    "Sun",
                                                ].map((day) => (
                                                    <div
                                                        key={day}
                                                        className="p-3 bg-[#fbfaf9] border-r last:border-r-0 border-ring/30 text-sm font-medium text-[#605a57] text-center"
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Time slots */}
                                            {[
                                                "8:00 AM",
                                                "10:00 AM",
                                                "12:00 PM",
                                                "2:00 PM",
                                                "4:00 PM",
                                            ].map((time) => (
                                                <div
                                                    key={time}
                                                    className="grid grid-cols-8 border-b last:border-b-0 border-ring/30"
                                                >
                                                    <div className="p-3 border-r border-ring/30 text-sm text-[#605a57] font-medium">
                                                        {time}
                                                    </div>
                                                    {[
                                                        "Mon",
                                                        "Tue",
                                                        "Wed",
                                                        "Thu",
                                                        "Fri",
                                                        "Sat",
                                                        "Sun",
                                                    ].map((day) => {
                                                        const classForSlot =
                                                            classes.find((c) =>
                                                                c.days.includes(
                                                                    day
                                                                )
                                                            );
                                                        return (
                                                            <div
                                                                key={day}
                                                                className="p-3 border-r last:border-r-0 border-ring/30 min-h-[60px]"
                                                            >
                                                                {classForSlot && (
                                                                    <div className="bg-muted-foreground/10 border border-muted-foreground/20 rounded p-2">
                                                                        <div className="text-xs font-medium text-muted-foreground">
                                                                            {
                                                                                classForSlot.className
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-[#605a57] mt-1">
                                                                            {
                                                                                classForSlot.location
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
