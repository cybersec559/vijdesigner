import type { Cart } from "./shopify-types";

function variantNumericId(merchandiseId: string): string | null {
  const match = merchandiseId.match(/ProductVariant\/(\d+)/);
  return match?.[1] ?? null;
}

/** Prefer Shopify's hosted checkout URL when it is usable; fall back to a cart permalink. */
export function resolveCheckoutUrl(cart: Cart): string | null {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) {
    return null;
  }

  const permalinkParts = cart.lines.nodes
    .map((line) => {
      const id = variantNumericId(line.merchandise.id);
      if (!id) {
        return null;
      }
      return `${id}:${line.quantity}`;
    })
    .filter((part): part is string => Boolean(part));

  if (!permalinkParts.length) {
    return null;
  }

  // Classic cart permalink reliably opens Shopify checkout on this store.
  // Storefront `checkoutUrl` (/cart/c/…) currently 404s on the myshopify domain.
  return `https://${domain}/cart/${permalinkParts.join(",")}`;
}

export function isTrustedCheckoutUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host.endsWith(".myshopify.com") ||
      host === "checkout.shopify.com" ||
      host === "shopify.com" ||
      host.endsWith(".shopify.com")
    );
  } catch {
    return false;
  }
}
