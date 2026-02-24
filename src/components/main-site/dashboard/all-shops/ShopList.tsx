import ShopCard from "./ShopCard";

export default function ShopList({ shops }: { shops: any }) {
    if (!shops?.length) {
        return (
            <p className="text-base text-gray-500 text-center">
                No shops available
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {shops?.map((shop: any) => (
                <ShopCard key={shop.id} shop={shop} />
            ))}
        </div>
    );
}
