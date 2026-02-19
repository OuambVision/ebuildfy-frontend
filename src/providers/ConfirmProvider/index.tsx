"use client";

import { createContext, useContext, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type ConfirmOptions = {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
};

type ConfirmResult = "save" | "exit" | "cancel";

type ConfirmContextType = {
    confirm: (options: ConfirmOptions) => Promise<ConfirmResult>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({});
    const [resolver, setResolver] = useState<
        ((v: ConfirmResult) => void) | null
    >(null);
    const [loading, setLoading] = useState(false);

    const confirm = (opts: ConfirmOptions) => {
        setOptions(opts);
        setOpen(true);

        return new Promise<ConfirmResult>((resolve) => {
            setResolver(() => resolve);
        });
    };

    const handleConfirm = async () => {
        setLoading(true);
        resolver?.("save"); // 💾 sauvegarder
        cleanup();
    };

    const handleExitWithoutSave = async () => {
        resolver?.("exit"); // ❌ quitter sans sauvegarder
        cleanup();
    };

    const handleCancel = async () => {
        resolver?.("cancel"); // ✖️ annuler / fermer la boîte
        cleanup();
    };

    const cleanup = () => {
        setLoading(false);
        setOpen(false);
        setResolver(null);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            <ConfirmDialog
                open={open}
                loading={loading}
                onConfirm={handleConfirm} // save
                onCancel={handleExitWithoutSave} // exit without save
                onClose={handleCancel} // cancel / close
                {...options}
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirmContext() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
    return ctx;
}

export const useConfirm = () => {
    return useConfirmContext().confirm;
};
