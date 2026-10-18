const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

type ShopifyResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export function shopifyConfigured(): boolean {
  return Boolean(domain && storefrontAccessToken);
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!domain || !storefrontAccessToken) {
    throw new Error("Shopify Storefront is not configured");
  }

  const response = await fetch(`https://${domain}/api/2025-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront request failed (${response.status})`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("\n"));
  }

  if (!json.data) {
    throw new Error("Shopify Storefront returned no data");
  }

  return json.data;
}
