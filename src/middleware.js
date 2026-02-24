// middleware.ts
import { NextResponse } from "next/server";

export async function middleware(req) {
    const shopId = req.cookies.get("activeShopId")?.value;

    // Si aucun shop actif, rediriger vers sélection
    if (!shopId) return NextResponse.redirect(new URL("/select-shop", req.url));

    // Récupérer le shop depuis Payload
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shops/${shopId}`,
        {
            headers: {
                Cookie: req.headers.get("cookie") || "",
            },
        }
    );

    if (!res.ok) return NextResponse.redirect(new URL("/select-shop", req.url));

    const shop = await res.json();

    // Rediriger vers onboarding si incomplet
    if (
        !shop.onboarding.completed &&
        !req.nextUrl.pathname.startsWith("/onboarding")
    ) {
        return NextResponse.redirect(
            new URL(`/onboarding?step=${shop.onboarding.step}`, req.url)
        );
    }

    return NextResponse.next();
}

// Définir les routes à protéger
export const config = {
    matcher: ["/dashboard/:path*", "/products/:path*", "/orders/:path*"],
};
