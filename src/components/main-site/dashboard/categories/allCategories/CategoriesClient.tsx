/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesPagination from "./CategoriesPagination";
import CategoriesTable from "./CategoriesTable";
import CategoriesToolbar from "./CategoriesToolbar";

export default function CategoriesClient({
    docs,
    page,
    totalDocs,
    totalPages,
    search,
    limit,
    selectedCategories,
    setSelectedCategories,
    deleting,
    setDeleting,
    toast,
}: any) {
    return (
        <div className="space-y-6">
            <Breadcrumb />
            <CategoriesHeader
                page={page}
                search={search}
                limit={limit}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                deleting={deleting}
                setDeleting={setDeleting}
                toast={toast}
            />

            <CategoriesToolbar initialSearch={search} />

            <CategoriesTable
                categories={docs}
                page={page}
                search={search}
                limit={limit}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
            />

            <CategoriesPagination
                page={page}
                totalPages={totalPages}
                totalDocs={totalDocs}
                limit={limit}
            />
        </div>
    );
}
