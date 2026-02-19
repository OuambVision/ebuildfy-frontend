"use client";

import { getMe } from "@/services";
import { useAuthStore } from "@/store";
import { ReactNode, useEffect } from "react";

// This provider hydrates the authentication state on app load
export function AuthProvider({ children }: { children: ReactNode }) {
    const setUser = useAuthStore((s) => s.setUser);
    const setLoading = useAuthStore((s) => s.setLoading);

    useEffect(() => {
        const hydrate = async () => {
            try {
                setLoading(true);
                const user = await getMe();
                console.log("Fetched user:", user);
                if (user) setUser(user);
            } finally {
                setLoading(false);
            }
        };

        hydrate();
    }, [setUser, setLoading]);

    return <>{children}</>;
}
