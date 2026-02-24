"use client";

import Providers from "@/providers";
import Header from "@/components/main-site/header";
import GlobalDrawer from "@/components/common/drawer/GlobalDrawer";
import { usePathname } from "next/navigation";
import { playfair } from "@/libs/fonts";
import "./globals.css";
import i18n from "../../i18next";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const isPaddingNeeded =
        pathname !== "/" &&
        pathname !== "/login" &&
        pathname !== "/register" &&
        !pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/onboarding");
    const isHeaderNeeded =
        !pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/onboarding");

    return (
        <html lang={i18n.language}>
            <body className={`${playfair.className} font-sans`}>
                <Providers>
                    {isHeaderNeeded && <Header />}
                    <main className={`${isPaddingNeeded ? "pt-20" : null}`}>
                        {children}
                    </main>
                    <GlobalDrawer />
                </Providers>
            </body>
        </html>
    );
}
