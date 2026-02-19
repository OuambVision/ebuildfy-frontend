import { User } from "@/types";

/* ============================= */
/* ===== Onboarding ============ */
/* ============================= */
export interface OnboardingTask {
    id: string;
    key: string;
    label: string;
    done: boolean;
}

export interface Onboarding {
    completed: boolean;
    step: number;
    tasks: OnboardingTask[];
}

/* ============================= */
/* ===== Template ============== */
/* ============================= */
export interface TemplateThumbnail {
    id: number;
    alt: string;
    caption: string | null;
    url: string;
    thumbnailURL?: string | null;
    filename: string;
    mimeType: string;
    filesize: number;
    width: number;
    height: number;
    focalX: number;
    focalY: number;
    updatedAt: string;
    createdAt: string;
}

export interface ShopTemplate {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    thumbnail: TemplateThumbnail;
    category: string;
    features: unknown[];
    price: number;
    isFree: boolean;
    isDefault: boolean;
    isActive: boolean;
    demoUrl: string;
    createdAt: string;
    updatedAt: string;
}

/* ============================= */
/* ===== Domaine =============== */
/* ============================= */
export interface ShopDomain {
    subdomain: string;
    customDomain: string | null;
    verified: boolean;
}

/* ============================= */
/* ===== Payment =============== */
/* ============================= */
export interface StripeInfo {
    accountId: string | null;
    onboardingCompleted: boolean;
}

export interface ShopPayment {
    method: string;
    interacEmail?: string;
    stripe: StripeInfo;
}

/* ============================= */
/* ===== Settings ============== */
/* ============================= */
export interface ShopSettings {
    currency: string;
    language: string;
    timezone: string;
    email: string;
}

/* ============================= */
/* ===== Shop ================== */
/* ============================= */
export interface Shop {
    id: number;
    name: string;
    slug: string;
    active: boolean;
    status: string;
    plan: string;

    owner: User;
    members: unknown[];
    onboarding: Onboarding;
    template: ShopTemplate;
    domain: ShopDomain;
    payment: ShopPayment;
    settings: ShopSettings;

    createdAt: string;
    updatedAt: string;
}
