"use client";

import { useLoading } from "@/providers/LoadingProvider";
import { updateShop } from "@/services";
import { useShopStore } from "@/store";
import {
    Award,
    CheckCircle,
    CreditCard,
    Globe,
    ShoppingBag,
    Star,
} from "lucide-react";
import { useMemo } from "react";

export default function Step6({ router }: { router: any }) {
    const { shops, setShops } = useShopStore();
    const { showLoading, hideLoading } = useLoading();

    const shop = useMemo(() => shops.find((s) => s.active), [shops]);

    if (!shop) return null;

    const handleContinue = async () => {
        try {
            showLoading();

            const { doc: updatedShop } = await updateShop(String(shop.id), {
                onboarding: {
                    completed: true,
                    step: 6,
                },
                status: "active",
            });

            setShops(
                shops.map((s) => (s.id === updatedShop.id ? updatedShop : s))
            );

            router.push("/dashboard");
        } finally {
            hideLoading();
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            {/* HEADER */}
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <CheckCircle className="text-main-500" />
                    Félicitations <Award className="w-6 h-6 text-main-500" />
                </h2>

                <p className="text-muted-foreground">
                    Votre boutique est maintenant configurée et prête à
                    accueillir vos clients.
                </p>
            </div>

            {/* RÉCAP */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                <RecapItem
                    icon={<ShoppingBag className="text-main-500" />}
                    label="Nom de la boutique"
                    value={shop.name}
                />

                <RecapItem
                    icon={<CheckCircle className="text-main-500" />}
                    label="Template choisi"
                    value={shop.template?.name || "Template sélectionné"}
                />

                <RecapItem
                    icon={<Globe className="text-main-500" />}
                    label="Adresse de la boutique"
                    value={`https://${shop.domain?.subdomain}.ebuildfy.io`}
                />

                <RecapItem
                    icon={<CreditCard className="text-main-500" />}
                    label="Paiement"
                    value={
                        shop.payment?.method === "interac"
                            ? `Interac e-Transfer (${shop.payment.interacEmail})`
                            : "Carte de crédit (bientôt disponible)"
                    }
                />
            </div>

            {/* MESSAGE MARKETING */}
            <div className="rounded-md bg-main-50 border border-main-200 p-2 md:p-4 text-sm">
                <p className="font-medium text-main-700 flex items-center gap-1">
                    <Star className="w-4 h-4" /> Prochaine étape : ajoutez votre
                    premier produit
                </p>
                <p className="text-main-600 mt-1">
                    Une boutique sans produit ne peut pas vendre. Prenez 2
                    minutes pour ajouter votre premier article et commencer à
                    recevoir des commandes.
                </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => router.push("/onboarding?step=5")}
                    className="flex-1 px-4 py-3 rounded-md border border-border hover:bg-muted cursor-pointer"
                >
                    Précédent
                </button>
                <button
                    onClick={handleContinue}
                    className="flex-1 px-4 py-3 rounded-md bg-main-500 hover:bg-main-600 text-white font-medium cursor-pointer"
                >
                    Ajouter mon premier produit
                </button>
            </div>
        </div>
    );
}

/* -------------------------
   COMPONENTS
------------------------- */
function RecapItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-semibold">{value}</p>
            </div>
        </div>
    );
}
