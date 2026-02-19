import { Shop } from "@/types";

/* ============================= */
/* ===== Rich Text (Payload) ==== */
/* ============================= */

export interface RichTextNode {
    type: string;
    version: number;
    children?: RichTextNode[];
    text?: string;
    format?: string | number;
    indent?: number;
    style?: string;
    detail?: number;
    mode?: string;
}

export interface RichText {
    root: RichTextNode;
}

/* ============================= */
/* ========= Variants ========== */
/* ============================= */

export interface Variant {
    id: number;
    // Ajoute ici les champs si tes variants ont plus de propriétés
}

export interface PaginatedResponse<T> {
    docs: T[];
    hasNextPage: boolean;
}

/* ============================= */
/* ========= Owner ============= */
/* ============================= */

export interface ShopOwner {
    id: number;
    name: string;
    email: string;
    roles: string[];
    googleId?: string;
    authProvider?: string;
    createdAt: string;
    updatedAt: string;
}

/* ============================= */
/* ========= Product =========== */
/* ============================= */

export interface Product {
    id: number;
    title: string;
    slug: string;

    description: RichText;

    gallery: unknown[];

    inventory: number;

    enableVariants: boolean | null;
    variantTypes: unknown[];
    variants: PaginatedResponse<Variant>;

    priceInUSDEnabled: boolean | null;
    priceInUSD: number | null;

    relatedProducts: Product[];

    meta: {
        title: string | null;
        image: string | null;
        description: string | null;
    };

    categories: unknown[];

    isFeatured: boolean | null;

    shop: Shop;

    optionTypes: unknown[];
    variantOptions: unknown[] | null;

    generateSlug: boolean;

    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    _status: "draft" | "published";

    layout: unknown[];
}
