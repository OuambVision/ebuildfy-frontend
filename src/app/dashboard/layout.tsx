"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import DashboardHeader from "@/components/main-site/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/main-site/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <DashboardHeader
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <DashboardSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Contenu */}
                <main className="flex-1 overflow-y-auto bg-muted/40 p-3 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
