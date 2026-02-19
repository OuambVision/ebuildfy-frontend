import { cn } from "@/libs/cn";
import { ReactNode } from "react";

type DropdownItemProps = {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string; // ← classes personnalisées
};

export function DropdownItem({
    children,
    onClick,
    href,
    className,
}: DropdownItemProps) {
    const baseClass =
        "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer";

    const combinedClass = cn(baseClass, className);

    if (href) {
        return (
            <a href={href} className={combinedClass}>
                {children}
            </a>
        );
    }

    return (
        <div onClick={onClick} className={combinedClass}>
            {children}
        </div>
    );
}
