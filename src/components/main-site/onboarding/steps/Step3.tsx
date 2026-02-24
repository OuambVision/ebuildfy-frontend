"use client";

import { useModelStore, useShopStore } from "@/store";

import ModelsDisplay from "@/components/common/models/ModelsDisplay";

export default function Step3({ router }: { router: any }) {
    const models = useModelStore((state) => state.models);
    const shops = useShopStore((state) => state.shops);

    const shopTemplate = shops?.find((shop) => shop.active)?.template;

    const boutonsClasses =
        "px-4 py-2 rounded bg-main-500 hover:bg-main-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    return (
        <div className="space-y-4">
            <h2 className="text-base md:text-lg font-semibold">
                Choisir un modèle pour votre boutique
            </h2>

            {models?.length > 0 ? (
                <ModelsDisplay templates={models} />
            ) : (
                <p className="text-sm text-gray-500">
                    Aucun modèle disponible pour le moment.
                </p>
            )}

            <div className="flex justify-between mt-8">
                <button
                    onClick={() => router.push("/onboarding?step=2")}
                    className={boutonsClasses}
                >
                    Précédent
                </button>

                <button
                    onClick={() => router.push("/onboarding?step=4")}
                    disabled={shopTemplate ? false : true}
                    className={boutonsClasses}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
