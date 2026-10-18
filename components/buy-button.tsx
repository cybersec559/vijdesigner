"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToCart } from "@/lib/cart-actions";
import { site } from "@/site.config";

export function BuyButton({
  variantId,
  availableForSale,
  label = "Add to cart",
}: {
  variantId: string;
  availableForSale: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAddToCart() {
    setError(null);
    startTransition(async () => {
      try {
        await addToCart(variantId);
        router.push("/cart");
        router.refresh();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not add to cart");
      }
    });
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!availableForSale || isPending}
        className="inline-flex min-w-[10rem] items-center justify-center border border-ink bg-ink px-8 py-3 text-[0.72rem] uppercase tracking-[0.22em] text-background transition-colors hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted"
      >
        {!availableForSale ? "Sold out" : isPending ? "Adding…" : label}
      </button>
      <p className="text-[0.72rem] uppercase tracking-[0.2em] text-muted">
        {site.shippingNote}
      </p>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
    </div>
  );
}
