'use client"';
import { ToastProvider } from "./ToastProvider";
import { ConfirmProvider } from "./ConfirmProvider";
import { AuthProvider } from "./AuthProvider";
import { ShopHydratorProvider } from "@/providers/ShopHydratorProvider";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { ModelProvider } from "@/providers/ModelProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LoadingProvider>
                    <ShopHydratorProvider>
                        <ModelProvider>
                            <ConfirmProvider>
                                <ToastProvider>{children}</ToastProvider>
                            </ConfirmProvider>
                        </ModelProvider>
                    </ShopHydratorProvider>
                </LoadingProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
