/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import ProductsHeader from "./ProductsHeader";
import ProductsPagination from "./ProductsPagination";
import ProductsTable from "./ProductsTable";
import ProductsToolbar from "./ProductsToolbar";

export default function ProductsClient({
    docs,
    page,
    totalDocs,
    totalPages,
    search,
    limit,
    selectedProducts,
    setSelectedProducts,
    deleting,
    setDeleting,
    toast,
}: any) {
    return (
        <div className="space-y-6">
            <Breadcrumb />
            <ProductsHeader
                page={page}
                search={search}
                limit={limit}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                deleting={deleting}
                setDeleting={setDeleting}
                toast={toast}
            />

            <ProductsToolbar initialSearch={search} />

            <ProductsTable
                products={docs}
                page={page}
                search={search}
                limit={limit}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
            />

            <ProductsPagination
                page={page}
                totalPages={totalPages}
                totalDocs={totalDocs}
                limit={limit}
            />
        </div>
    );
}
