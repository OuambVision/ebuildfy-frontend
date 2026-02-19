/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    createNewOptionType,
    updateOptionType,
    updateProductInShop,
} from "@/services";
import { useDrawerStore, useShopStore } from "@/store";
import { useToast } from "@/providers/ToastProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { Tooltip } from "@/components/ui/custom";
import Button from "@/components/ui/custom/Button";
import Input from "@/components/ui/custom/Input";
import { Trash } from "lucide-react";

export default function CreateVariantTypeForm({
    product,
    onSuccess,
    optionType,
}: any) {
    const closeDrawer = useDrawerStore((s) => s.closeDrawer);
    const activeShopId = useShopStore((s) => s.activeShopId);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [label, setLabel] = useState(optionType?.label || "");
    const [name, setName] = useState(optionType?.name || "");
    const [loading, setLoading] = useState(false);

    const [options, setOptions] = useState<any[]>(optionType?.options || []);

    const labelRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<any>({});

    const [errors, setErrors] = useState<any>({
        label: false,
        name: false,
        options: {},
        duplicates: {},
    });

    /* ---------------- VALIDATION ---------------- */

    const isUpdate = !!optionType; //equal to optionType != null, that means if optionType is passed, we are in update mode

    const validate = () => {
        const newErrors: any = {
            label: !label.trim(),
            name: !name.trim(),
            options: {},
            duplicates: {},
        };

        const values = options.map((o) => o.value.trim().toLowerCase());

        options.forEach((opt, index) => {
            const val = opt.value.trim();

            if (!val) {
                newErrors.options[opt.id] = true;
            }

            if (
                val &&
                values.filter((v) => v === val.toLowerCase()).length > 1
            ) {
                newErrors.duplicates[opt.id] = true;
            }
        });

        setErrors(newErrors);

        return (
            !newErrors.label &&
            !newErrors.name &&
            Object.keys(newErrors.options).length === 0 &&
            Object.keys(newErrors.duplicates).length === 0
        );
    };

    /* ---------------- TEMPS REEL ---------------- */

    // useEffect(() => {
    //   validate()
    // }, [label, name, options])

    /* ---------------- AUTOFOCUS + SCROLL ---------------- */

    const focusFirstError = () => {
        if (errors.label) {
            labelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            labelRef.current?.focus();
            return;
        }

        if (errors.name) {
            nameRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            nameRef.current?.focus();
            return;
        }

        const optionErrorId =
            Object.keys(errors.options)[0] || Object.keys(errors.duplicates)[0];

        if (optionErrorId && optionRefs.current[optionErrorId]) {
            optionRefs.current[optionErrorId].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            optionRefs.current[optionErrorId].focus();
        }
    };

    /* ---------------- SAVE ---------------- */

    // const handleSave = async () => {
    //   if (!validate()) {
    //     focusFirstError()
    //     return
    //   }

    //   try {
    //     setLoading(true)

    //     const createdOptionType = await createNewOptionType({
    //       name,
    //       label,
    //       shop: activeShopId,
    //       options,
    //     })

    //     const updatedProduct = await updateProductInShop(product.id, {
    //       ...product,
    //       optionTypes: [...(product.optionTypes || []), createdOptionType.doc.id],
    //     })

    //     onSuccess?.(updatedProduct.doc)
    //     closeDrawer()
    //     // Invalidate option types query to refetch updated list
    //     queryClient.invalidateQueries({ queryKey: ['shop-option-types', activeShopId] })
    //     toast.success('Option created successfully')
    //   } catch (err: any) {
    //     if (err.response?.data?.errors) {
    //       const messages = err.response.data.errors[0].data.errors
    //         .map((err: any) => err.message)
    //         .join('\n')

    //       toast.error(messages)
    //       return
    //     }
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    const handleSave = async () => {
        if (!validate()) {
            focusFirstError();
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            setLoading(true);

            let updatedProduct;

            /* =======================
       UPDATE MODE
    ======================= */
            if (isUpdate) {
                const res = await updateOptionType(optionType.id, {
                    name,
                    label,
                    options,
                });

                const updatedOptionType = res.doc;

                // 🔗 mettre à jour l’optionType dans le produit
                updatedProduct = await updateProductInShop(product.id, {
                    ...product,
                    optionTypes: product.optionTypes.map((otId: string) =>
                        otId === updatedOptionType.id
                            ? updatedOptionType.id
                            : otId
                    ),
                });

                toast.success("Option updated successfully");
            } else {
                /* =======================
       CREATE MODE
    ======================= */
                const res = await createNewOptionType({
                    name,
                    label,
                    shop: activeShopId,
                    options,
                });

                const updatedOptionType = res.doc;

                // 🔗 attacher l’optionType au produit
                updatedProduct = await updateProductInShop(product.id, {
                    ...product,
                    optionTypes: [
                        ...(product.optionTypes || []),
                        updatedOptionType.id,
                    ],
                });

                toast.success("Option created successfully");
            }

            // 🔁 refetch option types
            queryClient.invalidateQueries({
                queryKey: ["shop-option-types", activeShopId],
            });

            // 🔁 notifier le parent
            onSuccess?.(updatedProduct?.doc);

            closeDrawer();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const messages = err.response.data.errors
                    .map((e: any) => e.message)
                    .join("\n");

                toast.error(messages);
                return;
            }

            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- OPTION HANDLERS ---------------- */

    const handleAddOption = () => {
        let id = crypto.randomUUID();

        // Just in case, ensure the generated ID is unique among options
        while (options.some((opt) => opt.id === id)) {
            id = crypto.randomUUID();
        }

        setOptions((prev) => [...prev, { id, value: "" }]);
    };

    const handleChangeOption = (id: string, value: string) => {
        setOptions((prev) =>
            prev.map((opt) => (opt.id === id ? { ...opt, value } : opt))
        );
    };

    const handleRemoveOption = (id: string) => {
        setOptions((prev) => prev.filter((opt) => opt.id !== id));
    };

    /* ---------------- FORM VALID ---------------- */

    const isFormValid =
        label.trim() &&
        name.trim() &&
        // options.length > 0 &&
        Object.keys(errors.options).length === 0 &&
        Object.keys(errors.duplicates).length === 0;

    return (
        <div className="flex flex-col h-full">
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4 gap-4">
                <h2 className="text-sm font-medium text-neutral-100">
                    {isUpdate
                        ? "Editing Variant Type"
                        : "Creating new Variant Type"}{" "}
                    (e.g. Size, Color)
                </h2>

                <Button variant="white" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : isUpdate ? "Update" : "Save"}
                </Button>
            </div>

            {/* BODY */}
            <div className="flex-1 space-y-8 bg-neutral-950 px-6 py-6 text-sm text-neutral-200">
                {/* LABEL */}
                <div className="space-y-1">
                    <Input
                        label="Label"
                        required
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        error={errors.label}
                    />
                </div>

                {/* NAME */}
                <div className="space-y-1">
                    <Input
                        label="Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                    />
                </div>

                {/* OPTIONS */}
                <div className="space-y-4 border-t border-neutral-800 pt-6">
                    <h3 className="text-xs font-medium text-neutral-300">
                        Option Values (e.g. Small, Medium, Large)
                    </h3>

                    {options.length ? (
                        <div className="space-y-3">
                            {options.map((opt, index) => (
                                <div key={opt.id}>
                                    <div className="flex gap-2 w-full items-center">
                                        <Input
                                            label={`Value ${index + 1}`}
                                            required
                                            value={opt.value}
                                            onChange={(e) =>
                                                handleChangeOption(
                                                    opt.id,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter value..."
                                        />

                                        <Tooltip
                                            content="Remove"
                                            position="top"
                                        >
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleRemoveOption(opt.id)
                                                }
                                                className="hover:text-red-500 px-2"
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </Tooltip>
                                    </div>

                                    {errors.options[opt.id] && (
                                        <p className="text-xs text-red-500 mt-1">
                                            Required
                                        </p>
                                    )}

                                    {errors.duplicates[opt.id] && (
                                        <p className="text-xs text-red-500 mt-1">
                                            Duplicate value not allowed
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-neutral-500">
                            No Options values found.
                        </p>
                    )}

                    <Button
                        type="button"
                        variant="white"
                        onClick={handleAddOption}
                    >
                        Add New Value
                    </Button>
                </div>
            </div>
        </div>
    );
}
