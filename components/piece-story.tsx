"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Piece } from "@/lib/types";

function frameClass(id: string): string {
  if (id === "blossom-charms" || id === "blossom-pendant") {
    return "object-cover object-[center_42%]";
  }
  return "object-cover";
}

export function PieceStory({ piece }: { piece: Piece }) {
  const reduce = useReducedMotion();

  return (
    <main className="lg:grid lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
      <motion.div
        className="relative aspect-[3/4] bg-card lg:sticky lg:top-0 lg:aspect-auto lg:h-[100svh]"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={piece.image}
          alt={piece.altText}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 52vw, 100vw"
          className={`photo-drift ${frameClass(piece.id)}`}
        />
      </motion.div>
      <motion.div
        className="px-5 py-12 md:px-12 md:py-20 lg:py-28"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12 }}
      >
        <Link
          href="/#collection"
          className="text-[0.72rem] uppercase tracking-[0.22em] text-muted hover:text-ink"
        >
          Back to the collection
        </Link>
        <p className="mt-10 text-[0.72rem] uppercase tracking-[0.28em] text-gold">
          {piece.category}
        </p>
        <h1 className="mt-4 font-display text-6xl font-light italic leading-[0.95] tracking-tight sm:text-7xl">
          {piece.name}
        </h1>
        <p className="mt-5 text-sm uppercase tracking-[0.16em] text-muted">
          {piece.materials}
        </p>
        <div className="mt-10 max-w-lg space-y-5 text-lg leading-relaxed">
          {piece.story.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <blockquote className="mt-12 max-w-lg border-l border-gold pl-6">
          <p className="font-display text-4xl font-light italic leading-tight">
            {piece.adHeadline}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">{piece.adBody}</p>
        </blockquote>
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-ink/70">
          {piece.socialCaption}
        </p>
      </motion.div>
    </main>
  );
}
