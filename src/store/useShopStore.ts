"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Shop } from "@/types/shop.types";

type ShopState = {
    shops: Shop[];
    activeShopId: string | null;
    setShops: (shops: Shop[]) => void;
    setActiveShopId: (id: string) => void;
};

export const useShopStore = create<ShopState>()(
    persist(
        (set) => ({
            shops: [],
            activeShopId: null,
            setShops: (shops) => set({ shops }),
            setActiveShopId: (id) => set({ activeShopId: id }),
        }),
        {
            name: "active-shop-id",
            partialize: (state) => ({ activeShopId: state.activeShopId }),
        }
    )
);
