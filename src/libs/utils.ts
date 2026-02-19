/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "@/types/product.types";
// Utility function to concatenate class names
const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
};

// Function to filter products based on selected variant filters
// Used in ShopAll component to update displayed products
const filterProductsByVariant = (
    products: any[] = [],
    filters: Record<string, string[]>,
    priceRange?: [number, number]
) => {
    let results = products;

    // Check if any variant filters are applied
    const hasVariantFilters = Object.values(filters).some(
        (arr) => Array.isArray(arr) && arr.length > 0
    );

    // Apply variant filters
    if (hasVariantFilters) {
        results = results.filter((product) => {
            return Object.entries(filters).every(([key, selectedValues]) => {
                if (
                    !Array.isArray(selectedValues) ||
                    selectedValues.length === 0
                )
                    return true;

                let fieldValues: string[] = [];

                if (key === "categories") {
                    fieldValues =
                        product?.categories?.map(
                            (c: any) => c?.title || c?.name
                        ) || [];
                } else if (key === "brands") {
                    fieldValues =
                        product?.brands?.map((b: any) => b?.title || b?.name) ||
                        [];
                } else {
                    const variantsTypes = product?.variantTypes || [];
                    product.variants?.docs?.forEach((variant: any) => {
                        variant.options?.forEach((opt: any) => {
                            const optVariantType = variantsTypes.find(
                                (vt: any) => vt.id === opt.variantType
                            );

                            if (optVariantType?.name?.toLowerCase() === key) {
                                const label = opt.label || opt.value;
                                if (label) fieldValues.push(label);
                            }
                        });
                    });
                }

                return selectedValues.some((v) => fieldValues.includes(v));
            });
        });
    }

    //
    if (priceRange) {
        const [minPrice, maxPrice] = priceRange;
        results = results.filter((product) => {
            const price = getMinVariantPrice(product);
            return price >= minPrice && price <= maxPrice;
        });
    }

    return results;
};

// Function to group variant options and count occurrences
// Counts ONLY real existing variants (not variantTypes catalog)
const groupVariantOptions = (
    products: any[] = [],
    filterKey: string
): Record<string, number> => {
    const group: Record<string, number> = {};

    products.forEach((product) => {
        if (!product) return;

        let values: string[] = [];

        // Categories
        if (filterKey === "categories") {
            values =
                product.categories?.map((c: any) => c?.title || c?.name) || [];
        }

        // Brands
        else if (filterKey === "brands") {
            values = product.brands?.map((b: any) => b?.title || b?.name) || [];
        }

        // Dynamic Variants (ram, hdd, color, storage...)
        else {
            const variantsTypes = product?.variantTypes || [];
            product.variants?.docs?.forEach((variant: any) => {
                variant.options?.forEach((opt: any) => {
                    // Find the corresponding variantType
                    const optVariantType = variantsTypes.find(
                        (vt: any) => vt.id === opt.variantType
                    );
                    // Match ONLY the requested variant type
                    if (optVariantType?.name?.toLowerCase() === filterKey) {
                        const label = opt.label || opt.value;
                        if (label) values.push(label);
                    }
                });
            });
        }

        // ✅ Count occurrences
        values.forEach((v) => {
            group[v] = (group[v] || 0) + 1;
        });
    });

    return group;
};

// Helper function to get the minimum variant price of a product
const getMinVariantPrice = (product: any): number => {
    if (!product?.variants?.docs?.length) return Infinity;

    const prices = product.variants.docs
        .map((v: any) => v.priceInUSD)
        .filter((price: number | null) => typeof price === "number");

    if (!prices.length) return Infinity;

    return Math.min(...prices);
};

