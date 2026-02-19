import { cn } from "@/libs/cn";
import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
        | "primary"
        | "secondary"
        | "outline"
        | "ghost"
        | "white"
        | "destructive";
};

export default function Button({
    variant = "primary",
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer",
                "focus:outline-none focus:ring-1 focus:ring-black",
                variant === "primary" &&
                    "bg-black text-white hover:bg-neutral-800",
                variant === "secondary" &&
                    "bg-main-600 text-white hover:bg-main-500",
                variant === "white" &&
                    "bg-white text-black hover:bg-neutral-100",
                variant === "outline" &&
                    "border border-gray-400 hover:bg-neutral-100",
                variant === "ghost" && "hover:bg-neutral-100",
                variant === "destructive" &&
                    "bg-red-600 text-white hover:bg-red-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
        />
    );
}
