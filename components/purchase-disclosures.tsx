import Link from "next/link";
import { materialsDisclosure, returnsDisclosure, shippingDisclosure } from "@/lib/legal";

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
