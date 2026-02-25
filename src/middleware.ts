import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    try {
        // 1. Call backend to verify:
        // - user logged in (via httpOnly cookie)
        // - shop active
        // - onboarding state
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/active-shop`,
            {
                method: "GET",
                headers: {
                    // IMPORTANT: forward cookies to backend
                    Cookie: req.headers.get("cookie") || "",
                },
                cache: "no-store", // avoid cache issues at edge
            }
        );

        // 2. If backend request fails (invalid token, user not logged in, etc.)
        if (!res.ok) {
            console.log("Authentication check failed with status:");
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // 3. Read JSON response
        const result = await res.json();

        // 4. Additional security (backend returns an error)
        if (!result || result.error) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // 5. Check shop onboarding
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

        // 6. All good → access authorized
        return NextResponse.next();
    } catch (error) {
        // 7. Security: if unexpected error → redirect to login
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// 8. Routes protected by middleware
export const config = {
    matcher: ["/dashboard/:path*", "/products/:path*", "/orders/:path*"],
};
