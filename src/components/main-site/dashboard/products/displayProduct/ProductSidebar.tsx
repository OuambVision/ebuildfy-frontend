/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useShopLoader, useShopCategories } from "@/hooks";
import { useShopStore } from "@/store";
import { Tooltip } from "@/components/ui/custom";
import Button from "@/components/ui/custom/Button";
import Checkbox from "@/components/ui/custom/Checkbox";
import Select, { Option } from "@/components/ui/custom/Select";
import { useState } from "react";

export default function ProductSidebar({ product, setProduct }: any) {
    const shops = useShopStore((state) => state.shops);
    const shop = shops.find((s) => s.active);
    const { data: categories, isLoading } = useShopCategories({
        shopId: String(shop?.id),
    });

    const [selectedCategory, setSelectedCategory] = useState<Option | null>(
        product?.categories?.length
            ? {
                  id: product.categories[0].id,
                  label: product.categories[0].title,
              }
            : null
    );

    // Transformer les categories en options pour le Select
    const categoryOptions: Option[] = [
        { id: "", label: "Select a value" },
        ...(categories?.map((cat: any) => ({
            id: cat.id,
            label: cat.title,
        })) || []),
    ];

    const handleCategoryChange = (option: Option | null) => {
        setSelectedCategory(option);
        setProduct((prev: any) => ({
            ...prev,
            categories: categories.filter((cat: any) => cat.id === option?.id),
        }));
    };

    // ✅ Hook custom pour loader + skeleton
    const loader = useShopLoader({
        conditions: [isLoading, !shop],
    });
    if (loader) return loader;

    return (
        <aside className="space-y-6 rounded-md border border-gray-400 bg-white p-4">
            {/* Categories */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Categories</label>
                <div className="flex items-center">
                    <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        placeholder="Select a value"
                    />
                    {/* Bouton + pour créer un nouveau produit */}
                    <Tooltip content="Add new Category" position="top">
                        <Button
                            type="button"
                            className="ml-3 px-2 py-0.5"
                            variant="primary"
                        >
                            +
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* Featured */}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                    onChange={(e) => {
                        setProduct((prev: any) => ({
                            ...prev,
                            isFeatured: e.target.checked ? true : null,
                        }));
                    }}
                />
                Feature this product on the homepage
            </label>
        </aside>
    );
}
