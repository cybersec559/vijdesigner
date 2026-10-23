import { publicContactEmail } from "@/lib/contact";

export function ContactLine({ purpose }: { purpose: string }) {
  const email = publicContactEmail();

  if (!email) {
    return (
      <p>
        {purpose} Reply to your Shopify order confirmation, or use the contact
        Shopify shows before you pay. That message reaches {`VJMDESIGN`}.
      </p>
    );
  }

  return (
    <p>
      {purpose}{" "}
      <a href={`mailto:${email}`}>{email}</a>.
    </p>
  );
}
