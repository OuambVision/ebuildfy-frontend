"use client";

import { useLoading } from "@/providers/LoadingProvider";
import { ReactNode, useEffect } from "react";

type LoaderProps = {
    conditions: boolean[]; // ✅ toutes les conditions à vérifier
    skeleton?: ReactNode; // optionnel, skeleton personnalisé
};

export function useShopLoader({
    conditions,
    skeleton,
}: LoaderProps): ReactNode {
    const { showLoading, hideLoading } = useLoading();

    const defaultSkeleton = (
        <div className="p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
        </div>
    );

    // Détecte si au moins une condition est vraie
    const isAnyLoading = conditions.some(Boolean);

    // Gestion du loader global
    useEffect(() => {
        if (isAnyLoading) {
            showLoading();
        } else {
            hideLoading();
        }

        return () => {
            hideLoading();
        };
    }, [isAnyLoading, showLoading, hideLoading]);

    // Retourne le skeleton si en chargement
    if (isAnyLoading) {
        return skeleton || defaultSkeleton;
    }

    return null;
}
