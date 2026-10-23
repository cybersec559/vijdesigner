import { moneyAmount } from "@/lib/price";
import { shopifyAdminConfigured, shopifyAdminFetch } from "@/lib/shopify-admin";
import type { Piece } from "@/lib/types";

const SYNC_PRODUCT = `
  mutation SyncProduct($identifier: ProductSetIdentifiers, $input: ProductSetInput!, $synchronous: Boolean!) {
    productSet(identifier: $identifier, synchronous: $synchronous, input: $input) {
      product {
        id
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PUBLICATION_IDS = `
  query PublicationIds {
    publications(first: 20) {
      nodes {
        id
      }
    }
  }
`;

const PUBLISH_PRODUCT = `
  mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

type UserError = {
  field?: string[] | null;
  message: string;
};

type SellableVariant = {
  name: string;
  price: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sellableVariants(piece: Piece): {
  optionName: string;
  variants: SellableVariant[];
} | null {
  if (piece.priceOptions?.length) {
    const variants: SellableVariant[] = [];
    for (const option of piece.priceOptions) {
      const price = moneyAmount(option.price);
      if (!price) {
        return null;
      }
      variants.push({ name: option.label, price });
    }
    return { optionName: "Set", variants };
  }

  if (!piece.price) {
    return null;
  }

  const price = moneyAmount(piece.price);
  if (!price) {
    return null;
  }

  return {
    optionName: "Title",
    variants: [{ name: "Default Title", price }],
  };
}

function errorText(errors: UserError[]): string {
  return errors.map((error) => error.message).join("\n");
}

/**
 * Create or update the Shopify product for a priced piece and publish it
 * to the storefront channel. Pieces without a price are left alone.
 */
export async function syncPricedPiece(piece: Piece): Promise<void> {
  const sellable = sellableVariants(piece);
  if (!sellable) {
    return;
  }

  if (!shopifyAdminConfigured()) {
    throw new Error(
      "Shopify Admin is not configured. Add SHOPIFY_ADMIN_ACCESS_TOKEN so this price can be sold.",
    );
  }

  const descriptionHtml = piece.story
    .split("\n\n")
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const synced = await shopifyAdminFetch<{
    productSet: {
      product: { id: string; handle: string } | null;
      userErrors: UserError[];
    };
  }>(SYNC_PRODUCT, {
    synchronous: true,
    identifier: { handle: piece.id },
    input: {
      title: piece.name,
      handle: piece.id,
      status: "ACTIVE",
      descriptionHtml,
      productOptions: [
        {
          name: sellable.optionName,
          values: sellable.variants.map((variant) => ({ name: variant.name })),
        },
      ],
      variants: sellable.variants.map((variant) => ({
        optionValues: [
          { optionName: sellable.optionName, name: variant.name },
        ],
        price: variant.price,
      })),
    },
  });

  if (synced.productSet.userErrors.length) {
    throw new Error(errorText(synced.productSet.userErrors));
  }

  const productId = synced.productSet.product?.id;
  if (!productId) {
    throw new Error("Shopify did not return the product.");
  }

  const publications = await shopifyAdminFetch<{
    publications: { nodes: { id: string }[] };
  }>(PUBLICATION_IDS);

  const input = publications.publications.nodes.map((publication) => ({
    publicationId: publication.id,
  }));
  if (!input.length) {
    throw new Error(
      "Shopify saved the product, but no sales channel is available to publish it.",
    );
  }

  const published = await shopifyAdminFetch<{
    publishablePublish: { userErrors: UserError[] };
  }>(PUBLISH_PRODUCT, { id: productId, input });

  if (published.publishablePublish.userErrors.length) {
    throw new Error(errorText(published.publishablePublish.userErrors));
  }
}
