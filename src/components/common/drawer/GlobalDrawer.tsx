"use client";

import { useDrawerStore } from "@/store";
import { useEffect } from "react";

// GlobalDrawer component that listens to the drawer store and renders the drawer accordingly
export default function GlobalDrawer() {
    const { isOpen, closeDrawer, content, title } = useDrawerStore();

    // Lock scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    // ESC close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDrawer();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeDrawer]);

    return (
        <>
            {/* Overlay */}
            <div
                onClick={closeDrawer}
                className={`
          fixed inset-0 bg-black/40 z-40 transition-opacity
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
            />

            {/* Drawer */}
            <div
                className={`
          fixed top-0 right-0 h-full w-full sm:w-3/4 bg-white z-50 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-semibold text-lg">{title}</h2>

                    <button
                        onClick={closeDrawer}
                        className="text-gray-500 hover:text-black cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-2 overflow-y-auto h-[calc(100%-70px)]">
                    {content}
                </div>
            </div>
        </>
    );
}
