"use client";

import Toast from "./Toast";
import { Toast as ToastType, useToastContext } from "./index";

export default function ToastContainer({ toasts }: { toasts: ToastType[] }) {
    const { dismiss } = useToastContext();

    return (
        <div className="fixed bottom-5 right-3 z-[9999] flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={() => dismiss(toast.id)}
                />
            ))}
        </div>
    );
}
