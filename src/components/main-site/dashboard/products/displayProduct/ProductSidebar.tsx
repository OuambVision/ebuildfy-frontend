/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useShopLoader, useShopCategories } from "@/hooks";
import { useShopStore } from "@/store";
import Checkbox from "@/components/ui/custom/Checkbox";
import Select, { Option } from "@/components/ui/custom/Select";
import { useEffect, useState } from "react";
import RelatedProducts from "./RelatedProducts";

export default function ProductSidebar({ product, setProduct }: any) {
    const activeShopId = useShopStore((s) => s.activeShopId);
    const { data: categories, isLoading } = useShopCategories({
        shopId: activeShopId || "",
    });

    const [selectedCategory, setSelectedCategory] = useState<Option | null>(
        product?.categories?.length
            ? {
                  id: product.categories[0].id,
                  label: product.categories[0].title,
              }
            : null
    );

    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

    //To transform categories into options for the select, with a placeholder
    useEffect(() => {
        if (categories) {
            const options: Option[] = [
                { id: "", label: "Select a value" },
                ...categories.map((cat: any) => ({
                    id: cat.id,
                    label: cat.title,
                })),
            ];
            setCategoryOptions(options);
        }
    }, [categories]);

    // When categories are loaded, set the selected category based on the product's categories
    const handleCategoryChange = (option: Option | null) => {
        setSelectedCategory(option);
        setProduct((prev: any) => ({
            ...prev,
            relatedProducts: [], // reset related products when category changes
            categories: categories.filter((cat: any) => cat.id === option?.id),
        }));
    };

    // Loader while fetching categories
    const loader = useShopLoader({
        conditions: [isLoading, !activeShopId],
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
                        menuPosition={
                            window.innerWidth < 1024 ? "top" : "bottom"
                        } // top on mobile, bottom on desktop
                    />
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
                    checked={product.isFeatured || false}
                />
                Feature this product on the homepage
            </label>
        </aside>
    );
}
