"use client";

import { cn } from "@/libs/cn";
import * as React from "react";
import { IoMdArrowDropdownCircle } from "react-icons/io";

export type Option = {
    id: string | number;
    label: string;
};

export interface SelectProps {
    options: Option[];
    value?: Option | null;
    onChange?: (option: Option) => void;
    placeholder?: string;
    className?: string;

    // position du menu
    menuPosition?: "top" | "bottom";

    // mode sombre ou non (par défaut false)
    isDark?: boolean;
    required?: boolean;
    label?: string;
}

export default function Select({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    className,
    menuPosition = "top", // default top
    isDark = false, // default false
    required = false,
    label,
}: SelectProps) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleSelect = (option: Option) => {
        onChange?.(option);
        setOpen(false);
    };

    // fermer dropdown si click à l'extérieur
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ------------------- Styles dynamiques ------------------- */
    const bgColor = isDark ? "bg-neutral-900" : "bg-gray-50";
    const borderColor = isDark ? "border-neutral-700" : "border-black";
    const textColor = isDark ? "text-neutral-200" : "text-neutral-800";
    const hoverBg = isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100";
    const activeBg = isDark ? "bg-neutral-800" : "bg-neutral-100";

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full z-50", className)}
        >
            {label && (
                <label className="block mb-1 text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {/* bouton select */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    "flex w-full items-center justify-between rounded-md border px-2 py-2 text-sm cursor-pointer",
                    bgColor,
                    borderColor,
                    textColor,
                    open && "ring-1 ring-black"
                )}
            >
                <span className={cn(!value && "text-neutral-500")}>
                    {value ? value.label : placeholder}
                </span>
                <IoMdArrowDropdownCircle className="text-lg ml-1" />
            </button>

            {/* menu dropdown */}
            {open && (
                <div
                    className={cn(
                        "absolute z-20 w-full rounded-md border shadow-sm max-h-60 overflow-auto",
                        bgColor,
                        borderColor,
                        // position dynamique
                        menuPosition === "bottom"
                            ? "mt-1 top-full"
                            : "mb-1 bottom-full"
                    )}
                >
                    {options?.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelect(opt)}
                            className={cn(
                                "flex w-full px-3 py-2 text-left text-sm cursor-pointer",
                                textColor,
                                hoverBg,
                                value?.id === opt.id &&
                                    cn(activeBg, "font-medium")
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
