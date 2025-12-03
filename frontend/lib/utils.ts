import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface User {
    UserID: string;
    Name: string;
    Email: string;
    AvatarURL: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/auth/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSignOut = async () => {
        try {
            // clear cookie
            await fetch(`${BACKEND_URL}/auth/signout`, {
                method: "GET",
                credentials: "include",
            });
            // clear local state
            setUser(null);
            router.refresh();
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return { user, loading, handleSignOut };
}
