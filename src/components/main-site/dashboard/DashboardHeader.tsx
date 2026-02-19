"use client";

import { logoutService } from "@/services";
import { useAuthStore, useShopStore } from "@/store";
import ShopBadge from "@/components/common/ShopBadge";
import { useConfirm } from "@/providers/ConfirmProvider";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useToast } from "@/providers/ToastProvider";
import { Bell, CheckCircle, LogOut, Menu, Store, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DashboardHeaderProps = {
    sidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
};

export default function DashboardHeader({
    sidebarOpen,
    setSidebarOpen,
}: DashboardHeaderProps) {
    const { toast } = useToast();
    const confirm = useConfirm();
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);
    const shops = useShopStore((s) => s.shops);
    const activeShop = shops.find((s) => s.active);

    const handleLogout = async () => {
        const action = await confirm({
            title: "Log out?",
            description: "You will be signed out from your account.",
            confirmText: "Log out",
            cancelText: "Cancel",
            danger: true,
        });

        if (action === "save") {
            try {
                logoutService();
                logout();
                router.push("/");
                toast.success("You have been logged out successfully.");
            } catch (error) {
                toast.error(
                    "An error occurred while logging out. Please try again."
                );
            }
        } else return;
    };

    return (
        <header className="h-14 border-b bg-main-700 flex items-center justify-between px-3 md:px-4 text-white relative">
            {/* Hamburger mobile */}
            <button
                className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-main-600 cursor-pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu className="h-4 w-4" />
            </button>

            {/* Logo desktop */}
            <Link
                href="/"
                className="font-semibold text-lg hidden md:inline-block"
            >
                ebuildfy
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
                {/* Notifications */}
                <button className="gap-1 flex items-center text-white cursor-pointer">
                    <Bell className="h-4 w-4" />
                </button>

                {/* Boutique */}
                <Dropdown
                    trigger={
                        <button className="gap-1 flex items-center text-white cursor-pointer">
                            <ShopBadge name={activeShop?.name || "My Shop"} />
                            <span className="max-w-[140px] truncate text-sm hidden md:inline-block">
                                {activeShop?.name}
                            </span>
                        </button>
                    }
                    menuClassName="p-2 text-black"
                >
                    <DropdownItem className="bg-main-50 hover:bg-main-700 hover:text-white rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ShopBadge name={activeShop?.name || "My Shop"} />
                            {activeShop?.name}
                        </div>

                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </DropdownItem>

                    <DropdownItem
                        href="/dashboard/all-shops"
                        className="hover:bg-main-700 hover:text-white rounded-md my-2"
                    >
                        <Store className="h-4 w-4" />
                        Toutes les boutiques
                    </DropdownItem>

                    <div className="border-t" />

                    <DropdownItem className="hover:bg-main-700 hover:text-white rounded-md my-2">
                        <User className="h-4 w-4" />
                        <div className="flex flex-col ">
                            <span className="font-semibold">{user?.name}</span>
                            <span className="text-xs font-medium">
                                {user?.email}
                            </span>
                        </div>
                    </DropdownItem>

                    <DropdownItem
                        className="hover:bg-main-700 hover:text-white rounded-md my-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 text-red-600" />
                        Se déconnecter
                    </DropdownItem>
                </Dropdown>
            </div>
        </header>
    );
}
