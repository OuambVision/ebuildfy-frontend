import { cn } from "@/libs/cn";
import * as React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
    return (
        <textarea
            {...props}
            className={cn(
                "w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm",
                "focus:outline-none focus:ring-1 focus:ring-black",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        />
    );
}
