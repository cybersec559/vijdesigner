import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Cookie Notice",
  description: `Cookies used by ${site.name}.`,
};

export default function CookiesPage() {
  return (
    <LegalDocument kicker="Policies" title="Cookie Notice">
      <section>
        <h2>What we set</h2>
        <p className="mt-4">
          This site sets only cookies that the shop needs in order to work. We
          do not use advertising cookies, analytics cookies, or social-media
          pixels. A consent banner is not used, because there is nothing
          optional to turn off.
        </p>
        <ul className="mt-4">
          <li>
            cartId. Set when a bag is created. Stores the Shopify cart id for
            14 days so your bag is still here when you come back. HttpOnly,
            SameSite=Lax, and Secure on the live site. Path /.
          </li>
          <li>
            atelier_studio. Set only after the maker signs in at /studio. It
            keeps that sign-in for 14 days. Shoppers do not receive it.
            HttpOnly, SameSite=Lax, and Secure on the live site.
          </li>
        </ul>
      </section>
      <section>
        <h2>Shopify</h2>
        <p className="mt-4">
          Checkout opens on Shopify. Shopify sets its own cookies on its
          domain to run payment, fraud checks, and the order. Those cookies are
          described in Shopify’s privacy policy. We do not read them.
        </p>
      </section>
      <section>
        <h2>Your browser</h2>
        <p className="mt-4">
          You can delete cookies in the browser. If you delete cartId, the bag
          on this site starts empty. Blocking all cookies will stop the bag
          from being remembered.
        </p>
        <p className="mt-4">
          How the rest of your information is handled is in the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>
    </LegalDocument>
  );
}
