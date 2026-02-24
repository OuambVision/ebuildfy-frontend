/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Input from "@/components/ui/custom/Input";
import Tabs from "@/components/ui/custom/Tabs";
import ProductContent from "./ProductContent";
import ProductDetails from "./ProductDetails";
import ProductSidebar from "./ProductSidebar";

export default function ProductMain({
    product,
    setProduct,
    setSaveProduct,
    page,
    search,
    limit,
}: any) {
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setProduct((prev: any) => ({
            ...prev,
            title: value,
        }));
    };

    return (
        <section className="flex flex-col gap-8 lg:flex-row">
            <section className="flex-1 space-y-6">
                <Input
                    label="Title"
                    placeholder="Title *"
                    required
                    value={product?.title ?? ""}
                    onChange={handleTitleChange}
                />

                <Tabs
                    tabs={[
                        { label: "Content", value: "content" },
                        { label: "Product Details", value: "details" },
                    ]}
                >
                    {(active) =>
                        active === "content" ? (
                            <ProductContent
                                product={product}
                                setProduct={setProduct}
                            />
                        ) : (
                            <ProductDetails
                                product={product}
                                setProduct={setProduct}
                                setSaveProduct={setSaveProduct}
                                page={page}
                                search={search}
                                limit={limit}
                            />
                        )
                    }
                </Tabs>
            </section>

            <div className="w-full lg:w-[220px] xl:w-[300px]">
                <ProductSidebar product={product} setProduct={setProduct} />
            </div>
        </section>
    );
}
