import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    try {
        // Verify authentication and shop status
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/active-shop`,
            {
                method: "GET",
                headers: {
                    Cookie: req.headers.get("cookie") || "",
                },
                cache: "no-store",
            }
        );

        if (!res.ok) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const result = await res.json();

        if (!result || result.error) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const onboarding = result.activeShopOnboarding;

        if (
            onboarding &&
            !onboarding.completed &&
            !req.nextUrl.pathname.startsWith("/onboarding")
        ) {
            return NextResponse.redirect(
                new URL(`/onboarding?step=${onboarding.step}`, req.url)
            );
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/products/:path*", "/orders/:path*"],
};
