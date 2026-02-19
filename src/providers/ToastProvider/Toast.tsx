"use client";

import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Toast as ToastType } from "./index";

export default function Toast({
    toast,
    onClose,
}: {
    toast: ToastType;
    onClose: () => void;
}) {
    const styles = {
        success: {
            bg: "bg-green-600",
            icon: <CheckCircle size={18} />,
        },
        error: {
            bg: "bg-red-600",
            icon: <AlertTriangle size={18} />,
        },
        info: {
            bg: "bg-gray-800",
            icon: <Info size={18} />,
        },
    };

    const style = styles[toast.type];

    return (
        <div
            className={`relative flex items-center gap-3 px-4 py-3 pr-10 rounded-lg text-white shadow-lg animate-slide-in ${style.bg}`}
        >
            {style.icon}

            <p className="text-xs md:text-sm">{toast.message}</p>

            {/* CLOSE BUTTON */}
            <button
                onClick={onClose}
                className="absolute right-1 top-1 opacity-70 hover:opacity-100 transition cursor-pointer"
                aria-label="Close toast font-bold"
            >
                <X size={14} />
            </button>
        </div>
    );
}
