"use client";

import { cn } from "@/libs/cn";
import * as React from "react";

type TooltipPosition =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";

interface TooltipProps {
    content: React.ReactNode;
    position?: TooltipPosition;
    className?: string;
    children: React.ReactNode;
}

export function Tooltip({
    content,
    position = "top",
    className,
    children,
}: TooltipProps) {
    return (
        <div className="relative inline-block group">
            {children}

            <div
                className={cn(
                    "absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50",
                    className,
                    positionClasses[position] || positionClasses.top
                )}
            >
                {content}
            </div>
        </div>
    );
}

// Classes Tailwind pour positionner le tooltip
const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    "top-right": "bottom-full left-full -translate-x-full mb-2",
    "top-left": "bottom-full left-0 mb-2",
    "bottom-right": "top-full left-full -translate-x-full mt-2",
    "bottom-left": "top-full left-0 mt-2",
};
