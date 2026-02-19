"use client";

import { LogOut, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { logoutService } from "@/services";
import { useAuthStore } from "@/store";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useToast } from "@/providers/ToastProvider";

const links = [
    {
        name: "Account",
        href: "/template1/account",
        icon: User,
    },
    {
        name: "Orders",
        href: "/template1/account/orders",
        icon: ShoppingBag,
    },
    {
        name: "Logout",
        href: "/logout",
        icon: LogOut,
    },
];

export default function UserAccount() {
    const { toast } = useToast();
    const confirm = useConfirm();
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        const ok = await confirm({
            title: "Log out?",
            description: "You will be signed out from your account.",
            confirmText: "Log out",
            cancelText: "Cancel",
            danger: true,
        });

        if (!ok) return;

        try {
            logoutService();
            logout();
            router.push("/template1");
            toast.success("You have been logged out successfully.");
        } catch {
            toast.error(
                "An error occurred while logging out. Please try again."
            );
        }
    };

    return (
        <div className="relative" ref={ref}>
            {/* BUTTON */}
            <button
                onClick={() => setOpen((p) => !p)}
                className="relative p-1 hover:bg-gray-100 hover:text-gray-700 rounded-full transition cursor-pointer"
            >
                <User className="w-5 h-5" />
            </button>

            {/* DROPDOWN */}
            {open && (
                <div
                    className="absolute right-0 mt-2 bg-white rounded-md shadow-xl z-[999]
                     border border-gray-200 animate-fadeIn w-32"
                >
                    <div className="flex flex-col">
                        {links.map((link) => (
                            <div key={link.name}>
                                {link.name === "Logout" ? (
                                    <button
                                        onClick={() => {
                                            setOpen(false);
                                            handleLogout();
                                        }}
                                        className="text-sm text-gray-700 hover:bg-gray-100 p-2 block w-full text-left cursor-pointer"
                                    >
                                        <link.icon
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="text-sm text-gray-700 hover:bg-gray-100 p-2 block"
                                    >
                                        <link.icon
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
