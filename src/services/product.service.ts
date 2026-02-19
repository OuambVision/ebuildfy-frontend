import Axios from "./caller.service";
import { Product } from "@/types/product.types";

/**
 * use to fetch products from the API
 * @returns {Promise<any>} - A promise that resolves to the list of products
 */
const fetchProducts = async () => {
    try {
        const response = await Axios.get("/products", {
            params: {
                limit: 100, // adjust the limit as needed
            },
        });
        console.log("Fetched products response:", response?.data?.docs);
        return response?.data?.docs;
    } catch (error) {
        throw error;
    }
};

/**
 * use to fetch a product by its slug from the API
 * @param {string} slug - The slug of the product to fetch
 * @returns {Promise<any>} - A promise that resolves to the product data
 */
const getProductBySlug = async (slug: string) => {
    const res = await Axios.get("/products", {
        params: {
            where: {
                slug: {
                    equals: slug,
                },
            },
            depth: 3, // IMPORTANT for variants + categories
            limit: 1, // we expect only one product per slug
        },
    });

    return res.data?.docs?.[0] ?? null;
};

/**
 * use to fetch a product by its ID from the API
 * @param {string} id - The ID of the product to fetch
 * @returns {Promise<any>} - A promise that resolves to the product data
 */
const getProductById = async (id: string) => {
    const res = await Axios.get("/products", {
        params: {
            where: {
                id: {
                    equals: id,
                },
            },
        },
    });

    return res.data?.docs?.[0] ?? null;
};

/**
 * use to fetch all product slugs from the API
 * @returns {Promise<string[]>} - A promise that resolves to the list of product slugs
 */
const getAllProductSlugs = async () => {
    const res = await Axios.get("/products", {
        params: {
            limit: 1000,
            depth: 0,
        },
    });

    return res.data?.docs?.map((p: Product) => p.slug) ?? [];
};

export { fetchProducts, getAllProductSlugs, getProductById, getProductBySlug };
