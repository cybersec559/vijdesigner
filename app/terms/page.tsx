import type { Metadata } from "next";
import Link from "next/link";
import { ContactLine } from "@/components/contact-line";
import { LegalDocument } from "@/components/legal-document";
import { materialsDisclosure, returnsDisclosure, shippingDisclosure } from "@/lib/legal";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description: `The terms that apply when you buy from ${site.name}.`,
};

export default function TermsPage() {
  return (
    <LegalDocument kicker="Policies" title="Terms of Sale">
      <section>
        <h2>The seller</h2>
        <p className="mt-4">
          These terms are the contract between you and {site.name} for pieces
          you buy on this site. You agree to them when you pay at checkout.
          Please read them, the <Link href="/shipping">Shipping & Returns</Link>{" "}
          policy, and the <Link href="/privacy">Privacy Policy</Link> before you
          pay. The checkout page shows the same rules again.
        </p>
      </section>
      <section>
        <h2>Who can buy</h2>
        <p className="mt-4">
          You must be old enough to make a contract where you live. If you are
          under 18, an adult has to buy the piece. We sell to addresses Shopify
          checkout can ship to.
        </p>
      </section>
      <section>
        <h2>Price, shipping, and tax</h2>
        <p className="mt-4">{shippingDisclosure}</p>
        <p className="mt-4">
          Prices are in US dollars. If we show a price by mistake, we may cancel
          the order and refund what you paid. We will not ask you to pay the
          corrected price unless you agree.
        </p>
      </section>
      <section>
        <h2>What the piece is</h2>
        <p className="mt-4">{materialsDisclosure}</p>
        <p className="mt-4">
          Pieces are made by hand. Small differences in spacing, enamel, or
          finish from the photograph are part of that work, and they are not
          defects. A piece that is broken, incomplete, or not the item you
          ordered is a defect.
        </p>
        <p className="mt-4">
          “Non-tarnish” means the steel is made not to tarnish the way untreated
          brass does. Coatings can still scratch or wear at the edges with use.
        </p>
      </section>
      <section>
        <h2>The order</h2>
        <p className="mt-4">
          A piece is offered while it appears as available. Adding it to the bag
          does not reserve it until Shopify accepts payment. We may cancel an
          order we cannot fill, including when a piece sells out or a payment
          does not clear, and we will refund what you paid.
        </p>
        <p className="mt-4">
          You pay on Shopify. We never ask you to send a card number on this
          site or by email.
        </p>
      </section>
      <section>
        <h2>When it ships</h2>
        <p className="mt-4">
          If checkout does not show an earlier ship date, we ship within 30 days
          of payment. If we cannot, we will email you before that time is up and
          offer a full refund. You can cancel for a full refund any time before
          the piece ships.
        </p>
      </section>
      <section>
        <h2>Returns</h2>
        <p className="mt-4">
          {returnsDisclosure} The steps, the refund, and lost or damaged
          packages are in <Link href="/shipping">Shipping & Returns</Link>.
        </p>
      </section>
      <section>
        <h2>Responsibility</h2>
        <p className="mt-4">
          We are responsible for the piece matching the description we published
          and for the shipping and return promises on this site. Some states do
          not allow a seller to waive liability for injury caused by a product,
          and those rules still apply. For other claims, our responsibility is
          limited to the amount you paid for the piece. We are not responsible
          for indirect losses, such as a missed event.
        </p>
      </section>
      <section>
        <h2>Disputes</h2>
        <p className="mt-4">
          Consumer rules where you live still apply when they cannot be waived.
          Either of us may use small claims court. These terms follow the laws
          of the United States.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <div className="mt-4">
          <ContactLine purpose="Questions about an order start here." />
        </div>
      </section>
    </LegalDocument>
  );
}
