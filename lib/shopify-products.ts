import { shopifyConfigured, shopifyFetch } from "./shopify";
import { PRODUCT_BY_HANDLE_QUERY } from "./shopify-queries";
import type { Product, ProductVariant } from "./shopify-types";

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  if (!shopifyConfigured()) {
    return null;
  }

  try {
    const data = await shopifyFetch<{ product: Product | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
    );
    return data.product;
  } catch {
    return null;
  }
}

export function findVariantForOption(
  product: Product,
  optionLabel?: string,
): ProductVariant | undefined {
  const variants = product.variants.nodes;
  if (!variants.length) {
    return undefined;
  }

  if (!optionLabel) {
    return variants.find((variant) => variant.availableForSale) ?? variants[0];
  }

  const normalized = optionLabel.trim().toLowerCase();
  return (
    variants.find((variant) => {
      if (variant.title.trim().toLowerCase() === normalized) {
        return true;
      }
      return variant.selectedOptions.some(
        (option) => option.value.trim().toLowerCase() === normalized,
      );
    }) ?? variants[0]
  );
}
