// types/user.types.ts

/* ============================= */
/* ===== Pagination générique === */
/* ============================= */
export interface Paginated<T> {
    docs: T[];
    hasNextPage: boolean;
}

/* ============================= */
/* ===== User ================== */
/* ============================= */
export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];

    googleId?: string;
    authProvider?: string;

    orders: Paginated<unknown>; // Remplacer unknown par un type Order si créé
    cart: Paginated<unknown>; // Remplacer unknown par CartItem si créé
    addresses: Paginated<unknown>; // Remplacer unknown par Address si créé

    createdAt: string;
    updatedAt: string;
}
