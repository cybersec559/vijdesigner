import Link from "next/link";
import { Logo } from "@/components/logo";
import { publicContactEmail } from "@/lib/contact";
import { policyLinks } from "@/lib/legal";
import { site } from "@/site.config";

export function SiteFooter() {
  const email = publicContactEmail();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <Link href="/">
            <Logo className="h-16 w-auto" />
          </Link>
          <p>
            {site.tagline} {year}
          </p>
          <Link href="/studio" className="uppercase tracking-[0.18em] hover:text-ink">
            Studio
          </Link>
        </div>
        <nav aria-label="Policies" className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {policyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.72rem] uppercase tracking-[0.14em] text-muted hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-sm text-muted">
          {email ? (
            <a className="hover:text-ink" href={`mailto:${email}`}>
              {email}
            </a>
          ) : (
            "We do not sell personal information."
          )}
        </p>
      </div>
    </footer>
  );
}
