"use client";

import { ReactNode, Suspense } from "react";

export default function OnboardingLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-2 md:p-6">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-4 md:p-8 text-sm md:text-base">
                <Suspense>{children}</Suspense>
            </div>
        </div>
    );
}
