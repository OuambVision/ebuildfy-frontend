/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { bulkDeleteProducts, addPoductToShop } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { useShopStore } from "@/store";
import { useConfirm } from "@/providers/ConfirmProvider";
import Button from "@/components/ui/custom/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductsHeader({
    page,
    search,
    limit,
    selectedProducts,
    setSelectedProducts,
    deleting,
    setDeleting,
    toast,
}: {
    page: number;
    search: string;
    limit: number;
    selectedProducts: string[];
    setSelectedProducts: (products: string[]) => void;
    deleting: boolean;
    setDeleting: (deleting: boolean) => void;
    toast: any;
}) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const activeShopId = useShopStore((s) => s.activeShopId);
    const [creating, setCreating] = useState(false);
    const confirm = useConfirm();

    const handleCreateProduct = async () => {
        setCreating(true);
        if (!activeShopId) return;
        const product = await addPoductToShop(activeShopId);
        queryClient.invalidateQueries({
            queryKey: ["shop-products", activeShopId, page, search, limit],
        });
        router.replace(`/dashboard/products/${product.doc.id}`);
        setCreating(false);
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;

        const action = await confirm({
            title: "Delete products?",
            description: `You are about to delete ${selectedProducts.length} selected products. This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            danger: true,
        });

        if (action === "save") {
            setDeleting(true);
            try {
                await bulkDeleteProducts(selectedProducts);
                setSelectedProducts([]);
                queryClient.invalidateQueries({
                    queryKey: [
                        "shop-products",
                        activeShopId,
                        page,
                        search,
                        limit,
                    ],
                });
                toast.success("Products deleted successfully");
            } catch (error) {
                console.error("Error deleting products:", error);
                toast.error("An error occurred while deleting products");
            } finally {
                setDeleting(false);
            }
        } else return;
    };

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Products</h1>

            <div className="flex flex-col items-center md:flex-row gap-2">
                <Button
                    onClick={handleCreateProduct}
                    className="px-2 py-1.5"
                    disabled={creating}
                >
                    <Plus size={16} />
                    {creating ? "Creating..." : "Create New"}
                </Button>
                {selectedProducts.length > 0 && (
                    <Button
                        onClick={handleBulkDelete}
                        className="ml-2 px-2 py-1.5"
                        variant="destructive"
                        disabled={selectedProducts.length === 0 || deleting}
                    >
                        {deleting
                            ? "Deleting..."
                            : `Delete (${selectedProducts.length})`}
                    </Button>
                )}
            </div>
        </div>
    );
}