// Function to sort products based on selected option
const sortProductsByOption = (option: string, products: any[]) => {
    //create a copy of products to avoid mutating the original array
    let sortedProducts = null;
    switch (option) {
        case "Price, low to high":
            sortedProducts = [...products].sort(
                (a, b) => getMinVariantPrice(a) - getMinVariantPrice(b)
            );
            break;
        case "Price, high to low":
            sortedProducts = [...products].sort(
                (a, b) => getMinVariantPrice(b) - getMinVariantPrice(a)
            );
            break;
        case "Alphabetically, A-Z":
            sortedProducts = [...products].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            break;
        case "Alphabetically, Z-A":
            sortedProducts = [...products].sort((a, b) =>
                b.title.localeCompare(a.title)
            );
            break;
        case "Date, new to old":
            sortedProducts = [...products].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
            break;
        case "Date, old to new":
            sortedProducts = [...products].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );
            break;
        case "Featured":
            sortedProducts = [...products].sort(
                (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
            );
            break;
        default:
            //'Best selling' or any other default sorting
            sortedProducts = [...products]; // no specific sorting applied
    }
    return sortedProducts;
};

// Email validation pattern
const emailPattern = {
    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "Invalid email",
};

// Username validation patterns
const usernameLengthPattern = {
    value: /^.{3,20}$/,
    message: "length error",
};

// Username format pattern: lowercase letters, numbers, underscores only
const usernameFormatPattern = {
    value: /^[a-z0-9_]+$/,
    message: "format error",
};

// Function to format date strings into a more readable format
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// Email content generators
const getClientMailContent = (firstName: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${process.env.websiteURL}/img/logo/logo.png" alt="${process.env.NEXT_PUBLIC_SHOP_NAME}" style="max-width: 140px;">
    </div>

    <h2 style="color:#111;">Commande reçue avec succès ✅</h2>

    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>
      Merci pour votre commande sur <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>.
      Votre commande a bien été enregistrée et son statut est actuellement :
    </p>

    <p style="font-weight:bold; color:#e67e22;">⏳ En attente de paiement (Pending)</p>

    <p>
      Un membre de notre équipe vous contactera très prochainement afin de finaliser le paiement,
      soit <strong>manuellement</strong>, soit <strong>au moment de la livraison</strong>.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

    <h3>📦 Order successfully placed</h3>

    <p>
      Hello <strong>${firstName}</strong>,
    </p>

    <p>
      Thank you for your order at <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>.
      Your order has been successfully received and is currently marked as:
    </p>

    <p style="font-weight:bold; color:#e67e22;">⏳ Pending payment</p>

    <p>
      Our team will contact you shortly to arrange the payment,
      either <strong>manually</strong> or <strong>upon delivery</strong>.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

    <p>
      Merci pour votre confiance,<br>
      Thank you for your trust,
    </p>

    <p style="font-weight:bold;">${process.env.NEXT_PUBLIC_SHOP_NAME}</p>

    <p style="font-size: 12px; color: #999;">
      Besoin d’aide ? Contactez-nous à ${process.env.NEXT_PUBLIC_SHOP_EMAIL}
    </p>
  </div>
`;

// Shop email content for new order notification
const getShopMailContent = (
    firstName: string,
    lastName: string,
    sender: string,
    phone: string
) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
    <h2>🛒 Nouvelle commande reçue</h2>

    <p>
      Une nouvelle commande a été soumise sur <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>.
    </p>

    <p style="font-weight:bold; color:#e67e22;">Statut : En attente de paiement</p>

    <hr>

    <h3>👤 Informations client</h3>
    <p><strong>Nom :</strong> ${firstName} ${lastName}</p>
    <p><strong>Email :</strong> ${sender}</p>
    <p><strong>Téléphone :</strong> ${phone || "-"}</p>

    <hr>

    <h3>📝 Next steps</h3>
    <p>
      Veuillez contacter le client afin de convenir du paiement
      (manuel ou à la livraison).
    </p>

    <hr style="margin: 30px 0;">

    <h3>📦 New order received</h3>

    <p>
      A new order has been placed on <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>.
    </p>

    <p style="font-weight:bold; color:#e67e22;">Status: Pending payment</p>

    <p>
      Please contact the customer to arrange payment
      (manual payment or cash on delivery).
    </p>

    <p style="margin-top: 30px; font-size: 12px; color: #999;">
      ${process.env.NEXT_PUBLIC_SHOP_NAME} — Order notification
    </p>
  </div>
`;

// Shop email content for new contact message
const getShopContentForContact = (
    firstName: string,
    lastName: string,
    sender: string,
    phone: string,
    message: string
) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Nouveau message reçu</h2>
      <hr>
      <p><strong>De :</strong> ${firstName} ${lastName}</p>
      <p><strong>Email :</strong> ${sender}</p>
      <p><strong>Téléphone :</strong> ${phone || "-"}</p>
      <hr>
      <h3>Message :</h3>
      <p>${message}</p>
    </div>
  `;

// Client email content for contact acknowledgment
const getClientAcknowledgeForContact = (firstName: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">

      <p><strong>The english version follows below</strong></p>

      <!-- LOGO -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${process.env.WEBSITE_URL}/img/logo/logo.png" alt="${process.env.NEXT_PUBLIC_SHOP_NAME}" style="max-width: 150px;">
      </div>

      <!-- 🇫🇷 FR -->
      <p>Cher(e) ${firstName},</p>

      <p>
        Merci de nous avoir contactés.  
        Nous avons bien reçu votre message et vous remercions de l’intérêt que vous portez à
        <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>.
      </p>

      <p>
        Notre équipe examinera votre demande avec attention et vous répondra dans les plus brefs délais.
      </p>

      <p>
        Cordialement,<br>
        <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>
      </p>

      <p style="font-size: 12px; color: #999;">
        Pour toute question, vous pouvez nous écrire à ${process.env.NEXT_PUBLIC_SHOP_EMAIL}
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

      <!-- 🇬🇧 EN -->

      <p>Dear ${firstName},</p>

      <p>
        Thank you for contacting us.  
        We have successfully received your message and truly appreciate your interest in
        <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>.
      </p>

      <p>
        Our team will carefully review your request and get back to you as soon as possible.
      </p>

      <p>
        Kind regards,<br>
        <strong>${process.env.NEXT_PUBLIC_SHOP_NAME}</strong>
      </p>

      <p style="font-size: 12px; color: #999;">
        If you have any questions, feel free to contact us at ${process.env.NEXT_PUBLIC_SHOP_EMAIL}
      </p>
    </div>
  `;

// Function to format price in CAD currency
const formatPrice = (amount: number, currency = "CAD") =>
    new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency,
    }).format(amount / 100);

