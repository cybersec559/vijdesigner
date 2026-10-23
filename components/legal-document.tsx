import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { policyUpdated } from "@/lib/legal";

export function LegalDocument({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">{kicker}</p>
        <h1 className="mt-4 font-display text-5xl font-light italic tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated {policyUpdated}</p>
        <article className="mt-10 space-y-10 text-base leading-relaxed text-ink/85 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-ink [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-light [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
