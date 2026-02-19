/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/ui/custom/Button";
import Textarea from "@/components/ui/custom/Textarea";
import { extractLexicalText, stringToLexical } from "@/libs/utils";

import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function ProductContent({ product, setProduct }: any) {
    const [description, setDescription] = useState(
        extractLexicalText(product?.description) || ""
    );
    return (
        <div className="space-y-8">
            <Textarea
                placeholder="Product description..."
                className="min-h-[220px]"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);
                    setProduct((prev: any) => ({
                        ...prev,
                        description: stringToLexical(e.target.value),
                    }));
                }}
            />

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Gallery</h3>
                <Button variant="ghost">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Gallery
                </Button>
            </div>
        </div>
    );
}
