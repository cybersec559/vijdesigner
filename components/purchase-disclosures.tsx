import Link from "next/link";
import { materialsDisclosure, prop65Warning, returnsDisclosure, shippingDisclosure } from "@/lib/legal";

function WarningSymbol() {
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      aria-hidden="true"
      className="mr-1 inline-block align-[-1px]"
    >
      <path d="M8 0.8 15.2 13.2H0.8Z" fill="#f5c518" stroke="#14110e" strokeWidth="1" />
      <path d="M8 5.2v3.4" stroke="#14110e" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="10.6" r="0.6" fill="#14110e" />
    </svg>
  );
}

export function MaterialsNote() {
  return <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">{materialsDisclosure}</p>;
}

export function PurchaseDisclosures() {
  return (
    <div className="mt-6 max-w-lg space-y-4 text-sm leading-relaxed text-ink/80">
      <p>{shippingDisclosure}</p>
      <p>
        {returnsDisclosure}{" "}
        <Link href="/shipping" className="underline underline-offset-4">
          Shipping & Returns
        </Link>
      </p>
      <aside
        className="border border-line bg-card px-4 py-3 text-ink"
        role="note"
        aria-label="California Proposition 65 warning"
      >
        <p>
          <WarningSymbol />
          <strong>WARNING:</strong> {prop65Warning} For more information go to{" "}
          <a
            href="https://www.p65warnings.ca.gov/"
            className="underline underline-offset-4"
            rel="noopener noreferrer"
          >
            www.P65Warnings.ca.gov
          </a>
          .
        </p>
      </aside>
      <p>
        Card payment happens on Shopify. We do not collect or store your card
        number. By continuing you agree to the{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Sale
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
