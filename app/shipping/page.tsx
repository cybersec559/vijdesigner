import type { Metadata } from "next";
import { ContactLine } from "@/components/contact-line";
import { LegalDocument } from "@/components/legal-document";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: `Shipping time, delivery, and returns for ${site.name}.`,
};

export default function ShippingPage() {
  return (
    <LegalDocument kicker="Policies" title="Shipping & Returns">
      <section>
        <h2>Shipping cost</h2>
        <p className="mt-4">
          {site.shippingNote}. The price printed on a piece does not include
          shipping. Checkout lists the shipping choices and the price of each
          one before you pay. If a rate looks wrong, do not pay; email us and
          we will correct the order or leave it unplaced.
        </p>
      </section>
      <section>
        <h2>When we ship</h2>
        <p className="mt-4">
          If checkout does not show an earlier date, we ship within 30 days
          after Shopify accepts payment. If we cannot ship in that time, we
          email you before the 30 days end and offer a full refund of what you
          paid, including shipping. You may cancel for a full refund any time
          before the carrier picks up the package.
        </p>
      </section>
      <section>
        <h2>Delivery</h2>
        <p className="mt-4">
          The piece is yours when the carrier marks it delivered to the address
          you gave at checkout. Check that address before you pay. If you give
          an address the carrier cannot use, we will work with you on a reship
          and may ask you to pay the second label.
        </p>
      </section>
      <section>
        <h2>Lost or damaged in transit</h2>
        <p className="mt-4">
          If the carrier loses the package, or it arrives broken, email us
          within 7 days of the delivery date the carrier shows, with a photo if
          the piece is damaged. We will replace the piece or refund the item
          and the shipping you paid, your choice. This is our responsibility,
          not a return.
        </p>
      </section>
      <section>
        <h2>Returns</h2>
        <p className="mt-4">
          You may return an unworn piece within 14 days after the carrier marks
          it delivered. Tell us before you send it, and wait for the address to
          send it to. The piece needs to come back in the condition we sent,
          with nothing missing that affects resale.
        </p>
        <p className="mt-4">
          You pay the return label, unless we sent the wrong piece or it arrived
          damaged. When the return is our fault, we pay the label or refund the
          reasonable postage you paid, and we also refund the original shipping.
        </p>
        <p className="mt-4">
          After we receive and check the return, we refund the item price to the
          original payment method. Shopify may take a few days to show the
          refund. Original shipping is refunded only when the return is our
          fault.
        </p>
      </section>
      <section>
        <h2>Pierced earrings</h2>
        <p className="mt-4">
          Earrings made to pass through a piercing are final sale, for hygiene.
          That exception does not apply if they arrive damaged or we sent the
          wrong pair. Those we replace or refund.
        </p>
      </section>
      <section>
        <h2>Sales tax</h2>
        <p className="mt-4">
          Shopify adds sales tax on the checkout page when the law requires it.
          The tax line is part of the amount you approve before you pay.
        </p>
      </section>
      <section>
        <h2>How to start</h2>
        <div className="mt-4">
          <ContactLine purpose="Include your order number." />
        </div>
      </section>
    </LegalDocument>
  );
}
