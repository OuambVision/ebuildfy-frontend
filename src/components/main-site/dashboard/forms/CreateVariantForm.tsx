/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateProductInShop } from "@/services";
import { useDrawerStore } from "@/store";
import Button from "@/components/ui/custom/Button";
import Input from "@/components/ui/custom/Input";
import Select, { Option } from "@/components/ui/custom/Select";
import { useToast } from "@/providers/ToastProvider";
import { useEffect, useRef, useState } from "react";

export default function CreateVariantForm({
    product,
    selectedVariantTypes,
    variantOption,
    onSuccess,
}: any) {
    const { toast } = useToast();
    const closeDrawer = useDrawerStore((s) => s.closeDrawer);
    const [loading, setLoading] = useState(false);

    // selections par optionType
    const [selectedOptions, setSelectedOptions] = useState<
        Record<number, Option | null>
    >({});

    const [title, setTitle] = useState(
        variantOption?.title || product?.title || ""
    );
    const [price, setPrice] = useState(variantOption?.price?.toString() || "");
    const [inventory, setInventory] = useState(
        variantOption?.inventory?.toString() || ""
    );
    const [variantOptions, setVariantOptions] = useState<any[]>(
        product?.variantOptions || []
    );

    const titleRef = useRef<HTMLInputElement>(null);

    // console.log('Variant Option', variantOption)

    /* ---------------- INITIALIZE STATE ---------------- */

    const isUpdate = !!variantOption; //equal to variantOption != null, that means if variantOption is passed, we are in update mode

    useEffect(() => {
        const init: any = {};

        selectedVariantTypes.forEach((vt: any) => {
            init[vt.id] = null;
        });

        setSelectedOptions(init);
    }, [selectedVariantTypes]);

    /* ------------ SET SELECTED VALUE FOR EACH VARIANT TYPE ------------- */
    useEffect(() => {
        if (!variantOption || !selectedVariantTypes.length) return;
        const init: any = {};

        selectedVariantTypes.forEach((vt: any) => {
            const match = variantOption.options.find(
                (opt: any) => opt.variantType.id === vt.id
            );
            init[vt.id] = match
                ? { id: match.option.id, label: match.option.label }
                : null;
        });
        setSelectedOptions(init);
    }, [variantOption, selectedVariantTypes]);

    /* ---------------- AUTO TITLE ---------------- */

    useEffect(() => {
        const values = Object.values(selectedOptions)
            .filter(Boolean)
            .map((opt) => opt?.label);

        setTitle(
            product
                ? `${product.title} ${values.length !== 0 ? "- " + values.join("-") : ""}`
                : values.join("-")
        );
    }, [selectedOptions]);

    /* ---------------- VALIDATION ---------------- */

    const validate = () => {
        //title is required
        if (!title.trim()) {
            titleRef.current?.focus();
            return false;
        }

        //price and inventory must be positive numbers
        if (!price || Number(price) < 0) return false;
        if (!inventory || Number(inventory) < 0) return false;

        //check if all options are selected
        for (const vt of selectedVariantTypes) {
            if (!selectedOptions[vt.id]) {
                return false;
            }
        }

        return true;
    };

    /* ---------------- HANDLERS ---------------- */

    const handleSelectOption = (variantTypeId: number, option: Option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [variantTypeId]: option,
        }));
    };

    /* ---------------- SAVE ---------------- */

    const handleSave = async () => {
        if (!validate()) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const newOptions = Object.entries(selectedOptions).map(
                ([vtId, opt]) => {
                    const variantType = selectedVariantTypes.find(
                        (vt: any) => vt.id === Number(vtId)
                    );
                    return {
                        variantType,
                        option: opt,
                    };
                }
            );

            //check if a variant with the same options already exists
            const exists = variantOptions.some((vo) => {
                if (isUpdate && vo.id === variantOption.id) return false; //exclude current variant option when updating
                if (vo.options.length !== newOptions.length) return false;
                return vo.options.every((opt: any) => {
                    const match = newOptions.find(
                        (no: any) =>
                            no.variantType.id === opt.variantType.id &&
                            no.option.label === opt.option.label
                    );
                    return !!match;
                });
            });

            if (exists) {
                toast.error("A variant with the same options already exists");
                return;
            }

            try {
                let updatedProduct = null;

                if (!isUpdate) {
                    let id = crypto.randomUUID();
                    while (variantOptions.some((opt) => opt.id === id)) {
                        id = crypto.randomUUID();
                    }

                    const newVariantOption = {
                        id,
                        title,
                        price: Number(price),
                        inventory: Number(inventory),
                        options: newOptions,
                    };
                    updatedProduct = await updateProductInShop(product.id, {
                        ...product,
                        variantOptions: [...variantOptions, newVariantOption],
                    });
                } else {
                    const updatedVariantOptions = variantOptions.map((vo) => {
                        if (vo.id === variantOption.id) {
                            return {
                                ...vo,
                                title,
                                price: Number(price),
                                inventory: Number(inventory),
                                options: newOptions,
                            };
                        }
                        return vo;
                    });
                    updatedProduct = await updateProductInShop(product.id, {
                        ...product,
                        variantOptions: updatedVariantOptions,
                    });
                }
                onSuccess?.(updatedProduct?.doc);
                closeDrawer();
                toast.success(
                    isUpdate
                        ? "Variant updated successfully"
                        : "Variant created successfully"
                );
            } catch (err) {
                console.error("Error creating variant option:", err);
                toast.error("Failed to create variant");
                return;
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="flex flex-col h-full">
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
                {isUpdate
                    ? "Editing Variant options"
                    : "Creating new Variant options"}
                <Button variant="white" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : isUpdate ? "Update" : "Save"}
                </Button>
            </div>

            {/* BODY */}
            <div className="flex-1 space-y-8 bg-neutral-950 px-6 py-6 text-sm text-neutral-200">
                {/* TITLE */}
                <div className="space-y-1">
                    <Input
                        label="Title"
                        required={true}
                        // ref={titleRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-neutral-800 px-3 py-2 bg-neutral-900"
                    />
                </div>

                {/* VARIANT TYPES */}
                <div className="space-y-6 border-t border-neutral-800 pt-6">
                    {selectedVariantTypes.map((vt: any) => {
                        const options: Option[] = vt.option.options.map(
                            (opt: any) => ({
                                id: opt.id,
                                label: opt.value,
                            })
                        );

                        return (
                            <div key={vt.id} className="space-y-2">
                                <Select
                                    label={vt.label}
                                    options={options}
                                    value={selectedOptions[vt.id]}
                                    onChange={(opt) =>
                                        handleSelectOption(vt.id, opt)
                                    }
                                    isDark={true}
                                    required
                                />
                            </div>
                        );
                    })}
                </div>

                {/* PRICE */}
                <div className="space-y-1">
                    <Input
                        label="Price"
                        required
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-md border border-neutral-800 px-3 py-2 bg-neutral-900"
                    />
                </div>

                {/* INVENTORY */}
                <div className="space-y-1">
                    <Input
                        label="Inventory"
                        required
                        type="number"
                        value={inventory}
                        onChange={(e) => setInventory(e.target.value)}
                        className="w-full rounded-md border border-neutral-800 px-3 py-2 bg-neutral-900"
                    />
                </div>
            </div>
        </div>
    );
}
