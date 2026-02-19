"use client";

import { cn } from "@/libs/cn";
import {
    CreditCard,
    Grid,
    Home,
    Image,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Store,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Categories", href: "/dashboard/categories", icon: Grid },
    { label: "Products", href: "/dashboard/products", icon: Package },
    { label: "Media", href: "/dashboard/media", icon: Image },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { label: "Customers", href: "/dashboard/customers", icon: Users },
    {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: CreditCard,
    },
    { label: "Online Shop", href: "/dashboard/online-shop", icon: Store },
];

type DashboardSidebarProps = {
    sidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
};

export default function DashboardSidebar({
    sidebarOpen,
    setSidebarOpen,
}: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 h-full w-48 bg-gray-100 md:bg-black/5 p-4 transform transition-transform duration-300 ease-in-out z-40 md:static md:translate-x-0 mt-14 pb-14 md:pb-0 md:mt-0 rounded-tl-2xl rounded-tr-2xl flex flex-col justify-between",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Navigation principale */}
                <nav className="space-y-1 overflow-y-auto flex-1">
                    {items.map((item) => {
                        const active =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname === item.href ||
                                  pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition",
                                    active
                                        ? "bg-main-700 text-white hover:bg-main-600"
                                        : "hover:bg-gray-100",
                                    item.label === "Online Shop" &&
                                        "mt-4 border-t border-gray-300 py-4"
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="h-4 w-4 font-bold" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Settings en bas */}
                <div className="flex-shrink-0 pb-4">
                    <Link
                        href="/dashboard/settings"
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition hover:bg-gray-100",
                            pathname === "/dashboard/settings" &&
                                "bg-main-700 text-white hover:bg-main-600"
                        )}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <Settings className="h-4 w-4 font-bold" />
                        Settings
                    </Link>
                </div>
            </aside>
        </>
    );
}
