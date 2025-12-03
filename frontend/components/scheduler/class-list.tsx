import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClassInfo } from "@/lib/classes";

export default function ClassList() {
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

    return (
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-muted-foreground">
                Classes
            </h2>

            <Dialog.Dialog open={showForm} onOpenChange={setShowForm}>
                <Dialog.DialogTrigger asChild>
                    <Button className="bg-muted-foreground hover:bg-muted-foreground/90 text-white text-sm">
                        Add Class
                    </Button>
                </Dialog.DialogTrigger>
                <Dialog.DialogContent className="sm:max-w-[600px] bg-white rounded-none">
                    <Dialog.DialogHeader>
                        <Dialog.DialogTitle>Add New Class</Dialog.DialogTitle>
                        <Dialog.DialogDescription>
                            Enter the details for your new class schedule.
                        </Dialog.DialogDescription>
                    </Dialog.DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Class Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.className}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            className: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-1 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
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
                                            section: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-1 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
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
                                    value={formData.professor}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            professor: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-1 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
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
                                            time: e.target.value,
                                        })
                                    }
                                    placeholder="9:00 AM - 10:30 AM"
                                    className="w-full px-3 py-1 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
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
                                        location: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-1 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
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
                                        onClick={() => toggleDay(day)}
                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                            formData.days.includes(day)
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
                                    value={formData.startDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            startDate: e.target.value,
                                        })
                                    }
                                    placeholder="1 Aug 2024"
                                    className="w-full px-3 py-1 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
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
                                            endDate: e.target.value,
                                        })
                                    }
                                    placeholder="10 Dec 2024"
                                    className="w-full px-3 py-1 border border-ring/30 rounded-md focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <Dialog.DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowForm(false)}
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
    );
}
