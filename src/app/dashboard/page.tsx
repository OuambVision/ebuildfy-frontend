import Breadcrumb from "@/components/common/Breadcrumb";
export default function ProductsPage() {
    return (
        <div className="space-y-4 bg-white/80 p-6 rounded-lg shadow">
            <Breadcrumb />
            <h1 className="text-2xl font-semibold">Products</h1>
            <p className="text-muted-foreground">
                Manage your products and variants here.
            </p>
        </div>
    );
}
