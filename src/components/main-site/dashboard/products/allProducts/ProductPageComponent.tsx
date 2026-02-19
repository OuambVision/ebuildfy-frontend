"use client";

import { useShopLoader, useShopProducts } from "@/hooks";
import { useShopStore } from "@/store";
import { useToast } from "@/providers/ToastProvider";
import ProductsClient from "./ProductsClient";

import { useState } from "react";

export default function ProductsPageComponent({
    page,
    search,
    limit,
}: {
    page: number;
    search: string;
    limit: number;
}) {
    const shops = useShopStore((state) => state.shops);
    const activeShopId = useShopStore((state) => state.activeShopId);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast();

    const {
        data: products,
        isLoading,
        isFetching,
    } = useShopProducts({
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

    console.log("shops", shops);

    return (
        <ProductsClient
            {...products}
            search={search}
            limit={limit}
            isFetching={isFetching}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            deleting={deleting}
            setDeleting={setDeleting}
            toast={toast}
        />
    );
}
