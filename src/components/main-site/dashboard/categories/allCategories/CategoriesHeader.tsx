/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQueryClient } from "@tanstack/react-query";

import { addCategorieToShop, bulkDeleteCategories } from "@/services";
import { useShopStore } from "@/store";
import { useConfirm } from "@/providers/ConfirmProvider";
import Button from "@/components/ui/custom/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CategoriesHeader({
    page,
    search,
    limit,
    selectedCategories,
    setSelectedCategories,
    deleting,
    setDeleting,
    toast,
}: any) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const activeShopId = useShopStore((s) => s.activeShopId);
    const [creating, setCreating] = useState(false);
    const confirm = useConfirm();

    const handleCreateCategorie = async () => {
        setCreating(true);
        if (!activeShopId) return;
        const categorie = await addCategorieToShop(activeShopId);
        queryClient.invalidateQueries({
            queryKey: [
                "partial-shop-categories",
                activeShopId,
                page,
                search,
                limit,
            ],
        });
        router.replace(`/dashboard/categories/${categorie.doc.id}`);
        setCreating(false);
    };

    const handleBulkDelete = async () => {
        if (selectedCategories.length === 0) return;

        const action = await confirm({
            title: "Delete categories?",
            description: `You are about to delete ${selectedCategories.length} selected categories. This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            danger: true,
        });

        if (action === "save") {
            setDeleting(true);
            try {
                await bulkDeleteCategories(selectedCategories);
                setSelectedCategories([]);
                queryClient.invalidateQueries({
                    queryKey: [
                        "partial-shop-categories",
                        activeShopId,
                        page,
                        search,
                        limit,
                    ],
                });
                toast.success("Categories deleted successfully");
            } catch (error) {
                console.error("Error deleting categories:", error);
                toast.error("An error occurred while deleting categories");
            } finally {
                setDeleting(false);
            }
        } else return;
    };

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Categories</h1>

            <div className="flex flex-col items-center md:flex-row gap-2">
                <Button
                    onClick={handleCreateCategorie}
                    className="px-2 py-1.5"
                    disabled={creating}
                >
                    <Plus size={16} />
                    {creating ? "Creating..." : "Create New"}
                </Button>
                {selectedCategories.length > 0 && (
                    <Button
                        onClick={handleBulkDelete}
                        className="ml-2 px-2 py-1.5"
                        variant="destructive"
                        disabled={selectedCategories.length === 0 || deleting}
                    >
                        {deleting
                            ? "Deleting..."
                            : `Delete (${selectedCategories.length})`}
                    </Button>
                )}
            </div>
        </div>
    );
}
