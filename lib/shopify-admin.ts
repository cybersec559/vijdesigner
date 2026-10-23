const adminApiVersion = "2026-10";

type ShopifyResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export function shopifyAdminConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN?.trim() &&
      process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim(),
  );
}

export async function shopifyAdminFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  if (!domain || !token) {
    throw new Error("Shopify Admin is not configured");
  }

  const response = await fetch(
    `https://${domain}/admin/api/${adminApiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Shopify Admin request failed (${response.status})`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("\n"));
  }

  if (!json.data) {
    throw new Error("Shopify Admin returned no data");
  }

  return json.data;
}
