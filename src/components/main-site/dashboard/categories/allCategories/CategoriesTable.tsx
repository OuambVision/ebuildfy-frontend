import { truncateAtWord } from "@/libs/utils";
import Link from "next/link";

// This component is responsible for rendering the table of categories in the dashboard.
export default function CategoriesTable({
    categories,
    page,
    search,
    limit,
    selectedCategories,
    setSelectedCategories,
}: any) {
    return (
        <div className="rounded-sm border text-sm bg-white border-gray-300 shadow-xl ">
            {/* HEADER */}
            <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[40px_1fr_220px_120px] border-b border-gray-300 bg-muted/40 font-medium p-2 sm:pb-0 sm:px-2">
                <div className="sm:px-2 sm:py-3">
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedCategories(
                                    categories.map((c: any) => c.id)
                                );
                            } else {
                                setSelectedCategories([]);
                            }
                        }}
                        checked={
                            selectedCategories.length === categories.length &&
                            categories.length > 0
                        }
                    />
                </div>

                <div className="sm:px-4 sm:py-3">Title</div>

                <div className="hidden sm:block sm:px-4 sm:py-3">
                    Parent Category
                </div>
                <div className="hidden sm:block sm:px-4 sm:py-3">Status</div>
            </div>

            {/* ROWS */}
            {categories?.map((p: any, index: number) => (
                <div
                    key={p.id}
                    className={`grid grid-cols-[40px_1fr] sm:grid-cols-[40px_1fr_220px_120px] border-b border-gray-300 hover:bg-muted/30 p-2 sm:pb-0 sm:px-2 ${index % 2 === 0 ? "bg-gray-200" : ""}`}
                >
                    {/* Checkbox */}
                    <div className="py-2 sm:px-2 sm:py-3">
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(p.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedCategories([
                                        ...selectedCategories,
                                        p.id,
                                    ]);
                                } else {
                                    setSelectedCategories(
                                        selectedCategories.filter(
                                            (id: any) => id !== p.id
                                        )
                                    );
                                }
                            }}
                        />
                    </div>

                    {/* Title */}
                    <div className="truncate font-medium">
                        <Link
                            href={`/dashboard/categories/${encodeURIComponent(p.id)}?page=${encodeURIComponent(page)}&search=${encodeURIComponent(search)}&limit=${encodeURIComponent(limit)}`}
                            className="block w-full truncate underline sm:px-4 sm:py-3 "
                        >
                            {truncateAtWord(p.title, 50)}
                        </Link>

                        {/* Mobile meta info (OPTIONNEL mais pro) */}
                        <div className="text-xs text-muted-foreground sm:hidden mt-1">
                            {p.parentCategory?.title || "<No parent category>"}{" "}
                            · {p.status}
                        </div>
                    </div>

                    {/* Category (desktop only) */}
                    <div className="hidden sm:block sm:px-4 sm:py-3 truncate">
                        {p.parentCategory?.title || "<No parent category>"}
                    </div>

                    {/* Status (desktop only) */}
                    <div className="hidden sm:block sm:px-4 sm:py-3">
                        <span
                            className={`rounded px-2 py-1 text-xs ${
                                p.status === "published"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {p.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
