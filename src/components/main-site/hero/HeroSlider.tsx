"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HeroSlider() {
    const { t } = useTranslation("hero");
    const { t: tHeader } = useTranslation("header");
    const [index, setIndex] = useState(0);
    const user = useAuthStore((s) => s.user);

    const slides = [
        {
            img: "/media/main-site/hero/hero2.png",
        },
        {
            img: "/media/main-site/hero/hero1.png",
        },
        {
            img: "/media/main-site/hero/hero4.png",
        },
        // {
        //   img: '/media/main-site/hero/hero3.png',
        // },
    ];

    const mobileSlides = [
        {
            img: "/media/main-site/hero/mobile-hero1.png",
        },
        {
            img: "/media/main-site/hero/mobile-hero2.png",
        },
        {
            img: "/media/main-site/hero/mobile-hero3.png",
        },
    ];

    // Auto-slide every 5 sec
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full min-h-[100vh]">
            {/* ================= HERO VISUAL ================= */}
            <div className="relative w-full h-[100vh] overflow-hidden hidden md:block">
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                            i === index ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={slide.img}
                            alt=""
                            fill
                            priority
                            sizes="100vw"
                            className={`
                                object-cover object-center
                                transition-transform duration-[3000ms] ease-out
                                ${i === index ? "scale-100" : "scale-150"}
                              `}
                        />
                    </div>
                ))}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/30" />
            </div>

            <div className="relative w-full h-[100vh] overflow-hidden md:hidden">
                {mobileSlides.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                            i === index ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={slide.img}
                            alt="Banner Image"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 100vw,
                     1500px"
                            className="object-cover object-center"
                        />
                    </div>
                ))}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/30" />
            </div>

            {/* ================= HERO CONTENT (INDEPENDANT) ================= */}
            <div className="absolute inset-x-0 top-0 z-20 min-h-[100vh] flex items-center">
                <div className="max-w-[1500px] mx-auto px-3 md:px-8 pb-10 md:pb-16 mt-20">
                    <div className="max-w-4xl text-white mx-auto text-center space-y-4 md:space-y-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                            {t("hero.title")}
                        </h1>
                        <p className="text-sm md:text-lg mx-auto">
                            {t("hero.subtitle")}
                        </p>
                        <Link
                            href={user ? "/dashboard" : "/register"}
                            className=" inline-block mt-6 px-8 py-3 bg-main-500 text-white rounded-full text-sm font-semibold shadow hover:bg-main-600 transition  lg:hidden"
                        >
                            {user ? tHeader("header.dashboard") : t("hero.cta")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
