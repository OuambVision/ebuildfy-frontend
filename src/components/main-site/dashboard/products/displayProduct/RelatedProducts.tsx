/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAllShopProducts } from "@/hooks";
import { useShopStore } from "@//store";
import Select, { Option } from "@/components/ui/custom/Select";
import { useEffect, useState } from "react";

export default function RelatedProducts({ product, setProduct }: any) {
    const activeShopId = useShopStore((s) => s.activeShopId);
    const { data: products } = useAllShopProducts({
        shopId: activeShopId || "",
    });

    const [relatedProducts, setRelatedProducts] = useState<Option[]>([]);
    const [productOptions, setProductOptions] = useState<Option[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<Option[]>(
        product?.relatedProducts?.map((rp: any) => ({
            id: rp.id,
            label: rp.title,
        })) || []
    );

    useEffect(() => {
        const relatedProd = products?.filter(
            (p: any) =>
                p.categories[0]?.id === product?.categories[0]?.id &&
                p.id !== product?.id
        );
        setRelatedProducts(relatedProd);
        setProductOptions(
            relatedProd?.map((p: any) => ({
                id: p.id,
                label: p.title,
            }))
        );
        setSelectedProducts(
            product?.relatedProducts?.map((rp: any) => ({
                id: rp.id,
                label: rp.title,
            })) || []
        );
    }, [products, product]);

    if (productOptions?.length === 0) return null;

    return (
        <div className="space-y-2 w-full border-t pt-4 text-sm border-gray-400">
            <label className="font-semibold">Related Products</label>
            <div className="flex flex-col xl:flex-row-reverse xl:items-center border border-gray-400 rounded-md p-2 gap-2 w-full">
                <div className="flex items-center">
                    {/* Select personnalisé pour choisir un produit */}
                    <Select
                        options={productOptions}
                        value={null} // par défaut rien de sélectionné
                        onChange={(opt) => {
                            if (
                                !selectedProducts.find((p) => p.id === opt.id)
                            ) {
                                setSelectedProducts([...selectedProducts, opt]);
                                setProduct((prev: any) => ({
                                    ...prev,
                                    relatedProducts: [
                                        ...(prev.relatedProducts || []),
                                        relatedProducts.find(
                                            (p: any) => p.id === opt.id
                                        ),
                                    ],
                                }));
                            }
                        }}
                        placeholder="Select a product"
                        className="w-auto"
                    />
                </div>
                {/* Input affichant les produits sélectionnés */}
                <div className="flex flex-wrap gap-1 flex-1">
                    {selectedProducts.map((prod) => (
                        <span
                            key={prod.id}
                            className="border border-black px-2 py-1 rounded flex items-center gap-1"
                        >
                            {prod.label}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedProducts(
                                        selectedProducts.filter(
                                            (p) => p.id !== prod.id
                                        )
                                    );
                                    setProduct((prev: any) => ({
                                        ...prev,
                                        relatedProducts: (
                                            prev.relatedProducts || []
                                        ).filter((p: any) => p.id !== prod.id),
                                    }));
                                }}
                                className="text-black font-bold cursor-pointer ml-1"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
