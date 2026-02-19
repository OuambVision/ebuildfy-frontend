"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import ToastContainer from "./TostContainer";

type ToastType = "success" | "error" | "info";

export type Toast = {
    id: string;
    type: ToastType;
    message: string;
};

type ToastContextType = {
    notify: (type: ToastType, message: string) => void;
    dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const notify = (type: ToastType, message: string) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            dismiss(id);
        }, 5000);
    };

    return (
        <ToastContext.Provider value={{ notify, dismiss }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
}

export const useToastContext = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
};

export const useToast = () => {
    const { notify } = useToastContext();
    return {
        toast: {
            success: (msg: string) => notify("success", msg),
            error: (msg: string) => notify("error", msg),
            info: (msg: string) => notify("info", msg),
        },
    };
};
