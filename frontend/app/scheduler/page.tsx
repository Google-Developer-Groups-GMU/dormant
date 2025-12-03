"use client";

import type React from "react";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/utils";

import gdg_logo from "@/public/logo.png";

import { Spinner } from "@/components/ui/spinner";
import ClassList from "@/components/scheduler/class-list";
import ClassTable from "@/components/scheduler/class-table";

export default function SchedulerPage() {
    const router = useRouter();
    const { user, loading, handleSignOut } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner />
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-background pt-4">
                <div className="relative bg-white shadow-md border border-ring/30 overflow-hidden mx-4">
                    <div className="flex items-center justify-between p-3 px-6 border-b border-ring/30">
                        <div
                            className="text-muted-foreground font-serif font-normal text-lg flex items-center hover:cursor-pointer"
                            onClick={() => (window.location.href = "/")}
                        >
                            <Image
                                src={gdg_logo}
                                alt="GDG Logo"
                                width={20}
                                height={20}
                                className="inline-block mr-2 w-6 h-auto"
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
                        <nav className="w-48 bg-[var(--background-muted)]/30 border-r border-ring/30 p-4 space-y-2">
                            <div className="text-xs font-medium text-foreground/50 uppercase tracking-wide mb-3 border-b pb-2">
                                Navigation
                            </div>
                            {["Current", "Plan"].map((item) => (
                                <div
                                    key={item}
                                    className={`text-sm cursor-pointer ${
                                        item === "Current"
                                            ? "text-muted-foreground font-medium"
                                            : "text-muted-foreground/70 hover:text-muted-foreground/80"
                                    }`}
                                >
                                    {item}
                                </div>
                            ))}
                        </nav>

                        <div className="flex-1 p-6">
                            <ClassList />
                            <ClassTable />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
