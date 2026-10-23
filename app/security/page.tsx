import type { Metadata } from "next";
import Link from "next/link";
import { ContactLine } from "@/components/contact-line";
import { LegalDocument } from "@/components/legal-document";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Security",
  description: `How ${site.name} handles payment and site security.`,
};

export default function SecurityPage() {
  return (
    <LegalDocument kicker="Policies" title="Security">
      <section>
        <h2>Payments</h2>
        <p className="mt-4">
          Card numbers are entered on Shopify checkout, not on this website. We
          do not store card numbers, security codes, or bank logins. A checkout
          link is used only when it points at Shopify. Do not email a card
          number to us. We will never ask for one.
        </p>
      </section>
      <section>
        <h2>The connection</h2>
        <p className="mt-4">
          The live site is served over HTTPS. Browsers are told to stay on
          HTTPS, to refuse to embed these pages inside another site, to avoid
          guessing a file type, and to send other sites only our domain rather
          than the full page address. The studio sign-in and the bag cookie are
          httpOnly, so page scripts cannot read them, and they are marked Secure
          on the live site.
        </p>
      </section>
      <section>
        <h2>The studio</h2>
        <p className="mt-4">
          Publishing a piece requires the studio password. The password is
          checked with a timing-safe comparison and is not written into the
          page. Photographs shoppers see are the ones the maker published.
        </p>
      </section>
      <section>
        <h2>Report a problem</h2>
        <div className="mt-4">
          <ContactLine purpose="If you find a security weakness, email us and give us a reasonable time to fix it before you describe it in public." />
        </div>
        <p className="mt-4">
          A machine-readable contact file is at{" "}
          <Link href="/.well-known/security.txt">/.well-known/security.txt</Link>.
          Please do not test the weakness against other shoppers’ orders, and do
          not ask us for data that is not yours.
        </p>
      </section>
    </LegalDocument>
  );
}
