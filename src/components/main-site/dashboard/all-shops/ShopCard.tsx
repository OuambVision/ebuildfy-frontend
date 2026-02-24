"use client";

import { useShopStore } from "@/store";
import { useRouter } from "next/navigation";
import ShopBadge from "@/components/common/ShopBadge";
import { CheckCircle } from "lucide-react";

type Shop = {
    id: string;
    name: string;
    domain?: any;
    active: boolean;
};

export default function ShopCard({ shop }: { shop: Shop }) {
    const setActiveShopId = useShopStore((s) => s.setActiveShopId);
    const router = useRouter();
    return (
        <div className="flex items-center justify-between border rounded-lg p-3  hover:bg-gray-50 transition cursor-pointer">
            <button
                className="flex items-center gap-2"
                onClick={() => {
                    setActiveShopId(shop.id);
                    router.push("/dashboard");
                }}
            >
                <div className="cursor-pointer">
                    <ShopBadge name={shop.name} />
                </div>

                <div className="cursor-pointer">
                    <p className="font-semibold text-sm text-left">
                        {shop.name}
                    </p>
                    {shop.domain?.customDomain ? (
                        <p className="text-xs text-gray-500 text-left">
                            {shop.domain.customDomain}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500 text-left">{`https://${shop.domain.subdomain}.ebuildfy.io`}</p>
                    )}
                </div>
            </button>

            {shop.active && <CheckCircle className="h-5 w-5 text-green-600" />}
        </div>
    );
}
