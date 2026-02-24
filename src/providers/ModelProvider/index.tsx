"use client";

import { useModelStore } from "@/store";
import { getAllModels } from "@/services";
import { ReactNode, useEffect } from "react";

// This provider hydrates the model data
export function ModelProvider({ children }: { children: ReactNode }) {
    const setModels = useModelStore((s) => s.setModels);
    const setLoading = useModelStore((s) => s.setLoading);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                const models = await getAllModels();
                setModels(models);
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, [setModels, setLoading]);

    return <>{children}</>;
}
