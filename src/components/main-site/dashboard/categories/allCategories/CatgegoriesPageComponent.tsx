"use client";

import { usePartialShopCategories, useShopLoader } from "@/hooks";
import { useShopStore } from "@/store";
import { useToast } from "@/providers/ToastProvider";
import { useState } from "react";
import CategoriesClient from "./CategoriesClient";

export default function CategoriesPageComponent({
    page,
    search,
    limit,
}: {
    page: number;
    search: string;
    limit: number;
}) {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const activeShopId = useShopStore((state) => state.activeShopId);
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast();

    const { data: categories, isLoading } = usePartialShopCategories({
        shopId: activeShopId || "",
        page,
        search,
        limit,
    });

    // ✅ Hook custom pour loader + skeleton
    const loader = useShopLoader({
        conditions: [isLoading, !activeShopId, deleting],
    });

    if (loader) return loader;

    return (
        <CategoriesClient
            {...categories}
            search={search}
            limit={limit}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            deleting={deleting}
            setDeleting={setDeleting}
            toast={toast}
        />
    );
}
