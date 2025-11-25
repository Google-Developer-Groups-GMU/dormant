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
import * as Dialog from "@/components/ui/dialog";
import * as Table from "@/components/ui/table";

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

    // showForm now controls the Dialog open state
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
        setShowForm(false); // Close dialog on submit
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner />
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-background pt-4">
                <div className="relative bg-white rounded-lg shadow-md border border-ring/30 overflow-hidden mx-4">
                    {/* Header */}
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

                    <div className="flex">
                        {/* Sidebar */}
                        <nav className="w-48 bg-[var(--background-muted)]/30 border-r border-ring/30 p-4 space-y-2">
                            <div className="text-xs font-medium text-foreground/50 uppercase tracking-wide mb-3">
                                Navigation
                            </div>
                            {["Current", "Plan"].map((item) => (
                                <div
                                    key={item}
                                    className={`text-sm py-1 cursor-pointer ${
                                        item === "Current"
                                            ? "text-muted-foreground font-medium"
                                            : "text-muted-foreground/70 hover:text-muted-foreground/80"
                                    }`}
                                >
                                    {item}
                                </div>
                            ))}
                        </nav>

                        {/* Main Content */}
                        <div className="flex-1 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-semibold text-muted-foreground">
                                    Classes
                                </h2>

                                {/* Dialog Trigger Button */}
                                <Dialog.Dialog
                                    open={showForm}
                                    onOpenChange={setShowForm}
                                >
                                    <Dialog.DialogTrigger asChild>
                                        <Button className="bg-muted-foreground hover:bg-muted-foreground/90 text-white text-sm">
                                            Add Class
                                        </Button>
                                    </Dialog.DialogTrigger>
                                    <Dialog.DialogContent className="sm:max-w-[600px] bg-white">
                                        <Dialog.DialogHeader>
                                            <Dialog.DialogTitle>
                                                Add New Class
                                            </Dialog.DialogTitle>
                                            <Dialog.DialogDescription>
                                                Enter the details for your new
                                                class schedule.
                                            </Dialog.DialogDescription>
                                        </Dialog.DialogHeader>

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-4 mt-4"
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
                                                <div className="flex gap-2 flex-wrap">
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
                                                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                                                formData.days.includes(
                                                                    day
                                                                )
                                                                    ? "bg-muted-foreground text-white"
                                                                    : "bg-background border border-ring/30 text-muted-foreground hover:bg-muted/20"
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

                                            <Dialog.DialogFooter>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowForm(false)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="bg-muted-foreground hover:bg-muted-foreground/90 text-white"
                                                >
                                                    Add Class
                                                </Button>
                                            </Dialog.DialogFooter>
                                        </form>
                                    </Dialog.DialogContent>
                                </Dialog.Dialog>
                            </div>

                            {/* Shadcn Table View */}
                            <div className="bg-white border border-ring/30 rounded-lg overflow-hidden">
                                <Table.Table>
                                    <Table.TableHeader>
                                        <Table.TableRow className="bg-background hover:bg-background">
                                            <Table.TableHead>
                                                Class
                                            </Table.TableHead>
                                            <Table.TableHead>
                                                Section
                                            </Table.TableHead>
                                            <Table.TableHead>
                                                Professor
                                            </Table.TableHead>
                                            <Table.TableHead>
                                                Time
                                            </Table.TableHead>
                                            <Table.TableHead>
                                                Location
                                            </Table.TableHead>
                                            <Table.TableHead>
                                                Days
                                            </Table.TableHead>
                                            <Table.TableHead>
                                                Duration
                                            </Table.TableHead>
                                        </Table.TableRow>
                                    </Table.TableHeader>
                                    <Table.TableBody>
                                        {classes.map((classInfo) => (
                                            <Table.TableRow key={classInfo.id}>
                                                <Table.TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center text-white text-xs">
                                                            {classInfo.className.charAt(
                                                                0
                                                            )}
                                                        </div>
                                                        <span className="text-muted-foreground font-medium">
                                                            {
                                                                classInfo.className
                                                            }
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
                                                </Table.TableCell>
                                                <Table.TableCell className="text-foreground/50 text-xs">
                                                    {classInfo.startDate} -{" "}
                                                    {classInfo.endDate}
                                                </Table.TableCell>
                                            </Table.TableRow>
                                        ))}
                                    </Table.TableBody>
                                </Table.Table>
                            </div>

                            {classes.length > 0 && (
                                <div className="bg-white border border-ring/30 rounded-lg overflow-hidden mt-3">
                                    <div className="grid grid-cols-[2fr_3fr_3fr_3fr_3fr_3fr_1fr_1fr] border-b border-ring/30">
                                        <div className="p-2 bg-background border-r border-ring/30 text-sm text-foreground/50">
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
                                                className="p-2 bg-background border-r last:border-r-0 border-ring/30 text-sm text-foreground/50 text-center"
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Time slots */}
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
                                            className="grid grid-cols-[2fr_3fr_3fr_3fr_3fr_3fr_1fr_1fr] border-b last:border-b-0 border-ring/30"
                                        >
                                            <div className="p-2 border-r border-ring/30 text-sm text-foreground/50">
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
                                                                    {
                                                                        classForSlot.className
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-foreground/50 mt-1">
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
