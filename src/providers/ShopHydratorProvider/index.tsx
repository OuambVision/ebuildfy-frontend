"use client";
import { User } from "@/types/user.types";
import { Shop } from "@/types";
import { useAuthStore, useShopStore } from "@/store";
import { ReactNode, useEffect } from "react";

import { getMyShops } from "@/services";

// This provider hydrates the shop data for the logged-in user
export function ShopHydratorProvider({ children }: { children: ReactNode }) {
    const setShops = useShopStore((s) => s.setShops);
    const activeShopId = useShopStore((s) => s.activeShopId);
    const setActiveShopId = useShopStore((s) => s.setActiveShopId);
    const user = useAuthStore((s) => s.user) as User | null;

    useEffect(() => {
        const fetchShops = async () => {
            try {
                if (!user?.id) return;

                //Fetch shops
                const shops = await getMyShops(String(user.id));
                setShops(shops);

                // Set active shop if not set
                const activeShop = shops.find((s: Shop) => s.active);
                setActiveShopId(activeShop?.id ?? null);
            } catch (error) {
                console.error("Failed to fetch shops:");
            }
        };

        fetchShops();
    }, [setShops, setActiveShopId, user, activeShopId]);

    return <>{children}</>;
}
