/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Checkbox from "@/components/ui/custom/Checkbox";
import { useState } from "react";
import MultipleOptions from "./MultipleOptions";
import SingleOption from "./SingleOption";

export default function ProductDetails({
    product,
    setProduct,
    setSaveProduct,
}: {
    product?: any;
    setProduct: React.Dispatch<React.SetStateAction<any>>;
    setSaveProduct: React.Dispatch<React.SetStateAction<any>>;
}) {
    const [hasOptions, setHasOptions] = useState(
        product?.enableVariants || false
    );

    return (
        <div className="space-y-6 text-sm">
            <label className="mt-8 flex items-center gap-2 cursor-pointer">
                <Checkbox
                    checked={hasOptions}
                    onChange={(e) => {
                        setHasOptions(e.target.checked);
                        setProduct((prev: any) => ({
                            ...prev,
                            enableVariants: e.target.checked ? true : null,
                        }));
                    }}
                />
                <span>This product has variants (size, color, etc.)</span>
            </label>

            {hasOptions ? (
                <MultipleOptions
                    product={product}
                    setProduct={setProduct}
                    setSaveProduct={setSaveProduct}
                />
            ) : (
                <SingleOption product={product} setProduct={setProduct} />
            )}
        </div>
    );
}
