import { create } from "zustand";

type TemplatesState = {
    models: any | null;
    loading: boolean;
    setModels: (models: any | null) => void;
    setLoading: (loading: boolean) => void;
};

export const useModelStore = create<TemplatesState>((set) => ({
    models: null,
    loading: true,
    setModels: (models) => set({ models }),
    setLoading: (loading) => set({ loading }),
}));
