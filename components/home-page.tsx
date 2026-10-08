"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ScrollCampaign } from "@/components/scroll-campaign";
import { categoryLabel, sortedCategories, type Piece } from "@/lib/types";
import { site } from "@/site.config";

const words = ["Swap Hoops", "Enamel Flowers", "Pumpkin Beads", "Tibetan Beads"];

function indexLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function HomePage({ pieces }: { pieces: Piece[] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const categories = sortedCategories(pieces);
  const shown =
    filter === "All" ? pieces : pieces.filter((piece) => piece.category === filter);
  const hero = pieces[0];
  const story = hero?.story.split("\n\n") ?? [];

  return (
    <main>
      <ScrollCampaign pieces={pieces} />

      {hero && story.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-28">
          <p className="font-display text-4xl font-light italic leading-tight text-ink md:text-5xl">
            {hero.adHeadline}
          </p>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {story.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      <div className="overflow-hidden bg-plum py-5">
        <div className="marquee-track flex w-max gap-12 pr-12">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="flex gap-12 font-display text-3xl italic tracking-tight text-gold-light"
              aria-hidden={copy === 1}
            >
              {Array.from({ length: 4 }, () => words)
                .flat()
                .map((word, index) => (
                  <span key={`${copy}-${word}-${index}`}>{word}</span>
                ))}
            </p>
          ))}
        </div>
      </div>

      <section id="collection" className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-script text-4xl text-plum md:text-5xl">{site.name}</p>
            <h2 className="mt-4 font-display text-5xl tracking-tight text-ink md:text-6xl">
              Earring Catalog
            </h2>
            <p className="mt-4 text-[0.72rem] uppercase tracking-[0.32em] text-gold">
              Online prices
            </p>
            <div className="mx-auto mt-5 h-px w-20 bg-gold-light" />
            <p className="mt-5 text-base leading-relaxed text-muted">
              Handcrafted earrings · changeable hoops · enamel flowers · Tibetan beads.
              <br className="hidden sm:block" /> Every piece made by hand, one at a time.
            </p>
            <p className="mt-4 text-sm font-medium text-gold">{site.shipping}</p>
          </div>

          {categories.length > 1 ? (
            <div
              role="tablist"
              aria-label="Filter the catalog"
              className="-mx-5 mt-12 mb-10 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:justify-center md:px-0"
            >
              {["All", ...categories].map((category) => {
                const active = filter === category;
                const count =
                  category === "All"
                    ? pieces.length
                    : pieces.filter((piece) => piece.category === category).length;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(category)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[0.72rem] uppercase tracking-[0.2em] transition-colors ${
                      active
                        ? "border-plum bg-plum text-card"
                        : "border-line bg-card text-muted hover:border-plum hover:text-plum"
                    }`}
                  >
                    {category === "All" ? "All" : categoryLabel(category)}
                    <span className="ml-2 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-12" />
          )}

          {pieces.length === 0 ? (
            <p className="text-center text-muted">
              The bench is clear. Publish a piece from the studio.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((piece, index) => (
                <motion.article
                  key={piece.id}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.06 }}
                >
                  <Link
                    href={`/pieces/${piece.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_1px_0_rgba(54,28,61,0.04)] transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(54,28,61,0.45)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-line/40">
                      <motion.div
                        className="absolute inset-0"
                        whileHover={reduce ? undefined : { scale: 1.04 }}
                        transition={{ duration: 0.7 }}
                      >
                        <Image
                          src={piece.image}
                          alt={piece.altText}
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                          className="object-cover"
                        />
                      </motion.div>
                      {piece.badge ? (
                        <span className="absolute top-4 left-4 rounded-full bg-plum px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-gold-light">
                          {piece.badge}
                        </span>
                      ) : null}
                      {piece.variants?.length ? (
                        <span className="absolute right-4 bottom-4 flex -space-x-1.5 rounded-full bg-card/90 px-2 py-1.5 backdrop-blur">
                          {piece.variants.slice(0, 6).map((option) => (
                            <span
                              key={option.name}
                              aria-hidden
                              className="size-4 rounded-full border-2 border-card"
                              style={{ backgroundColor: option.swatch }}
                            />
                          ))}
                          {piece.variants.length > 6 ? (
                            <span className="pl-2.5 text-[0.65rem] leading-4 text-muted">
                              +{piece.variants.length - 6}
                            </span>
                          ) : null}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col px-6 pt-5 pb-6">
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-gold">
                        {piece.category}
                      </p>
                      <h3 className="mt-1.5 font-display text-[1.75rem] leading-tight text-ink">
                        {piece.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{piece.adBody}</p>
                      {piece.priceOptions?.length || piece.price ? (
                        <div className="mt-auto pt-5">
                          <div className="space-y-1.5 border-t border-line pt-4">
                            {piece.price ? (
                              <div className="flex items-baseline gap-3">
                                <span className="text-sm text-ink/80">Price</span>
                                <span className="dot-leader" />
                                <span className="font-display text-xl text-ink">{piece.price}</span>
                              </div>
                            ) : null}
                            {piece.priceOptions?.slice(0, 5).map((option) => (
                              <div key={option.label} className="flex items-baseline gap-3">
                                <span className="text-sm text-ink/80">{option.label}</span>
                                <span className="dot-leader" />
                                <span className="font-display text-xl text-ink">{option.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          <figure className="relative mt-16 overflow-hidden rounded-2xl">
            <Image
              src="/uploads/real/full-collection.jpg"
              alt="The full collection laid out on grey felt: enamel flower charms, acrylic blossoms, donut beads, and gold hooks."
              width={1462}
              height={760}
              unoptimized
              className="h-auto w-full"
            />
            <figcaption className="absolute top-4 left-4 rounded-full bg-plum px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-gold-light sm:text-[0.7rem]">
              The full collection · Mix & match any colors
            </figcaption>
          </figure>
          <p className="mt-6 rounded-2xl bg-plum px-6 py-5 text-center text-sm text-gold-light sm:text-base">
            {site.shipping} · {site.shippingDetail}
          </p>
        </div>
      </section>

      <section id="window" className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">
            In the window
          </p>
          <h2 className="mt-3 max-w-lg font-display text-5xl font-light leading-tight tracking-tight">
            Lines written from the piece itself.
          </h2>
          <div className="mt-14 space-y-16">
            {pieces.map((piece, index) => {
              const imageFirst = index % 2 === 0;
              return (
                <motion.article
                  key={piece.id}
                  className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                >
                  <Link
                    href={`/pieces/${piece.id}`}
                    aria-label={piece.name}
                    className={`relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-card ${
                      imageFirst ? "" : "md:order-2"
                    }`}
                  >
                    <Image
                      src={piece.image}
                      alt={piece.altText}
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </Link>
                  <div className={imageFirst ? "" : "md:order-1"}>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-gold">
                      {indexLabel(index)} · {piece.category}
                    </p>
                    <h3 className="mt-4 font-display text-4xl font-light italic leading-tight sm:text-5xl">
                      {piece.adHeadline}
                    </h3>
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                      {piece.adBody}
                    </p>
                    <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">
                      {piece.socialCaption}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-plum text-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 py-12 text-center md:px-8">
          <p className="font-script text-5xl">{site.name}</p>
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold-light">
            Handcrafted earrings
          </p>
          <p className="text-sm text-card/70">{site.shipping} · {site.shippingDetail}</p>
          <div className="mt-4 flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-card/60">
            <span>{new Date().getFullYear()}</span>
            <Link href="/studio" className="hover:text-card">
              Studio
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
