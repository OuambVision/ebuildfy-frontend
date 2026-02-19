import { getShopOptionTypes } from "@/services";
import { useShopStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

// Custom hook to fetch shop option types
export const useShopOptionTypes = () => {
    const activeShopId = useShopStore((state) => state.activeShopId);
    return useQuery({
        queryKey: ["shop-option-types", activeShopId],
        queryFn: () => getShopOptionTypes(activeShopId as string),
        enabled: !!activeShopId, //bloque tant que shop pas prête
        staleTime: 1000 * 60 * 5, // 5 min fresh
        gcTime: 1000 * 60 * 15, // 15 min cache
        refetchOnWindowFocus: false,
    });
};
