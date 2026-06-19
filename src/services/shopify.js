const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const endpoint = domain ? `https://${domain}/api/2024-07/graphql.json` : "";

async function shopifyFetch(query, variables = {}) {
  if (!domain || !token) {
    console.error("Missing Shopify env vars: VITE_SHOPIFY_DOMAIN or VITE_SHOPIFY_STOREFRONT_TOKEN");
    return null;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      console.error("Shopify GraphQL errors:", json.errors);
    }

    return json;
  } catch (error) {
    console.error("Shopify fetch failed:", error);
    return null;
  }
}

function normalizeShopifyProduct(node) {
  const firstVariant = node.variants?.edges?.[0]?.node || null;

  const featuredImage = node.featuredImage?.url || "";
  const firstImage = node.images?.edges?.[0]?.node?.url || "";
  const image = featuredImage || firstImage || "";

  const gallery =
    node.images?.edges
      ?.map((edge) => edge?.node?.url)
      .filter(Boolean) || [];

  return {
    id: node.id,
    gid: node.id,
    handle: node.handle,
    name: node.title,
    title: node.title,
    description: node.description || "",
    productType: node.productType || "",
    set: node.productType || "",
    vendor: node.vendor || "",
    tags: Array.isArray(node.tags) ? node.tags : [],

    image,
    thumb: image,
    images: gallery,
    imageGallery: gallery,

    variantGid: firstVariant?.id || "",
    variantId: firstVariant?.id ? firstVariant.id.split("/").pop() : "",
    availableForSale: Boolean(firstVariant?.availableForSale),

    price: Number(firstVariant?.price?.amount || 0),
    currencyCode: firstVariant?.price?.currencyCode || "USD",

    stock:
      typeof firstVariant?.quantityAvailable === "number"
        ? firstVariant.quantityAvailable
        : firstVariant?.availableForSale
          ? 99
          : 0,

    status: firstVariant?.availableForSale ? "active" : "inactive",
    featured: node.tags?.some((tag) => String(tag).toLowerCase() === "featured") || false,

    source: "shopify",
  };
}

export async function getShopifyProducts() {
  const query = `
    query Products {
      products(first: 100, sortKey: UPDATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            vendor
            tags
            featuredImage {
              url
              altText
            }
            images(first: 8) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query);
  const products = data?.data?.products?.edges || [];

  return products
    .map(({ node }) => normalizeShopifyProduct(node))
    .filter((product) => product.id && product.name);
}

export async function createShopifyCart(items) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const lines = items
    .filter((item) => item.variantGid && item.qty > 0)
    .map((item) => ({
      merchandiseId: item.variantGid,
      quantity: item.qty,
    }));

  if (lines.length === 0) {
    console.error("No valid Shopify cart lines. Missing variantGid.");
    return null;
  }

  const variables = {
    input: {
      lines,
    },
  };

  const data = await shopifyFetch(query, variables);

  if (data?.data?.cartCreate?.userErrors?.length) {
    console.error("Cart errors:", data.data.cartCreate.userErrors);
  }

  return data?.data?.cartCreate?.cart || null;
}