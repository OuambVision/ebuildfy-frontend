/* eslint-disable @typescript-eslint/no-explicit-any */
import Input from "@/components/ui/custom/Input";
import NumberInput from "@/components/ui/custom/NumberInput";
import { useState } from "react";

export default function SingleOption({
    product,
    setProduct,
}: {
    product?: any;
    setProduct: React.Dispatch<React.SetStateAction<any>>;
}) {
    const [inventory, setInventory] = useState<number | "">(
        product?.inventory || ""
    );
    const [price, setPrice] = useState<number | "">(product?.priceInUSD || "");
    return (
        <div className="space-y-6 text-sm">
            <div className="flex items-center gap-2">
                <span>Base price (CAD)</span>
                <span className="flex items-center gap-1 rounded-md border border-gray-400 px-2 py-2 focus-within:ring-1 ring-black">
                    <span>$</span>
                    <Input
                        placeholder="0.00"
                        className="w-24 border-none p-0 text-base focus:ring-0"
                        value={price}
                        onChange={(e) => {
                            setPrice(
                                e.target.value ? parseFloat(e.target.value) : ""
                            );
                            setProduct((prev: any) => ({
                                ...prev,
                                priceInUSD: e.target.value
                                    ? parseFloat(e.target.value)
                                    : null,
                            }));
                        }}
                    />
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span>Inventory</span>
                <NumberInput
                    value={inventory}
                    onChange={(value) => {
                        setInventory(value);
                        setProduct((prev: any) => ({
                            ...prev,
                            inventory: value,
                        }));
                    }}
                    min={0}
                />
            </div>
        </div>
    );
}
