"use client";

import { cn } from "@/libs/cn";
import { ReactNode, useEffect, useRef, useState } from "react";

type DropdownProps = {
    trigger: ReactNode;
    children: ReactNode;
    align?: "left" | "right";
    minWidth?: string;
    menuClassName?: string; // ← classes personnalisées pour le menu
};

export function Dropdown({
    trigger,
    children,
    align = "right",
    minWidth = "300px",
    menuClassName,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <div onClick={() => setOpen((v) => !v)} className="text-sm">
                {trigger}
            </div>

            {open && (
                <div
                    className={cn(
                        "absolute z-50 mt-2 rounded-md border bg-background shadow-md",
                        align === "right" ? "right-0" : "left-0",
                        menuClassName // ← classes supplémentaires
                    )}
                    style={{ minWidth }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
