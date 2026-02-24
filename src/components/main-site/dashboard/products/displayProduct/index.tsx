/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    useShopLoader,
    useShopProducts,
    useUnsavedChangesGuard,
} from "@/hooks";
import { updateProductInShop } from "@/services";
import { useShopStore } from "@/store";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useToast } from "@/providers/ToastProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import ProductHeader from "./ProductHeader";
import ProductMain from "./ProductMain";
import RelatedProducts from "./RelatedProducts";

export default function ProductPageClient({
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

    const [product, setProduct] = useState<any>(null);
    const [saveProduct, setSaveProduct] = useState<any>(null);
    const [isAnyChange, setIsAnyChange] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    //Récupération des produits
    const { data: products, isLoading } = useShopProducts({
        shopId: activeShopId || "",
        page: parseInt(page),
        search,
        limit: parseInt(limit),
    });

    //Init produit sélectionné
    useEffect(() => {
        if (!products?.docs?.length) return;
        const selectedProduct = products.docs.find(
            (p: any) => p.id === parseInt(id)
        );
        if (!selectedProduct) return;

        setProduct(selectedProduct);
        setSaveProduct(selectedProduct);
    }, [products, id]);

    //Détection des changements
    useEffect(() => {
        if (!product || !saveProduct) return;
        setIsAnyChange(JSON.stringify(product) !== JSON.stringify(saveProduct));
    }, [product, saveProduct]);

    //Fonction pour mettre à jour le produit
    const updateProduct = async () => {
        if (!product) return;
        setIsSaving(true);
        try {
            await updateProductInShop(product.id, product);
            queryClient.invalidateQueries({
                queryKey: [
                    "shop-products",
                    activeShopId,
                    parseInt(page),
                    search,
                    parseInt(limit),
                ],
            });
            setSaveProduct(product);
            setIsAnyChange(false);
            toast.success("Product updated successfully");
        } catch (err) {
            toast.error("An error occurred while updating the product");
        } finally {
            setIsSaving(false);
        }
    };

    //Hook custom pour gérer les changements non sauvegardés
    useUnsavedChangesGuard(isAnyChange, confirm, updateProduct, setIsSaving);

    // ✅ Hook custom pour loader + skeleton
    const loader = useShopLoader({
        conditions: [isLoading, !product, isSaving],
    });
    if (loader) return loader;

    return (
        <section className="space-y-6 bg-white/80 p-4 md:p-6 rounded-md shadow-xl">
            <ProductHeader
                product={product}
                setProduct={setProduct}
                setSaveProduct={setSaveProduct}
                page={page}
                search={search}
                limit={limit}
                isAnyChange={isAnyChange}
                setIsAnyChange={setIsAnyChange}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
            />

            <ProductMain
                product={product}
                setProduct={setProduct}
                setSaveProduct={setSaveProduct}
                page={page}
                search={search}
                limit={limit}
            />

            <RelatedProducts product={product} setProduct={setProduct} />
        </section>
    );
}
