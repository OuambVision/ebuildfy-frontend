import { getPartialShopProducts, getShopProducts } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Custom hook to fetch shop products with pagination and search
export const useShopProducts = ({
    shopId,
    page,
    search,
    limit,
}: {
    shopId?: string;
    page: number;
    search: string;
    limit: number;
}) => {
    return useQuery({
        queryKey: ["shop-products", shopId, page, search, limit],
        queryFn: () =>
            getPartialShopProducts({
                shopId: shopId!,
                page,
                search,
                limit,
            }),
        enabled: !!shopId, //bloque tant que shop pas prête
        staleTime: 1000 * 60 * 2, // 2 min fresh
        gcTime: 1000 * 60 * 10, // 10 min cache
        placeholderData: keepPreviousData, //pagination fluide
        refetchOnWindowFocus: false,
    });
};

// Custom hook to fetch all shop products without pagination
export const useAllShopProducts = ({ shopId }: { shopId?: string }) => {
    return useQuery({
        queryKey: ["all-shop-products", shopId],
        queryFn: () => getShopProducts(shopId as string),
        enabled: !!shopId, //bloque tant que shop pas prête
        staleTime: 1000 * 60 * 5, // 5 min fresh
        gcTime: 1000 * 60 * 15, // 15 min cache
        refetchOnWindowFocus: false,
    });
};
