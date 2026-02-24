"use client";

import { useAuthStore, useShopStore } from "@/store";
import { useShopLoader } from "@/hooks";
import Link from "next/link";
import { useState } from "react";
import ShopList from "./ShopList";

export default function AllShops() {
    const shops = useShopStore((s) => s.shops);
    const user = useAuthStore((s) => s.user);
    const [tab, setTab] = useState("active");

    const activeShops = shops?.filter((s) => s.status === "active");
    const draftShops = shops?.filter((s) => s.status === "draft");
    const inactiveShops = shops?.filter((s) => s.status === "suspended");

    const statusList = [
        { label: "Actives", value: "active" },
        { label: "Drafts", value: "draft" },
        { label: "Inactives", value: "suspended" },
    ];

    // Custom loader
    const loader = useShopLoader({
        conditions: [
            !shops,
            !user,
            (tab === "active" && !activeShops) ||
                (tab === "draft" && !draftShops) ||
                (tab === "suspended" && !inactiveShops),
        ],
    });

    if (loader) return loader;

    return (
        <div className="h-full flex items-center justify-center">
            <div className="max-w-3xl mx-auto bg-white rounded-xl p-4 md:p-6 shadow-2xl w-full ">
                {/* Header */}
                <div className="mb-8 space-y-8">
                    <div className="text-base font-extrabold">
                        <Link href="/">Ebuildfy</Link>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-sm font-semibold">
                            Welcome Back, {user?.name}
                        </h2>

                        <Link
                            href="/dashboard/shops/new"
                            className="text-sm text-white bg-main-700 hover:bg-main-600 px-2 py-1 rounded-md w-full md:w-auto text-center font-bold"
                        >
                            + New Shop
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b mb-6">
                    {statusList.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => setTab(status.value)}
                            className={`pb-2 text-sm cursor-pointer ${
                                tab === status.value
                                    ? "border-b-2 border-main-700 text-main-700 font-bold"
                                    : "text-gray-500 font-medium"
                            }`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {tab === "active" ? (
                    <ShopList shops={activeShops} />
                ) : tab === "draft" ? (
                    <ShopList shops={draftShops} />
                ) : (
                    <ShopList shops={inactiveShops} />
                )}
            </div>
        </div>
    );
}
