"use client";

import { cn } from "@/libs/cn";

type NumberInputProps = {
    value: number | "";
    onChange: (value: number | "") => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
};

export default function NumberInput({
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    className,
}: NumberInputProps) {
    return (
        <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
                const v = e.target.value;
                onChange(v === "" ? "" : Number(v));
            }}
            className={cn(
                "w-24 rounded-md border px-2 py-2 text-sm outline-none border-gray-400",
                "focus:ring-1 focus:ring-black",
                "[appearance:textfield]",
                "[&::-webkit-inner-spin-button]:opacity-100",
                "[&::-webkit-outer-spin-button]:opacity-100",
                className
            )}
        />
    );
}
