/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useShopCategories, useShopLoader } from "@/hooks";
import { useShopStore } from "@/store";
import Input from "@/components/ui/custom/Input";
import Select, { Option } from "@/components/ui/custom/Select";
import { useState } from "react";

export default function CategorieMain({
    categorie,
    setCategorie,
    setSaveCategorie,
}: any) {
    const activeShopId = useShopStore((state) => state.activeShopId);
    const { data: categories, isLoading } = useShopCategories({
        shopId: activeShopId || "",
    });

    const [selectedParentCategory, setSelectedCategory] =
        useState<Option | null>(
            categorie?.parentCategory
                ? {
                      id: categorie?.parentCategory?.id || "",
                      label: categorie?.parentCategory?.title || "",
                  }
                : null
        );

    // Transformer les categories en options pour le Select
    const categoryOptions: Option[] = [
        { id: "", label: "Select a value" },
        ...(
            categories?.map((cat: any) => {
                if (cat.id === categorie?.id) return null;
                return {
                    id: cat.id,
                    label: cat.title,
                };
            }) || []
        ).filter((cat: any) => cat !== null),
    ];

    const handleParentCategoryChange = (option: Option | null) => {
        setSelectedCategory(option);
        setCategorie((prev: any) => ({
            ...prev,
            parentCategory: option,
        }));
    };

    // ✅ Hook custom pour loader + skeleton
    const loader = useShopLoader({
        conditions: [isLoading, !categorie],
    });
    if (loader) return loader;

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setCategorie((prev: any) => ({
            ...prev,
            title: value,
        }));
    };

    return (
        <section className="flex flex-col gap-8 lg:flex-row">
            <section className="flex-1 space-y-6">
                <Input
                    label="Title"
                    placeholder="Title"
                    required
                    value={categorie?.title ?? ""}
                    onChange={handleTitleChange}
                />
                {/* Categories */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Parent Category
                    </label>
                    <div className="flex items-center">
                        <Select
                            options={categoryOptions}
                            value={selectedParentCategory}
                            onChange={handleParentCategoryChange}
                            placeholder="Select a value"
                        />
                    </div>
                </div>
            </section>
        </section>
    );
}
