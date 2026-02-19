import { fetchProducts } from "@/services";
import { useQuery } from "@tanstack/react-query";

// Custom hook to fetch products of the logged-in user
export const useProducts = () => {
    // Use React Query to manage fetching and caching of products
    return useQuery({
        queryKey: ["products"], // unique key for the query
        queryFn: fetchProducts, // function to fetch products
        enabled: true, // only run the query if the user is logged in
        staleTime: 1000 * 60 * 60, // 1 hour, data considered fresh
        gcTime: 1000 * 60 * 30, // 30 minutes, data remains in cache
        refetchOnMount: false, // no refetch on mount if data is fresh
        refetchOnWindowFocus: false, // no refetch on focus return
    });
};
