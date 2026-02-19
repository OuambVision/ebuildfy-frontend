import ProductPageClient from "@/components/main-site/dashboard/products/displayProduct";
type PageProps = {
    searchParams: Promise<{
        page?: string;
        search?: string;
        limit?: string;
    }>;
};

export default async function ProductPage({
    params,
    searchParams,
}: PageProps & { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const paramsData = await searchParams;

    const page = paramsData.page ?? "1";
    const search = paramsData.search ?? "";
    const limit = paramsData.limit ?? "7";
    return (
        <ProductPageClient id={id} page={page} search={search} limit={limit} />
    );
}
