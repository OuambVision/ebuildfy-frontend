import Axios from "./caller.service";

type GetProductsArgs = {
    shopId: string;
    page?: number;
    limit?: number;
    search?: string;
};

/**
 * use to fetch shops owned by a specific user from the API
 * @param {string} userId - The ID of the user whose shops to fetch
 * @returns {Promise<any>} - A promise that resolves to the list of shops
 */
const getMyShops = async (userId: string) => {
    try {
        const response = await Axios.get("/shops", {
            params: {
                where: {
                    owner: {
                        equals: userId,
                    },
                },
                limit: 100,
            },
        });
        return response?.data?.docs;
    } catch (error) {
        throw error;
    }
};

/**
 * use to update a shop's information via the API
 * @param {string} shopId - The ID of the shop to update
 * @param {Record<string, any>} data - The data to update the shop with
 * @returns {Promise<any>} - A promise that resolves to the updated shop data
 */
const updateShop = async (shopId: string, data: Record<string, unknown>) => {
    console.log("Updating shop with data:", data, shopId);
    try {
        const response = await Axios.patch(`/shops/${shopId}`, data);
        return response?.data;
    } catch (error) {
        throw error;
    }
};

/** * use to fetch all available templates from the API
 * @returns {Promise<any>} - A promise that resolves to the list of templates
 */
const getAllModels = async () => {
    try {
        const response = await Axios.get("/templates", {
            params: {
                limit: 100,
            },
        });
        return response?.data?.docs;
    } catch (error) {
        throw error;
    }
};

/** * use to fetch products associated with a specific shop from the API
 * @param {string} shopId - The ID of the shop whose products to fetch
 * @returns {Promise<any>} - A promise that resolves to the list of products
 */
const getShopProducts = async (shopId: string) => {
    try {
        const response = await Axios.get("/products", {
            params: {
                where: {
                    shop: {
                        equals: shopId,
                    },
                },
                limit: 100,
            },
        });
        return response?.data?.docs;
    } catch (error) {
        throw error;
    }
};

/** * use to fetch a paginated list of products for a specific shop from the API
 * @param {GetProductsArgs} args - The arguments for fetching products
 * @param {string} args.shopId - The ID of the shop whose products to fetch
 * @param {number} [args.page=1] - The page number to fetch
 * @param {number} [args.limit=10] - The number of products per page
 * @param {string} [args.search=''] - The search term to filter products by title
 * @returns {Promise<any>} - A promise that resolves to the paginated list of products
 */
const getPartialShopProducts = async ({
    shopId,
    page = 1,
    limit = 10,
    search = "",
}: GetProductsArgs) => {
    try {
        const response = await Axios.get("/products", {
            params: {
                page,
                limit,
                sort: "-createdAt",
                where: {
                    and: [
                        {
                            shop: {
                                equals: shopId,
                            },
                        },
                        search
                            ? {
                                  title: {
                                      like: search,
                                  },
                              }
                            : {},
                    ],
                },
            },
        });

        return {
            docs: response.data.docs,
            totalDocs: response.data.totalDocs,
            totalPages: response.data.totalPages,
            page: response.data.page,
        };
    } catch (error) {
        throw error;
    }
};

/**
 *Use to fetch a paginated list of categories for a specific shop from the API
 * @param {GetProductsArgs} args - The arguments for fetching categories
 * @param {string} args.shopId - The ID of the shop whose categories to fetch
 * @param param0
 * @returns {Promise<any>} - A promise that resolves to the paginated list of categories
 */
const getPartialShopCategories = async ({
    shopId,
    page = 1,
    limit = 10,
    search = "",
}: GetProductsArgs) => {
    try {
        const response = await Axios.get("/categories", {
            params: {
                page,
                limit,
                sort: "-createdAt",
                where: {
                    and: [
                        {
                            shop: {
                                equals: shopId,
                            },
                        },
                        search
                            ? {
                                  title: {
                                      like: search,
                                  },
                              }
                            : {},
                    ],
                },
            },
        });
        return {
            docs: response.data.docs,
            totalDocs: response.data.totalDocs,
            totalPages: response.data.totalPages,
            page: response.data.page,
        };
    } catch (error) {
        throw error;
    }
};

/** * use to fetch categories associated with a specific shop from the API
 * @param {string} shopId - The ID of the shop whose categories to fetch
 * @returns {Promise<any>} - A promise that resolves to the list of categories
 */
const getShopCategories = async (shopId: string) => {
    try {
        const response = await Axios.get("/categories", {
            params: {
                where: {
                    shop: {
                        equals: shopId,
                    },
                },
                limit: 100,
            },
        });
        return response?.data?.docs;
    } catch (error) {
        throw error;
    }
};
/** * use to add a new product to a specific shop via the API
 * @param {string} shopId - The ID of the shop to add the product to
 * @returns {Promise<any>} - A promise that resolves to the newly created product
 */
const addPoductToShop = async (shopId: string) => {
    try {
        const response = await Axios.post("/products", {
            title: "New Product " + Date.now(), // Temporary title
            shop: shopId,
        });
        return response?.data;
    } catch (error) {
        throw error;
    }
};

const addCategorieToShop = async (shopId: string) => {
    try {
        const response = await Axios.post("/categories", {
            title: "New Categorie " + Date.now(), // Temporary name
            shop: shopId,
        });
        return response?.data;
    } catch (error) {
        throw error;
    }
};

const updateProductInShop = async (
    productId: string,
    data: Record<string, unknown>
) => {
    try {
        const response = await Axios.patch(`/products/${productId}`, data);
        return response?.data;
    } catch (error) {
        throw error;
    }
};

const updateCategorieInShop = async (
    categorieId: string,
    data: Record<string, unknown>
) => {
    try {
        const response = await Axios.patch(`/categories/${categorieId}`, data);
        return response?.data;
    } catch (error) {
        throw error;
    }
};

const createNewOptionType = async (data: Record<string, unknown>) => {
    try {
        const response = await Axios.post(`/option-types`, data);
        return response?.data;
    } catch (error) {
        throw error;
    }
};

const updateOptionType = async (
    optionTypeId: string,
    data: Record<string, unknown>
) => {
    try {
        const response = await Axios.patch(
            `/option-types/${optionTypeId}`,
            data
        );
        return response?.data;
    } catch (error) {
        throw error;
    }
};

const getShopOptionTypes = async (shopId: string) => {
    try {
        const response = await Axios.get("/option-types", {
            params: {
                where: {
                    shop: {
                        equals: shopId,
                    },
                },
                limit: 1000,
            },
        });
        return response?.data?.docs;
    } catch (error) {
        throw error;
    }
};

const bulkDeleteProducts = async (productIds: string[]) => {
    try {
        const response = await Axios.delete("/products", {
            params: {
                where: {
                    id: {
                        in: productIds,
                    },
                },
            },
        });

        return response?.data;
    } catch (error) {
        throw error;
    }
};

const bulkDeleteCategories = async (categoryIds: string[]) => {
    try {
        const response = await Axios.delete("/categories", {
            params: {
                where: {
                    id: {
                        in: categoryIds,
                    },
                },
            },
        });
        return response?.data;
    } catch (error) {
        throw error;
    }
};

export {
    addCategorieToShop,
    addPoductToShop,
    bulkDeleteCategories,
    bulkDeleteProducts,
    createNewOptionType,
    getAllModels,
    getMyShops,
    getPartialShopCategories,
    getPartialShopProducts,
    getShopCategories,
    getShopOptionTypes,
    getShopProducts,
    updateCategorieInShop,
    updateOptionType,
    updateProductInShop,
    updateShop,
};
