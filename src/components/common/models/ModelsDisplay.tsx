"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { ImMobile } from "react-icons/im";
import { IoIosDesktop } from "react-icons/io";

import { updateShop } from "@/services";
import { useShopStore } from "@/store";

import { useLoading } from "@/providers/LoadingProvider";

type Template = {
    id: number;
    name: string;
    slug: string;
    demoUrl: string;
    thumbnail: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
};

export default function ModelsDisplay({
    templates,
}: {
    templates: Template[];
}) {
    const [isIframeMobileView, setIsIframeMobileView] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    );
    const shops = useShopStore((state) => state.shops);
    const { showLoading, hideLoading } = useLoading();

    const currentShop = useMemo(
        () => shops?.find((shop) => shop.active),
        [shops]
    );
    const shopTemplate = currentShop?.template;

    const updateShopTemplate = async (shopId: string, templateId: string) => {
        try {
            showLoading();
            const { doc: updatedShop } = await updateShop(shopId, {
                template: parseInt(templateId),
            });

            // Update Zustand store
            useShopStore
                .getState()
                .setShops(
                    shops.map((shop) =>
                        shop.id === updatedShop.id ? updatedShop : shop
                    )
                );
            setSelectedTemplate(null);
        } catch (error) {
            console.error("Failed to update shop template:");
            setSelectedTemplate(null);
        } finally {
            hideLoading();
        }
    };

    const toggleIframeView = (mode: String) => {
        if (mode === "mobile") {
            setIsIframeMobileView(true);
        } else if (mode === "desktop") {
            setIsIframeMobileView(false);
        }
    };

    return (
        <>
            <div className="flex flex-wrap justify-center gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={`relative group border rounded-lg shadow hover:shadow-lg transition-shadow duration-200 w-[300px]  flex flex-col items-center overflow-hidden hover:bg-black/5 ${shopTemplate?.id === template.id ? "border-green-500 border-1 shadow-lg shadow-green-500/50" : "border-transparent"}`}
                    >
                        {shopTemplate?.id === template.id && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-20">
                                {"✔️ modèle sélectionné"}
                            </div>
                        )}

                        {/* Image */}
                        <div className="relative w-full h-48 flex items-center justify-center bg-gray-100 ">
                            <Image
                                src={template.thumbnail.url}
                                alt={template.thumbnail.alt}
                                fill
                                className="object-contain"
                            />

                            {/* Bouton visualiser au centre */}
                            <button
                                onClick={() => setSelectedTemplate(template)}
                                className="absolute flex items-center justify-center bg-main-400 bg-opacity-30 text-white font-bold px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer opacity-100 sm:opacity-0"
                            >
                                Voir le modèle
                            </button>
                        </div>

                        {/* Nom du template */}
                        <div className="px-4 py-2 text-center w-full text-sm md:text-base flex flex-col items-center gap-4">
                            <h3 className="font-semibold truncate">
                                {template.name}
                            </h3>
                            <button
                                onClick={() => {
                                    const activeShopId = currentShop?.id;
                                    if (activeShopId) {
                                        updateShopTemplate(
                                            String(activeShopId),
                                            template.id.toString()
                                        );
                                    }
                                }}
                                className="bg-main-400 hover:bg-main-500 px-2 py-1 rounded text-white cursor-pointer  text-sm"
                            >
                                Choisir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal iframe */}
            {selectedTemplate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4"
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        className="relative w-full max-w-6xl h-[80vh] bg-transparent rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full flex justify-between items-center z-10 bg-main-100">
                            <div className="text-main-700 font-bold flex items-center gap-2 ml-2">
                                <button
                                    className={`p-1 cursor-pointer ${isIframeMobileView ? "bg-main-500 text-white" : null} rounded-full`}
                                    onClick={() => toggleIframeView("mobile")}
                                >
                                    <ImMobile className="w-4 h-4" />
                                </button>
                                <button
                                    className={`p-1 cursor-pointer ${!isIframeMobileView ? "bg-main-500 text-white" : null} rounded-full`}
                                    onClick={() => toggleIframeView("desktop")}
                                >
                                    <IoIosDesktop className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="z-10 p-2 cursor-pointer"
                            >
                                <BsCircleFill className="w-4 h-4 text-red-600 mr-1" />
                            </button>
                        </div>
                        {/* Close button */}

                        <iframe
                            src={selectedTemplate.demoUrl}
                            className={`h-full border-0 ${isIframeMobileView ? "w-[360px]" : "w-full"} mx-auto mt-2 rounded-lg shadow-lg`}
                            title={selectedTemplate.name}
                        ></iframe>
                        <button
                            onClick={() => {
                                const activeShopId = currentShop?.id;
                                if (activeShopId) {
                                    updateShopTemplate(
                                        String(activeShopId),
                                        selectedTemplate.id.toString()
                                    );
                                }
                            }}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-main-500 hover:bg-main-600 px-3 py-2 font-bold rounded text-white cursor-pointer  text-base md:text-lg"
                        >
                            Choisir ce modèle
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
