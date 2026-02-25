import ProductsPageComponent from "@/components/main-site/dashboard/products/allProducts/ProductPageComponent";

type PageProps = {
    searchParams: Promise<{
        page?: string;
        search?: string;
        limit?: string;
    }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Number(params.page ?? 1);
    const search = params.search ?? "";
    const limit = Number(params.limit ?? 7);

    return <ProductsPageComponent page={page} search={search} limit={limit} />;
}
