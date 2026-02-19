import { cn } from "@/libs/cn";
import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: boolean;
    required?: boolean;
};

export default function Input({
    className,
    label,
    error,
    required,
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block mb-1 text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                {...props}
                className={cn(
                    "w-full rounded-md border bg-transparent px-3 py-2 text-sm",
                    error ? "border-red-500" : "border-gray-400",
                    "focus:outline-none focus:ring-1 focus:ring-black",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
            />
            {error && <p className="text-xs text-red-500 mt-1">Required</p>}
        </div>
    );
}
