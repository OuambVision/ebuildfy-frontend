"use client";

import { useLoading } from "@/providers/LoadingProvider";
import { updateShop } from "@/services";
import { useModelStore, useShopStore } from "@/store";
import { emailPattern } from "@/libs/utils";
import { Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Step5({ router }: { router: any }) {
    const { shops, setShops } = useShopStore();
    const { showLoading, hideLoading } = useLoading();

    const [interacEmail, setInteracEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const currentShop = useMemo(
        () => shops?.find((shop) => shop.active),
        [shops]
    );

    const models = useModelStore((state) => state.models);

    /* -------------------------
     Préremplir l’email existant
  ------------------------- */
    useEffect(() => {
        if (currentShop?.payment?.interacEmail) {
            setInteracEmail(currentShop.payment.interacEmail);
        }
    }, [currentShop]);

    /* -------------------------
     Save & Navigate
  ------------------------- */
    const saveAndNavigate = async (nextStep: number) => {
        if (!currentShop?.id || !interacEmail.trim()) return;

        if (currentShop?.payment?.interacEmail === interacEmail.trim()) {
            router.push(`/onboarding?step=${nextStep}`);
            return;
        }

        try {
            showLoading();
            setError(null);

            const { doc: updatedShop } = await updateShop(
                String(currentShop.id),
                {
                    payment: {
                        method: "interac",
                        interacEmail: interacEmail.trim(),
                    },
                    onboarding: {
                        step: nextStep,
                    },
                }
            );

            setShops(
                shops.map((shop) =>
                    shop.id === updatedShop.id ? updatedShop : shop
                )
            );

            router.push(`/onboarding?step=${nextStep}`);
        } catch {
            setError("Impossible d'enregistrer l'email de paiement.");
        } finally {
            hideLoading();
        }
    };

    const boutonsClasses =
        "px-4 py-2 rounded bg-main-500 hover:bg-main-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    if (!models) return null;

    return (
        <div className="space-y-6 w-full text-sm md:text-base">
            {/* TITRE */}
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                    Configurer le paiement pour vos clients
                </h2>
                <p className="text-sm text-muted-foreground">
                    Définissez comment vous souhaitez recevoir les paiements.
                </p>
            </div>

            {/* INTERAC */}
            <div className="space-y-2">
                <label className="font-medium">
                    Email pour recevoir les paiements Interac
                </label>

                <input
                    type="email"
                    value={interacEmail}
                    onChange={(e) => {
                        setInteracEmail(e.target.value);
                        setError(
                            e.target.value &&
                                !emailPattern.value.test(e.target.value)
                                ? "Adresse email invalide."
                                : !e.target.value.trim()
                                  ? "Le champ est requis."
                                  : null
                        );
                    }}
                    placeholder="paiement@exemple.com"
                    className="
            w-full rounded-md border border-main-300 px-4 py-2 outline-none
            focus:border-main-500
          "
                />

                {error && <p className="text-error">{error}</p>}
            </div>

            {/* EXPLICATION */}
            <div className="rounded-md border border-border bg-card p-2 md:p-4 text-muted-foreground space-y-2">
                <p className="flex items-center gap-1 flex-wrap">
                    <Info className="w-5 h-5 text-main-500" />
                    Vos clients paieront via <strong>Interac e-Transfer</strong>
                    .
                </p>

                <p>
                    Les paiements seront envoyés directement à l’adresse :
                    <br />
                    <span className="font-semibold text-foreground">
                        {interacEmail || "votre-email@exemple.com"}
                    </span>
                </p>

                <p>
                    Le paiement par <strong>carte de crédit</strong> sera
                    disponible
                    <span className="font-semibold"> prochainement</span>.
                </p>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between pt-6">
                <button
                    onClick={() => saveAndNavigate(4)}
                    className={boutonsClasses}
                    disabled={!interacEmail || !!error}
                >
                    Précédent
                </button>

                <button
                    onClick={() => saveAndNavigate(6)}
                    disabled={!interacEmail || !!error}
                    className={boutonsClasses}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
