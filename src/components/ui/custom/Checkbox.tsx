import { cn } from "@/libs/cn";
import * as React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ className, ...props }: CheckboxProps) {
    return (
        <input
            type="checkbox"
            {...props}
            className={cn(
                "h-4 w-4 rounded border border-gray-400",
                "focus:ring-0 focus:ring-black",
                "accent-black cursor-pointer",
                className
            )}
        />
    );
}
