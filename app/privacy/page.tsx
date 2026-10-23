import type { Metadata } from "next";
import Link from "next/link";
import { ContactLine } from "@/components/contact-line";
import { LegalDocument } from "@/components/legal-document";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and shares personal information.`,
};

export default function PrivacyPage() {
  return (
    <LegalDocument kicker="Policies" title="Privacy Policy">
      <section>
        <h2>This notice</h2>
        <p className="mt-4">
          This policy covers the {site.name} website. It is the notice we give
          before you shop. Checkout and payment run on Shopify, and Shopify has
          its own privacy policy for the information you type there.
        </p>
      </section>
      <section>
        <h2>Information we collect</h2>
        <ul className="mt-4">
          <li>
            A bag cookie named cartId. It holds a Shopify cart id so the bag
            stays with your browser for 14 days. It is httpOnly, SameSite, and
            marked Secure on the live site.
          </li>
          <li>
            Order details Shopify sends us so we can pack and ship: name, email,
            shipping address, what you bought, and the amount. We do not receive
            your card number, card security code, or full payment account number.
          </li>
          <li>
            Messages you send us about an order, a return, a privacy request, or
            a security report.
          </li>
          <li>
            Technical logs our host, Vercel, keeps for a short time, such as IP
            address, browser type, and the page requested. We use those logs to
            keep the site up and to investigate abuse.
          </li>
          <li>
            The studio password cookie, atelier_studio, is only for the maker
            who signs in at /studio. Shoppers do not get that cookie.
          </li>
        </ul>
        <p className="mt-4">
          We do not run advertising pixels, analytics products, or an email
          list. We do not ask for a government id, precise location, health
          information, or biometrics.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p className="mt-4">
          We use this information to take and ship orders, calculate shipping
          and tax at checkout, handle returns and complaints, detect fraud, keep
          the site secure, and meet tax and accounting duties. Photographs the
          maker uploads in the studio are used to publish pieces. If the maker
          chooses Generate, that photograph is sent to the model through the
          Vercel AI Gateway to draft copy. Shopper checkout data is not sent to
          that model.
        </p>
      </section>
      <section>
        <h2>Who else handles it</h2>
        <ul className="mt-4">
          <li>Shopify, for the bag, checkout, payment, and order record.</li>
          <li>Vercel, to host the site and keep request logs.</li>
          <li>
            The carrier you pick at checkout, which receives the delivery name
            and address.
          </li>
          <li>
            A payment network, through Shopify, which processes the charge. The
            card data stays with them.
          </li>
        </ul>
        <p className="mt-4">
          We do not sell personal information. We do not share it for
          cross-context behavioral advertising. We do not give it to data
          brokers.
        </p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p className="mt-4">
          The cookies this site sets are there so the bag and the studio sign-in
          work. Details are on the <Link href="/cookies">Cookie Notice</Link>.
        </p>
      </section>
      <section id="do-not-sell">
        <h2>Do Not Sell or Share My Personal Information</h2>
        <p className="mt-4">
          We do not sell personal information, and we do not share it as those
          words are used in the California Consumer Privacy Act. Because we do
          not sell or share, there is no separate opt-out to turn on. If that
          ever changes, we will put a real choice on this page before we do it
          and we will not punish you for saying no.
        </p>
        <p className="mt-4">
          We also do not use or disclose sensitive personal information for
          purposes that need a “Limit the Use of My Sensitive Personal
          Information” control.
        </p>
      </section>
      <section id="your-rights">
        <h2>Your privacy rights</h2>
        <p className="mt-4">
          If you live in California, Colorado, Connecticut, Virginia, Utah,
          Texas, Oregon, or another state with a consumer privacy law, you can
          ask us to:
        </p>
        <ul className="mt-4">
          <li>Tell you what personal information we have about you.</li>
          <li>Correct information that is wrong.</li>
          <li>Delete information, unless we have to keep it for tax, fraud, or a legal claim.</li>
          <li>Get a copy of the information you gave us.</li>
          <li>Appeal a refusal.</li>
        </ul>
        <p className="mt-4">
          We will not discriminate against you for asking. We may need to
          confirm that the request is yours, usually by matching the email on
          the order. An authorized agent may ask for you if they show they have
          permission.
        </p>
        <p className="mt-4">
          This shop is based in the United States and is aimed at shoppers
          there. If you contact us from the UK or the European Economic Area, we
          will honor a request to access or delete the information we hold, and
          we rely on the need to perform your order, to keep the site secure,
          and to meet legal duties.
        </p>
        <div className="mt-4">
          <ContactLine purpose="To use any of these rights, email us." />
        </div>
      </section>
      <section>
        <h2>Children</h2>
        <p className="mt-4">
          This site is not for children under 13. We do not knowingly collect
          their personal information. If you believe a child sent us some, email
          us and we will delete it.
        </p>
      </section>
      <section>
        <h2>Do Not Track</h2>
        <p className="mt-4">
          We do not track you across other companies’ websites, so we do not
          change the site when a browser sends a Do Not Track signal. A browser
          Global Privacy Control signal is also unnecessary for a sale opt-out,
          because we do not sell or share personal information.
        </p>
      </section>
      <section>
        <h2>How long we keep it</h2>
        <p className="mt-4">
          The bag cookie expires after 14 days. Order records are kept as long
          as tax, accounting, and fraud rules require, and then deleted or
          stripped of identifiers. Studio sign-in cookies expire after 14 days
          or when the maker logs out.
        </p>
      </section>
      <section>
        <h2>Security</h2>
        <p className="mt-4">
          How the site is locked down is described on the{" "}
          <Link href="/security">Security</Link> page. No website can promise
          that a breach is impossible. We do not want your card number. Do not
          email one to us.
        </p>
      </section>
      <section>
        <h2>Changes</h2>
        <p className="mt-4">
          If we change this policy, we will update the date at the top. If a
          change is about how we use information we already have, and the law
          requires notice, we will say so on this page before the change applies.
        </p>
      </section>
    </LegalDocument>
  );
}
