import type { Metadata } from "next";
import { ContactLine } from "@/components/contact-line";
import { LegalDocument } from "@/components/legal-document";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Accessibility",
  description: `How to reach ${site.name} if a page is hard to use.`,
};

export default function AccessibilityPage() {
  return (
    <LegalDocument kicker="Policies" title="Accessibility">
      <section>
        <h2>What we aim for</h2>
        <p className="mt-4">
          We want every shopper to be able to read the collection, understand
          the price, and check out. Pages use text that can be resized, visible
          keyboard focus, and alt text on piece photographs. If your system
          asks for less motion, the long pinned scroll on the homepage is
          skipped and the first photograph stays still.
        </p>
        <p className="mt-4">
          We have not hired an auditor, and we do not claim a formal
          conformance certification.
        </p>
      </section>
      <section>
        <h2>If something blocks you</h2>
        <div className="mt-4">
          <ContactLine purpose="Tell us the page and what you were trying to do. We will help you finish the order, including by taking it another way if the site gets in the way." />
        </div>
      </section>
    </LegalDocument>
  );
}
