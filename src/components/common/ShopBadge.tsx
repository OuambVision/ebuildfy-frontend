"use client";

import { cn } from "@/libs/cn";

type ShopBadgeProps = {
    name: string;
    className?: string;
};

export default function ShopBadge({ name, className }: ShopBadgeProps) {
    // Séparer le nom en mots (espace, underscore ou tiret)
    const words = name
        .split(/[\s_-]+/) // regex : espace, _ ou -
        .filter(Boolean);

    // Prendre les deux premières lettres des deux premiers mots
    const initials = words
        .slice(0, 2)
        .map((w) => w.slice(0, 1).toUpperCase())
        .join("");

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center rounded-full border-green-400 bg-black text-sm font-semibold text-white h-8 w-8",
                className
            )}
            title={name} // tooltip avec le nom complet
        >
            {initials}
        </div>
    );
}
