/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateProductInShop } from "@/services";
import { useShopStore } from "@/store/useShopStore";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/ui/custom/Button";
import { useToast } from "@/providers/ToastProvider";
import { capitaliseFirstLetter } from "@/libs/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ProductHeader({
    product,
    setProduct,
    setSaveProduct,
    page,
    search,
    limit,
    isAnyChange,
    setIsAnyChange,
    isSaving,
    setIsSaving,
}: {
    product: any;
    setProduct: any;
    setSaveProduct: any;
    page: string;
    search: string;
    limit: string;
    isAnyChange: boolean;
    setIsAnyChange: any;
    isSaving: boolean;
    setIsSaving: any;
}) {
    const { toast } = useToast();
    const activeShopId = useShopStore((s) => s.activeShopId);
    const queryClient = useQueryClient();

    const [isPublishing, setIsPublishing] = useState(false);

    const upadateProduct = () => {
        return updateProductInShop(product.id, product)
            .then((data) => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "shop-products",
                        activeShopId,
                        parseInt(page),
                        search,
                        parseInt(limit),
                    ],
                });
                setProduct(data.doc);
                setSaveProduct(data.doc);
                setIsSaving(false);
                setIsAnyChange(false);
                toast.success("Product updated successfully");
            })
            .catch((error) => {
                toast.error("An error occurred while updating the product");
            })
            .finally(() => {
                setIsSaving(false);
                setIsPublishing(false);
            });
    };

    //Handle saving product changes
    const handleSaveChanges = () => {
        setIsSaving(true);
        //set product status to draft if not already
        if (product._status !== "draft") {
            product._status = "draft";
        }
        upadateProduct();
    };

    //Handle publishing product
    const handlePublishChanges = () => {
        setIsPublishing(true);
        product._status = "published";
        upadateProduct();
    };

    return (
        <section>
            <Breadcrumb />
            <div className="flex items-center justify-between border-b pb-4 border-gray-400">
                <div className="text-sm flex flex-col md:flex-row md:space-x-4 space-y-1 md:space-y-0">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="font-bold">
                        {capitaliseFirstLetter(product._status)}
                    </span>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        variant="secondary"
                        className=" text-xs md:text-sm px-2 md:px-3"
                        onClick={handleSaveChanges}
                        disabled={isSaving || isPublishing || !isAnyChange}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        className=" text-xs md:text-sm px-2 md:px-3"
                        disabled={
                            isPublishing ||
                            product._status === "published" ||
                            isSaving ||
                            isAnyChange
                        }
                        onClick={handlePublishChanges}
                    >
                        {isPublishing ? "Publishing..." : "Publish Changes"}
                    </Button>
                </div>
            </div>
        </section>
    );
}
