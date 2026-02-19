// types/cart.types.ts

export interface CartItem {
    productId: number;
    variantId: number;
    quantity: number;
    price?: number;
    name?: string;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface StockCheckResponse {
    success: boolean;
    available: boolean;
    availableQuantity: number;
    message?: string;
}

export interface CheckoutValidationResponse {
    success: boolean;
    message?: string;
    totalAmount?: number;
    validatedItems?: CartItem[];
}
