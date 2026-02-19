/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateCategorieInShop } from "@/services";
import { useShopStore } from "@/store";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/ui/custom/Button";
import { useToast } from "@/providers/ToastProvider";
import { capitaliseFirstLetter } from "@/libs/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function CategorieHeader({
    categorie,
    setCategorie,
    setSaveCategorie,
    page,
    search,
    limit,
    isAnyChange,
    setIsAnyChange,
    isSaving,
    setIsSaving,
}: {
    categorie: any;
    setCategorie: any;
    setSaveCategorie: any;
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

    const updateCategorie = () => {
        return updateCategorieInShop(categorie.id, categorie)
            .then((data) => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "partial-shop-categories",
                        activeShopId,
                        parseInt(page),
                        search,
                        parseInt(limit),
                    ],
                });
                queryClient.invalidateQueries({
                    queryKey: ["shop-categories", activeShopId],
                });

                setCategorie(data.doc);
                setSaveCategorie(data.doc);
                setIsSaving(false);
                setIsAnyChange(false);
                toast.success("Categorie updated successfully");
            })
            .catch((error) => {
                toast.error("An error occurred while updating the categorie");
            })
            .finally(() => {
                setIsSaving(false);
                setIsPublishing(false);
            });
    };

    //Handle saving product changes
    const handleSaveChanges = () => {
        setIsSaving(true);
        //set categorie status to draft if not already
        if (categorie.status !== "draft") {
            categorie.status = "draft";
        }
        updateCategorie();
    };

    //Handle publishing categorie
    const handlePublishChanges = () => {
        setIsPublishing(true);
        categorie.status = "published";
        updateCategorie();
    };

    return (
        <section>
            <Breadcrumb />
            <div className="flex items-center justify-between border-b pb-4 border-gray-400">
                <div className="text-sm flex flex-col md:flex-row md:space-x-4 space-y-1 md:space-y-0">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="font-bold">
                        {capitaliseFirstLetter(categorie.status)}
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
                            categorie.status === "published" ||
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
