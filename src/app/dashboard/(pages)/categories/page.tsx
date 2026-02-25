import CategoriesPageComponent from "@/components/main-site/dashboard/categories/allCategories/CatgegoriesPageComponent";

type PageProps = {
    searchParams: Promise<{
        page?: string;
        search?: string;
        limit?: string;
    }>;
};

export default async function CategoriesPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Number(params.page ?? 1);
    const search = params.search ?? "";
    const limit = Number(params.limit ?? 7);

    return (
        <CategoriesPageComponent page={page} search={search} limit={limit} />
    );
}
