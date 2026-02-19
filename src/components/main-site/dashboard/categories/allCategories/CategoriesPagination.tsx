/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getPageRange } from "@/libs/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CategoriesPagination({
    page,
    totalPages,
    totalDocs,
    limit,
}: any) {
    const router = useRouter();
    const params = useSearchParams();
    const [limitState, setLimitState] = useState(limit);
    const [currentPage, setCurrentPage] = useState(page);

    const goToPage = (p: number, l: number) => {
        const search = params.get("search") ?? "";
        router.push(
            `/dashboard/categories?page=${p}&search=${search}&limit=${l}`
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground font-bold">
            <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setCurrentPage(i + 1);
                            goToPage(i + 1, limitState);
                        }}
                        className={`rounded-full border px-2.5 py-1 cursor-pointer ${currentPage === i + 1 ? "bg-main-500 text-white" : null}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <span>
                    {getPageRange(page, totalPages, totalDocs, limitState)} of{" "}
                    {totalDocs}
                </span>
                <div className="flex items-center gap-1">
                    {/* select for limit */}
                    <span>Per page:</span>
                    <select
                        className="rounded border bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                        value={limitState}
                        onChange={(e) => {
                            setLimitState(Number(e.target.value));
                            goToPage(1, Number(e.target.value));
                        }}
                    >
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
