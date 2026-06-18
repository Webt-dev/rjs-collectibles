const domain = import.meta.env.VITE_SHOPIFY_DOMAIN
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const endpoint = `https://${domain}/api/2024-07/graphql.json`

async function shopifyFetch(query, variables = {}) {
  if (!domain || !token) {
    console.error('Missing Shopify env vars');
    return null;
  }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors) console.error('Shopify errors:', json.errors);
    return json;
  } catch (e) {
    console.error('Shopify fetch failed', e);
    return null;
  }
}

export async function getSealedProducts() {
  const query = `{
    products(first: 50, query: "product_type:Box OR product_type:'Booster Pack' OR product_type:'Booster Box'") {
      edges {
        node {
          id title handle productType tags
          featuredImage { url }
          images(first: 1) { edges { node { url } } }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                quantityAvailable
                price { amount }
              }
            }
          }
        }
      }
    }
  }`;

  const data = await shopifyFetch(query);
  const products = data?.data?.products?.edges || [];

  return products.map(({ node }) => {
    const variant = node.variants.edges[0]?.node;
    const imgUrl = node.featuredImage?.url || node.images.edges[0]?.node?.url || '';

    return {
      id: node.id,
      variantId: variant?.id.split('/').pop(),
      variantGid: variant?.id, // <-- FULL GID FOR CART
      name: node.title,
      handle: node.handle,
      productType: node.productType,
      price: parseFloat(variant?.price?.amount || 0),
      stock: variant?.quantityAvailable ?? (variant?.availableForSale ? 99 : 0),
      image: imgUrl,
      thumb: imgUrl,
      status: 'active',
      featured: node.tags?.includes('featured') || false,
    };
  });
}

// --- NEW: SHOPIFY CART ---
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
    }`;

  const lines = items.map(item => ({
    merchandiseId: item.variantGid,
    quantity: item.qty
  }));

  const variables = { input: { lines } };
  const data = await shopifyFetch(query, variables);
  
  if (data?.data?.cartCreate?.userErrors?.length) {
    console.error('Cart errors:', data.data.cartCreate.userErrors);
  }
  
  return data?.data?.cartCreate?.cart;
}
