// app/onboarding/components/Step2.tsx
"use client";

import { useLoading } from "@/providers/LoadingProvider";
import { updateShop } from "@/services";
import { useShopStore } from "@/store";
import { useEffect, useMemo, useState } from "react";

export default function Step2({ router }: { router: any }) {
    const { shops, setShops } = useShopStore();
    const { showLoading, hideLoading } = useLoading();

    const [shopName, setShopName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const currentShop = useMemo(
        () => shops?.find((shop) => shop.active),
        [shops]
    );

    // Préremplir le nom
    useEffect(() => {
        if (currentShop?.name) {
            setShopName(currentShop.name);
        }
    }, [currentShop]);

    const saveAndNavigate = async (nextStep: number) => {
        if (!currentShop || !shopName.trim()) return;

        const trimmedName = shopName.trim();

        // Si rien n’a changé → navigation directe
        if (currentShop?.name === trimmedName) {
            router.push(`/onboarding?step=${nextStep}`);
            return;
        }

        try {
            showLoading();
            setError(null);

            const { doc: updatedShop } = await updateShop(
                String(currentShop.id),
                {
                    name: trimmedName,
                    onboarding: { step: nextStep },
                }
            );

            // Update Zustand store
            setShops(
                shops.map((shop) =>
                    shop.id === updatedShop.id ? updatedShop : shop
                )
            );

            router.push(`/onboarding?step=${nextStep}`);
        } catch {
            setError("Impossible d'enregistrer le nom de la boutique.");
        } finally {
            hideLoading();
        }
    };

    const boutonsClasses =
        "px-4 py-2 rounded bg-main-500 hover:bg-main-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">
                Donnez le nom de votre boutique
            </h2>

            <input
                type="text"
                value={shopName}
                onChange={(e) => {
                    setShopName(e.target.value);
                    if (!e.target.value.trim())
                        setError(
                            "Le nom de la boutique ne peut pas être vide."
                        );
                    else setError(null);
                }}
                maxLength={10}
                placeholder="Nom de votre boutique"
                className="
          w-full rounded-md border border-main-300 px-4 py-2 appearance-none outline-none shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-main-500 focus:shadow-none
        "
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-between mt-8">
                <button
                    onClick={() => saveAndNavigate(1)}
                    disabled={!shopName.trim()}
                    className={boutonsClasses}
                >
                    Précédent
                </button>

                <button
                    onClick={() => saveAndNavigate(3)}
                    disabled={!shopName.trim()}
                    className={boutonsClasses}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
