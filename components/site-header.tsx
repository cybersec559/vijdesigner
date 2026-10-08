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
      } ${solid ? "bg-plum/95 shadow-sm backdrop-blur-md" : "bg-gradient-to-b from-plum/70 to-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-script text-3xl leading-none text-card md:text-4xl">
          {site.name}
        </Link>
        <nav className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.24em] text-gold-light sm:gap-6">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-card"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
