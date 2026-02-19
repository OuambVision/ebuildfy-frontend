import { Fraunces, Inter, Playfair_Display } from "next/font/google";

export const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    display: "swap",
});

export const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
});

export const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    display: "swap",
});
