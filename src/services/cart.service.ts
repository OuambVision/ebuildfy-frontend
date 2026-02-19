import Axios from "axios";
import {
    CartItem,
    ShippingAddress,
    StockCheckResponse,
    CheckoutValidationResponse,
} from "@/types/cart.types";

/**
 * Check variant stock via API
 */
const checkVariantStock = async ({
    productId,
    variantId,
    quantity,
}: {
    productId: number;
    variantId: number;
    quantity: number;
}): Promise<StockCheckResponse> => {
    const res = await Axios.post<StockCheckResponse>("/api/cart/check-stock", {
        productId,
        variantId,
        quantity,
    });

    return res.data;
};

/**
 * Validate checkout items
 */
const validateCheckout = async (
    email: string,
    customerId: string,
    items: CartItem[],
    shipping: ShippingAddress,
    addAddress: boolean,
    userId?: string
): Promise<CheckoutValidationResponse> => {
    const res = await Axios.post<CheckoutValidationResponse>(
        "/api/cart/checkout-validate",
        {
            email,
            customerId,
            items,
            shipping,
            addAddress,
            userId,
        }
    );

    return res.data;
};

export { checkVariantStock, validateCheckout };
