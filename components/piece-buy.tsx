"use client";

import { useMemo, useState } from "react";
import { BuyButton } from "@/components/buy-button";
import { findVariantForOption } from "@/lib/shopify-products";
import type { Product } from "@/lib/shopify-types";
import type { Piece } from "@/lib/types";

export function PieceBuy({
  piece,
  product,
}: {
  piece: Piece;
  product: Product;
}) {
  const options = piece.priceOptions ?? [];
  const [selectedLabel, setSelectedLabel] = useState(options[0]?.label);

  const variant = useMemo(
    () => findVariantForOption(product, selectedLabel),
    [product, selectedLabel],
  );

  if (!variant) {
    return null;
  }

  return (
    <div className="mt-6">
      {options.length > 1 ? (
        <fieldset>
          <legend className="text-[0.72rem] uppercase tracking-[0.22em] text-muted">
            Choose a set
          </legend>
          <div className="mt-3 space-y-2">
            {options.map((option) => {
              const active = option.label === selectedLabel;
              return (
                <label
                  key={option.label}
                  className={`flex cursor-pointer items-baseline justify-between gap-6 border px-4 py-3 transition-colors ${
                    active
                      ? "border-ink text-ink"
                      : "border-line text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-3 text-base">
                    <input
                      type="radio"
                      name={`buy-${piece.id}`}
                      checked={active}
                      onChange={() => setSelectedLabel(option.label)}
                      className="accent-ink"
                    />
                    {option.label}
                  </span>
                  <span className="font-display text-2xl font-light text-ink">
                    {option.price}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}
      <BuyButton
        variantId={variant.id}
        availableForSale={variant.availableForSale && product.availableForSale}
        label="Add to cart"
      />
    </div>
  );
}
