"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/site.config";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [solid, setSolid] = useState(!overlay);

  useEffect(() => {
    if (!overlay) {
      return;
    }
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const campaign = document.getElementById("campaign");
        if (campaign) {
          setSolid(campaign.getBoundingClientRect().bottom <= 72);
          return;
        }
        setSolid(window.scrollY > 12);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [overlay]);

  return (
    <header
      className={`inset-x-0 top-0 z-30 transition-colors duration-300 ${
        overlay ? "fixed" : "sticky"
      } ${solid ? "border-b border-line/80 bg-background/85 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          {site.name}
        </Link>
        <nav className="flex items-center gap-6 text-[0.72rem] uppercase tracking-[0.22em] text-ink/70">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