// Function to get the range of items displayed on the current page
function getPageRange(
    page: number,
    totalPages: number,
    totalDocs: number,
    docsPerPage: number
) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * docsPerPage + 1;
    let end = page * docsPerPage;

    if (end > totalDocs) end = totalDocs;

    return `${start}-${end}`;
}

// Function to truncate text at the last full word within maxLength
function truncateAtWord(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
}

// Function to extract plain text from Lexical editor content
function extractLexicalText(lexical: any): string {
    if (!lexical?.root?.children) return "";

    return lexical.root.children
        .flatMap((node: any) =>
            node.children?.map((child: any) => child.text).join("")
        )
        .join("\n");
}

// Function to convert a plain text string into a simple Lexical editor content structure
function stringToLexical(text: string) {
    return {
        root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            children: [
                {
                    type: "paragraph",
                    format: "",
                    indent: 0,
                    version: 1,
                    children: [
                        {
                            type: "text",
                            text,
                            format: 0,
                            style: "",
                            mode: "normal",
                            detail: 0,
                            version: 1,
                        },
                    ],
                },
            ],
        },
    };
}
const capitaliseFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export {
    cn,
    emailPattern,
    extractLexicalText,
    filterProductsByVariant,
    formatDate,
    formatPrice,
    getClientAcknowledgeForContact,
    getClientMailContent,
    getMinVariantPrice,
    getPageRange,
    getShopContentForContact,
    getShopMailContent,
    groupVariantOptions,
    sortProductsByOption,
    stringToLexical,
    truncateAtWord,
    usernameFormatPattern,
    usernameLengthPattern,
    capitaliseFirstLetter,
};
