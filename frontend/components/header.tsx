import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export function Header() {
    return (
        <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20">
            <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-ring shadow-[0px_1px_0px_white]"></div>

            <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl h-9 md:h-10 px-3 rounded-full bg-[var(--background-muted)] border border-ring flex justify-between items-center relative z-30">
                <div className="pl-3 flex justify-start items-center flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div
                        className="flex flex-col justify-center sm:text-base md:text-lg lg:text-xl text-muted-foreground font-medium font-serif"
                        onClick={() => redirect("/")}
                    >
                        dormant
                    </div>

                    <div className="hidden sm:block h-5 border-l border-ring"></div>

                    <div className="hidden sm:flex flex-col justify-center items-baseline text-muted-foreground text-xs md:text-sm font-sans">
                        Scheduler
                    </div>
                </div>
                <div
                    className="h-6 sm:h-7 flex justify-center gap-2 px-3 text-sm rounded-full items-center hover:cursor-pointer text-muted-foreground bg-background border"
                    onClick={() => redirect("/auth/google")}
                >
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="w-4 h-4"
                    >
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    <span className="text-sm font-medium">Sign in</span>
                </div>
            </div>
        </div>
    );
}
