"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Crumb = {
    label: string;
    href: string;
};

export default function Breadcrumb() {
    const pathname = usePathname(); // ex: /dashboard/products/edit
    const segments = pathname.split("/").filter(Boolean); // ['dashboard', 'products', 'edit']

    // Créer les liens cumulés
    const crumbs: Crumb[] = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        // transformer dash/underscore en mot lisible
        const label = segment.replace(/[-_]/g, " ");
        return { label, href };
    });

    return (
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
                <li>
                    <Link href="/" className="font-medium capitalize">
                        <Home size={16} />
                    </Link>
                </li>

                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <li key={crumb.href} className="flex items-center">
                            <span className="mx-1">{"/"}</span>
                            {isLast ? (
                                <span className="font-bold capitalize">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link href={crumb.href} className="capitalize">
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
