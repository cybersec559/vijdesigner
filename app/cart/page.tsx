import type { Metadata } from "next";
import Link from "next/link";
import { CartLineItem } from "@/components/cart-line-item";
import { SiteHeader } from "@/components/site-header";
import { getCart } from "@/lib/cart-actions";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
};

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

export default async function CartPage() {
  const cart = await getCart();
  const lines = cart?.lines.nodes ?? [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">
          Cart
        </p>
        <h1 className="mt-4 font-display text-5xl font-light italic tracking-tight sm:text-6xl">
          Your bag
        </h1>

        {!cart || lines.length === 0 ? (
          <div className="mt-12 space-y-6">
            <p className="text-lg text-muted">Nothing here yet.</p>
            <Link
              href="/#collection"
              className="inline-flex border border-ink px-6 py-3 text-[0.72rem] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-background"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-12">
            <ul>
              {lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
              <p className="text-sm uppercase tracking-[0.16em] text-muted">
                Subtotal{" "}
                <span className="ml-3 font-display text-3xl font-light normal-case tracking-normal text-ink">
                  {formatMoney(
                    cart.cost.subtotalAmount.amount,
                    cart.cost.subtotalAmount.currencyCode,
                  )}
                </span>
              </p>
              {(() => {
                try {
                  const host = new URL(cart.checkoutUrl).hostname;
                  return (
                    host.endsWith(".myshopify.com") ||
                    host === "checkout.shopify.com" ||
                    host === "shopify.com" ||
                    host.endsWith(".shopify.com")
                  );
                } catch {
                  return false;
                }
              })() ? (
                <a
                  href={cart.checkoutUrl}
                  rel="noopener noreferrer"
                  className="inline-flex border border-ink bg-ink px-8 py-3 text-[0.72rem] uppercase tracking-[0.22em] text-background transition-colors hover:bg-transparent hover:text-ink"
                >
                  Checkout
                </a>
              ) : (
                <p className="text-sm text-muted">Checkout is unavailable.</p>
              )}
            </div>
            <p className="mt-6 text-sm text-muted">
              {site.shippingNote}. Calculated at Shopify checkout — not included
              in the piece price.
            </p>
            <Link
              href="/#collection"
              className="mt-8 inline-block text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
