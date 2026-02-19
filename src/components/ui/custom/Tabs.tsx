"use client";

import { cn } from "@/libs/cn";
import { useState } from "react";

type Tab = {
    label: string;
    value: string;
};

export default function Tabs({
    tabs,
    children,
    className,
}: {
    tabs: Tab[];
    children: (active: string) => React.ReactNode;
    className?: string;
}) {
    const [active, setActive] = useState(tabs[0].value);

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex gap-6 border-b border-gray-400">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActive(tab.value)}
                        className={cn(
                            "pb-2 text-sm font-medium transition cursor-pointer",
                            active === tab.value
                                ? "border-b-2 border-black text-black"
                                : "text-neutral-600 hover:text-black"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>{children(active)}</div>
        </div>
    );
}
