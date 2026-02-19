"use client";

import { useAuthStore } from "@/store";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Language from "@/components/common/Language";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

// ----------------------------
//  Component to display Header
// ----------------------------

export default function Header() {
    const { t } = useTranslation("header");
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { name: t("header.home"), href: "/" },
        { name: t("header.templates"), href: "/template" },
        { name: t("header.pricing"), href: "/pricing" },
        { name: t("header.help"), href: "/help" },
        { name: t("header.contact"), href: "/contact" },
    ];

    const user = useAuthStore((s) => s.user);
    const pathname = usePathname();

    const isHomePage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // appliquer couleur par defaut au chargement dans le site principal
    useEffect(() => {
        document.documentElement.style.setProperty("--hue-main", "205");
    }, []);

    return (
        <section
            className={`w-full top-0 z-50 px-4 lg:px-10 transition-all duration-300 ${
                isScrolled ? "top-4 sticky" : "absolute top-0 shadow-xl"
            }`}
        >
            {/* HEADER */}
            <section>
                <nav
                    className={`w-full max-w-[1500px] mx-auto  text-black rounded-2xl py-2 md:py-3 flex items-center justify-between transition-all duration-300 font-semibold ${
                        isScrolled
                            ? "shadow-xl px-3 md:px-6 bg-white"
                            : "bg-transparent px-0"
                    } ${isHomePage && isScrolled ? "text-black" : !isHomePage ? "text-black" : "text-white"} `}
                >
                    {/* Logo */}
                    <Link href="/" className="text-lg font-bold cursor-pointer">
                        Ebuildfy
                    </Link>

                    {/* DESKTOP MENU */}
                    <ul className="hidden lg:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className="hover:text-gray-800 cursor-pointer font-medium hover:font-semibold"
                            >
                                <Link href={item.href}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* RIGHT ICONS */}
                    <div className="flex items-center gap-4 text-sm">
                        {/* <div>
              {user !== null ? (
                <UserAccount />
              ) : (
                <Link href="/login">
                  <User className="hover:bg-gray-100 hover:text-gray-700 rounded-full transition cursor-pointer w-7 h-7 flex items-center justify-center p-1" />
                </Link>
              )}
            </div> */}
                        <div className="hidden lg:block ">
                            <Language />
                        </div>
                        {!user && (
                            <Link
                                href="/login"
                                className="hidden lg:inline-block font-bold hover:text-gray-800 cursor-pointer font-medium hover:font-semibold"
                            >
                                {t("header.login")}
                            </Link>
                        )}

                        <Link
                            href={user ? "/dashboard" : "/register"}
                            className="hidden lg:inline-block bg-main-500 hover:bg-main-600 text-white rounded-xl px-4 py-2 ml-4"
                        >
                            {user ? t("header.dashboard") : t("header.create")}
                        </Link>
                    </div>

                    {/* Hamburger menu */}
                    <button
                        className="lg:hidden  hover:text-main-600 transition cursor-pointer"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </nav>
            </section>

            {/* OVERLAY */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
                    mobileOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* MOBILE PANEL */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl lg:hidden transition-transform duration-300 flex flex-col justify-between ${
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div>
                    {/* CLOSE BUTTON INSIDE PANEL */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div className="text-xl font-semibold">ebuildfy</div>
                        <button
                            className="text-gray-700 hover:text-black cursor-pointer"
                            onClick={() => setMobileOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    {/* LINKS */}
                    <div className="flex flex-col p-6 space-y-4 text-lg text-gray-700 font-medium">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="hover:text-main-600 cursor-pointer font-bold border-b pb-2 border-main-200 text-sm"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="ml-6">
                        <Language />
                    </div>
                </div>

                {/* Login and create buttons */}
                <div className="flex flex-col p-4 space-y-6 border-t mt-4 pt-4 text-sm">
                    {!user && (
                        <Link
                            href="/login"
                            className="w-full text-center font-bold hover:text-main-600 bg-main-100 rounded-md px-4 py-2"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t("header.login")}
                        </Link>
                    )}
                    <Link
                        href={user ? "/dashboard" : "/register"}
                        className="w-full text-center bg-main-500 hover:bg-main-600 text-white rounded-md px-4 py-2"
                        onClick={() => setMobileOpen(false)}
                    >
                        {user ? t("header.dashboard") : t("header.create")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
