import { getPartialShopCategories, getShopCategories } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Custom hook to fetch shop products with pagination and search
export const usePartialShopCategories = ({
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
        queryKey: ["partial-shop-categories", shopId, page, search, limit],
        queryFn: () =>
            getPartialShopCategories({
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

// Custom hook to fetch shop categories
export const useShopCategories = ({ shopId }: { shopId?: string }) => {
    return useQuery({
        queryKey: ["shop-categories", shopId],
        queryFn: () => getShopCategories(shopId as string),
        enabled: !!shopId, //bloque tant que shop pas prête
        staleTime: 1000 * 60 * 2, // 2 min fresh
        gcTime: 1000 * 60 * 10, // 10 min cache
        placeholderData: keepPreviousData, //pagination fluide
        refetchOnWindowFocus: false,
    });
};
