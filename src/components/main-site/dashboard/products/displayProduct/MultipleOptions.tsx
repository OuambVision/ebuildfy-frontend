/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateProductInShop } from "@/services";
import { useToast } from "@/providers/ToastProvider";

import { useShopOptionTypes } from "@/hooks";
import { useDrawerStore } from "@/store";
import CreateVariantForm from "@/components/main-site/dashboard/forms/CreateVariantForm";
import CreateVariantTypeForm from "@/components/main-site/dashboard/forms/CreateVariantTypeForm";
import { Tooltip } from "@/components/ui/custom";
import Button from "@/components/ui/custom/Button";
import Select, { Option } from "@/components/ui/custom/Select";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiCloseFill } from "react-icons/ri";

export default function MultipleOptions({
    product,
    setProduct,
    setSaveProduct,
}: {
    product?: any;
    setProduct: React.Dispatch<React.SetStateAction<any>>;
    setSaveProduct: React.Dispatch<React.SetStateAction<any>>;
}) {
    const { data: optionTypes } = useShopOptionTypes();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const openDrawer = useDrawerStore((s) => s.openDrawer);

    // Transformer en Option[] pour le Select
    const variantTypes: Option[] =
        optionTypes?.map((opt: any) => ({
            id: opt.id,
            label: opt.name,
            option: opt,
        })) || [];

    const selectedvariantTypes: Option[] =
        product?.optionTypes?.map((opt: any) => ({
            id: opt.id,
            label: opt.name,
            option: opt,
        })) || [];

    const [selectedVariants, setSelectedVariants] = useState<Option[]>(
        selectedvariantTypes || []
    );
    const [variantOptions, setVariantOptions] = useState<any[]>(
        product?.variantOptions || []
    );

    const handleCreateVariantType = (optionType?: any) => {
        openDrawer({
            title: optionType ? "Edit Variant Type" : "Create Variant Type",
            content: (
                <CreateVariantTypeForm
                    product={product}
                    optionType={optionType}
                    onSuccess={(updatedProduct: any) => {
                        setSelectedVariants(
                            updatedProduct?.optionTypes?.map((opt: any) => ({
                                id: opt.id,
                                label: opt.name,
                                option: opt,
                            })) || []
                        );
                        setProduct(updatedProduct);
                        setSaveProduct(updatedProduct);
                    }}
                />
            ),
        });
    };

    const handleCreateVariantOption = (variantOption?: any) => {
        // Ouvrir un formulaire pour créer une nouvelle option de variant
        openDrawer({
            title: variantOption
                ? "Edit Variant Option"
                : "Create Variant Option",
            content: (
                <CreateVariantForm
                    product={product}
                    variantOption={variantOption}
                    selectedVariantTypes={selectedVariants}
                    onSuccess={(updatedProduct: any) => {
                        setProduct(updatedProduct);
                        setSaveProduct(updatedProduct);
                        setVariantOptions(updatedProduct.variantOptions || []);
                    }}
                />
            ),
        });
    };

    /* ---------------- DELETE VARIANT OPTION ---------------- */
    const handleDeleteVariantOption = async (vo: any) => {
        try {
            setLoading(true);
            const updatedVariantOptions = variantOptions.filter(
                (v: any) => v.id !== vo.id
            );
            const updatedProduct = await updateProductInShop(product.id, {
                ...product,
                variantOptions: updatedVariantOptions,
            });
            setProduct(updatedProduct.doc);
            setSaveProduct(updatedProduct.doc);
            setVariantOptions(updatedProduct.doc.variantOptions || []);
            toast.success("Variant option deleted successfully");
        } catch (err) {
            toast.error("Failed to delete variant option");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!product) return;

        setProduct({
            ...product,
            optionTypes: selectedVariants.map((v: any) => v.option),
        });
    }, [selectedVariants]);

    return (
        <div className="space-y-2 w-full border-b pb-6 mb-4 lg:border-b-0 lg:pb-0 lg:mb-0">
            {/* Selected Variants types */}
            <label className="font-semibold">Selected Variants types</label>
            <div className="flex flex-col xl:flex-row-reverse xl:items-center border rounded-md p-2 gap-2 w-full">
                <div className="flex items-center">
                    {/* Select personnalisé */}
                    <Select
                        options={variantTypes}
                        value={null} // on ne sélectionne rien dans le dropdown par défaut
                        onChange={(opt) => {
                            if (
                                !selectedVariants.find((v) => v.id === opt.id)
                            ) {
                                setSelectedVariants((prev) => [...prev, opt]);
                            }
                        }}
                        placeholder="Select a variant type"
                        className="w-auto text-xs"
                    />
                    {/* Bouton + pour créer un nouveau variant type */}
                    <Tooltip content="Add new variant type" position="top">
                        <Button
                            type="button"
                            onClick={() => handleCreateVariantType(null)}
                            className="ml-3 px-2 py-0.5"
                            variant="primary"
                        >
                            +
                        </Button>
                    </Tooltip>
                </div>
                {/* Input affichant les sélectionnés */}
                <div className="flex flex-wrap gap-1 flex-1">
                    {selectedVariants?.map((vt: any) => (
                        <span
                            key={vt.id}
                            className="border border-black px-2 py-1 rounded flex items-center gap-1 bg-gray-200"
                        >
                            {vt.label}

                            <Tooltip content="Edit" position="top">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCreateVariantType(vt.option)
                                    }
                                    className="text-black font-bold cursor-pointer ml-3 text-xs text-green-600"
                                >
                                    <FiEdit />
                                </button>
                            </Tooltip>
                            <Tooltip content="Delete" position="top">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedVariants((prev) =>
                                            prev.filter((v) => v.id !== vt.id)
                                        )
                                    }
                                    className="text-black font-bold cursor-pointer ml-1 text-base text-red-600"
                                >
                                    <RiCloseFill />
                                </button>
                            </Tooltip>
                        </span>
                    ))}
                </div>
            </div>

            {/* Available Variants Options */}
            <div className="my-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                        Available Variants:{" "}
                    </span>
                    <Button
                        variant="outline"
                        className="px-2 py-1.5"
                        disabled={!selectedVariants.length}
                        onClick={() => {
                            handleCreateVariantOption(null);
                        }}
                    >
                        <Plus className="mr-1" size={10} />
                        Add Variant
                    </Button>
                </div>

                {/* Body */}
                <div className="mt-4 min-h-[100px]">
                    {variantOptions.length === 0 ? (
                        <span className="text-xs text-gray-500">
                            No variants created yet.
                        </span>
                    ) : (
                        <table className="w-full text-sm border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="text-left border border-gray-300 py-2 px-2 bg-gray-200">
                                        Title
                                    </th>
                                    <th className="text-left border border-gray-300 py-2 px-2 bg-gray-200">
                                        Variant options
                                    </th>
                                    <th className="text-left border border-gray-300 py-2 px-2 hidden xl:table-cell bg-gray-200">
                                        Price (CAD)
                                    </th>
                                    <th className="text-left border border-gray-300 py-2 px-2 bg-gray-200">
                                        Inventory
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {variantOptions?.map((vo, index: number) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-100 border border-gray-200"
                                    >
                                        <td className="border-gray-200 px-2 py-2 flex justify-between items-center gap-1">
                                            <span>{vo.title}</span>
                                            <div className="flex flex-col items-center justify-center lg:flex-row gap-2">
                                                <Tooltip
                                                    content="Edit"
                                                    position="top"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCreateVariantOption(
                                                                vo
                                                            )
                                                        }
                                                        className="text-black font-bold cursor-pointer text-xs text-green-600"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip
                                                    content="Delete"
                                                    position="top"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            handleDeleteVariantOption(
                                                                vo
                                                            );
                                                        }}
                                                        className="text-black font-bold cursor-pointer text-base text-red-600"
                                                    >
                                                        <RiCloseFill />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </td>
                                        <td className="border border-gray-200 px-2 py-2">
                                            {selectedVariants
                                                .map(
                                                    (sv) =>
                                                        vo.options.find(
                                                            (ov: any) =>
                                                                ov.variantType
                                                                    .id ===
                                                                sv.id
                                                        )?.option?.label || "-"
                                                )
                                                .join(", ")}
                                        </td>
                                        <td className="border border-gray-200 px-2 py-2 hidden xl:table-cell">
                                            ${vo.price}
                                        </td>
                                        <td className="border border-gray-200 px-2 py-2">
                                            {vo.inventory}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
