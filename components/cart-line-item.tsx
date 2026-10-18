"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { removeFromCart, updateCartLine } from "@/lib/cart-actions";
import type { CartLine } from "@/lib/shopify-types";

function formatMoney(amount: string, currencyCode: string) {
  const value = Number.parseFloat(amount);
  if (Number.isNaN(value)) {
    return amount;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

export function CartLineItem({ line }: { line: CartLine }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function handleUpdate(quantity: number) {
    startTransition(async () => {
      if (quantity <= 0) {
        await removeFromCart(line.id);
      } else {
        await updateCartLine(line.id, quantity);
      }
      refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFromCart(line.id);
      refresh();
    });
  }

  const title =
    line.merchandise.title !== "Default Title"
      ? `${line.merchandise.product.title} — ${line.merchandise.title}`
      : line.merchandise.product.title;

  return (
    <li
      className={`border-b border-line py-6 ${isPending ? "opacity-50" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-light">{title}</p>
          <p className="mt-2 text-sm text-muted">
            {formatMoney(
              line.merchandise.price.amount,
              line.merchandise.price.currencyCode,
            )}
          </p>
        </div>
        <p className="font-display text-2xl font-light">
          {formatMoney(
            line.cost.totalAmount.amount,
            line.cost.totalAmount.currencyCode,
          )}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center border border-line">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={isPending}
            onClick={() => handleUpdate(line.quantity - 1)}
            className="px-3 py-2 text-sm text-muted hover:text-ink disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm">{line.quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={isPending}
            onClick={() => handleUpdate(line.quantity + 1)}
            className="px-3 py-2 text-sm text-muted hover:text-ink disabled:opacity-40"
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={handleRemove}
          className="text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink disabled:opacity-40"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
