"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ScrollCampaign } from "@/components/scroll-campaign";
import type { Piece } from "@/lib/types";
import { site } from "@/site.config";

const words = ["Blossom", "Gold", "Enamel", "Daisy"];

function frameClass(id: string): string {
  if (id === "blossom-charms" || id === "blossom-pendant") {
    return "object-cover object-[center_42%]";
  }
  return "object-cover";
}

function indexLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function columnSpan(index: number, total: number): string {
  if (total === 1) {
    return "md:col-span-12";
  }
  if (index === 0) {
    return "md:col-span-7";
  }
  if (index === 1) {
    return "md:col-span-5";
  }
  return "md:col-span-4";
}

export function HomePage({ pieces }: { pieces: Piece[] }) {
  const reduce = useReducedMotion();
  const earrings = pieces.find((piece) => piece.id === "blossom-charms");
  const pendant = pieces.find((piece) => piece.id === "blossom-pendant");
  const campaign = [earrings, pendant].filter(
    (piece): piece is Piece => piece !== undefined,
  );
  const hero = pieces[0];
  const story = hero?.story.split("\n\n") ?? [];

  return (
    <main>
      <ScrollCampaign pieces={pieces} />

      {campaign.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          {campaign.map((piece) => (
            <div key={piece.id}>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">
                {piece.category}
              </p>
              <p className="mt-4 font-display text-4xl font-light italic leading-tight text-ink">
                {piece.adHeadline}
              </p>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
                {piece.story.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : hero && story.length > 0 ? (
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

      <div className="overflow-hidden border-y border-line py-5">
        <div className="marquee-track flex w-max gap-12 pr-12">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="flex gap-12 font-display text-3xl font-light italic tracking-tight text-ink/70"
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

      <section id="collection" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold">
              On the bench
            </p>
            <h2 className="mt-3 font-display text-5xl font-light tracking-tight">
              Collection
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Each piece keeps the mark of the hand that made it.
          </p>
        </div>
        {pieces.length === 0 ? (
          <p className="text-muted">
            The bench is clear. Publish a piece from the studio.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-12">
            {pieces.map((piece, index) => (
              <motion.article
                key={piece.id}
                className={columnSpan(index, pieces.length)}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.06 }}
              >
                <Link href={`/pieces/${piece.id}`} className="group block">
                  <div
                    className={`relative overflow-hidden rounded-[1.75rem] bg-card ${
                      index === 0 ? "aspect-[4/5]" : "aspect-[3/4]"
                    }`}
                  >
                    <motion.div
                      className="absolute inset-0"
                      whileHover={reduce ? undefined : { scale: 1.05 }}
                      transition={{ duration: 0.7 }}
                    >
                      <Image
                        src={piece.image}
                        alt={piece.altText}
                        fill
                        unoptimized
                        sizes={
                          index === 0
                            ? "(min-width: 768px) 58vw, 100vw"
                            : "(min-width: 768px) 32vw, 100vw"
                        }
                        className={frameClass(piece.id)}
                      />
                    </motion.div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-5 text-card">
                      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-card/80">
                        {indexLabel(index)} · {piece.category}
                      </p>
                      <h3 className="mt-1 font-display text-3xl font-light tracking-tight">
                        {piece.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
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
                      className={frameClass(piece.id)}
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

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted md:px-8">
          <p className="font-display text-xl text-ink">{site.name}</p>
          <p>{new Date().getFullYear()}</p>
          <Link href="/studio" className="uppercase tracking-[0.18em] hover:text-ink">
            Studio
          </Link>
        </div>
      </footer>
    </main>
  );
}
