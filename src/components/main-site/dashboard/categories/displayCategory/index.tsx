/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    usePartialShopCategories,
    useShopLoader,
    useUnsavedChangesGuard,
} from "@/hooks";
import { updateCategorieInShop } from "@/services";
import { useShopStore } from "@/store";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useToast } from "@/providers/ToastProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import CategorieHeader from "./CategorieHeader";
import CategorieMain from "./CategorieMain";

export default function CategoriePageClient({
    id,
    page,
    search,
    limit,
}: {
    id: string;
    page: string;
    search: string;
    limit: string;
}) {
    const confirm = useConfirm();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const activeShopId = useShopStore((s) => s.activeShopId);

    const [categorie, setCategorie] = useState<any>(null);
    const [saveCategorie, setSaveCategorie] = useState<any>(null);
    const [isAnyChange, setIsAnyChange] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    //Récupération des produits
    const { data: categories, isLoading } = usePartialShopCategories({
        shopId: activeShopId || "",
        page: parseInt(page),
        search,
        limit: parseInt(limit),
    });

    //Init categories sélectionné
    useEffect(() => {
        if (!categories?.docs?.length) return;
        const selectedCategorie = categories.docs.find(
            (p: any) => p.id === parseInt(id)
        );
        if (!selectedCategorie) return;

        setCategorie(selectedCategorie);
        setSaveCategorie(selectedCategorie);
    }, [categories, id]);

    //Détection des changements
    useEffect(() => {
        if (!categorie || !saveCategorie) return;
        setIsAnyChange(
            JSON.stringify(categorie) !== JSON.stringify(saveCategorie)
        );
    }, [categorie, saveCategorie]);

    //Fonction pour mettre à jour le produit
    const updateCategorie = async () => {
        if (!categorie) return;
        setIsSaving(true);
        try {
            await updateCategorieInShop(categorie.id, categorie);
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
            setSaveCategorie(categorie);
            setIsAnyChange(false);
            toast.success("Categorie updated successfully");
        } catch (err) {
            toast.error("An error occurred while updating the categorie");
        } finally {
            setIsSaving(false);
        }
    };

    //Hook custom pour gérer les changements non sauvegardés
    useUnsavedChangesGuard(isAnyChange, confirm, updateCategorie, setIsSaving);

    // ✅ Hook custom pour loader + skeleton
    const loader = useShopLoader({
        conditions: [isLoading, !categorie, isSaving],
    });
    if (loader) return loader;

    return (
        <section className="space-y-6 bg-white/80 p-4 md:p-6 rounded-md shadow-xl">
            <CategorieHeader
                categorie={categorie}
                setCategorie={setCategorie}
                setSaveCategorie={setSaveCategorie}
                page={page}
                search={search}
                limit={limit}
                isAnyChange={isAnyChange}
                setIsAnyChange={setIsAnyChange}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
            />

            <CategorieMain
                categorie={categorie}
                setCategorie={setCategorie}
                setSaveCategorie={setSaveCategorie}
            />
        </section>
    );
}
