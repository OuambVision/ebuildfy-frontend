// providers/LoadingProvider.tsx
"use client";

import Loading from "@/components/common/Loading";
import { createContext, useContext, useState } from "react";

type LoadingContextType = {
    showLoading: () => void;
    hideLoading: () => void;
    isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider
            value={{ showLoading, hideLoading, isLoading }}
        >
            {children}
            {isLoading && <Loading />}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used inside LoadingProvider");
    }
    return context;
};
