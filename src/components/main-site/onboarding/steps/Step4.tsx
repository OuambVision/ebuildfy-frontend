"use client";

import { useLoading } from "@/providers/LoadingProvider";
import { updateShop } from "@/services";
import { useShopStore } from "@/store";
import { useEffect, useMemo, useState } from "react";

import { Info } from "lucide-react";

export default function Step4({ router }: { router: any }) {
    const { shops, setShops } = useShopStore();
    const { showLoading, hideLoading } = useLoading();

    const [subdomain, setSubdomain] = useState("");
    const [error, setError] = useState<string | null>(null);

    const currentShop = useMemo(
        () => shops?.find((shop) => shop.active),
        [shops]
    );

    // Préremplir le sous-domaine existant
    useEffect(() => {
        if (currentShop?.domain?.subdomain) {
            setSubdomain(currentShop.domain.subdomain);
        } else if (currentShop?.name) {
            // fallback intelligent
            setSubdomain(slugify(currentShop.name));
        }
    }, [currentShop]);

    const saveAndNavigate = async (nextStep: number) => {
        if (!currentShop?.id || !subdomain.trim()) return;

        const normalizedSubdomain = slugify(subdomain);

        // Rien n’a changé
        if (currentShop?.domain?.subdomain === normalizedSubdomain) {
            router.push(`/onboarding?step=${nextStep}`);
            return;
        }

        try {
            showLoading();
            setError(null);

            const { doc: updatedShop } = await updateShop(
                String(currentShop.id),
                {
                    domain: {
                        subdomain: normalizedSubdomain,
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
            setError(
                "Impossible d'enregistrer le sous-domaine. Il est peut-être déjà utilisé."
            );
        } finally {
            hideLoading();
        }
    };

    const boutonsClasses =
        "px-4 py-2 rounded bg-main-500 hover:bg-main-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    return (
        <div className="space-y-6 w-full text-sm md:text-base">
            {/* TITRE */}
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                    Configurer votre domaine
                </h2>
                <p className="text-sm text-muted-foreground">
                    Ce domaine sera utilisé pour accéder à votre boutique en
                    ligne.
                </p>
            </div>

            {/* INPUT DOMAINE */}
            <div className="space-y-2">
                <label className=" font-medium">
                    Adresse de votre boutique
                </label>

                <div className="flex items-center rounded-md border border-main-300 overflow-hidden focus-within:border-main-500">
                    <span className="text-muted-foreground bg-gray-200 select-none py-1 px-2">
                        https://
                    </span>

                    <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => {
                            const value = slugify(e.target.value);
                            setSubdomain(value);
                            setError(
                                value ? null : "Le sous-domaine est requis."
                            );
                        }}
                        placeholder="nom-boutique"
                        className="flex-1 outline-none bg-transparent px-1"
                        maxLength={10}
                    />

                    <span className="text-muted-foreground bg-gray-200 select-none py-1 px-2">
                        .ebuildfy.io
                    </span>
                </div>

                {error && <p className="text-error">{error}</p>}
            </div>

            {/* EXPLICATION */}
            <div className="rounded-md border border-border bg-card p-2 md:p-4 text-muted-foreground space-y-2">
                <p className="flex items-center gap-1 flex-wrap">
                    <Info className="w-5 h-5 text-main-500" />
                    Vous pouvez modifier{" "}
                    <strong>uniquement la partie centrale</strong> du domaine.
                </p>
                <p>
                    Votre boutique sera accessible à l’adresse :
                    <br />
                    <span className="font-bold text-foreground">
                        https://{subdomain || "nom-boutique"}.ebuildfy.io
                    </span>
                </p>
                <p>
                    Plus tard, vous pourrez connecter un{" "}
                    <strong>domaine personnalisé</strong> comme
                    <code className="mx-1">nom-boutique.com</code>.
                </p>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between pt-6">
                <button
                    onClick={() => saveAndNavigate(3)}
                    className={boutonsClasses}
                >
                    Précédent
                </button>

                <button
                    onClick={() => saveAndNavigate(5)}
                    disabled={!subdomain}
                    className={boutonsClasses}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

/* -------------------------
   Utils
------------------------- */
function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}
