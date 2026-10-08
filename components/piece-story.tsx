"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Piece } from "@/lib/types";
import { site } from "@/site.config";

export function PieceStory({ piece }: { piece: Piece }) {
  const reduce = useReducedMotion();
  const [variantName, setVariantName] = useState(piece.variants?.[0]?.name);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const variant = piece.variants?.find((option) => option.name === variantName);
  const extra = photoIndex === null ? undefined : piece.photos?.[photoIndex];
  const image = extra?.image ?? variant?.image ?? piece.image;
  const altText = extra?.altText ?? variant?.altText ?? piece.altText;
  const thumbs = [
    { label: "Worn", image: variant?.image ?? piece.image, index: null },
    ...(piece.photos ?? []).map((photo, index) => ({ ...photo, index })),
  ];

  return (
    <main className="lg:grid lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
      <motion.div
        className="relative aspect-[3/4] bg-card lg:sticky lg:top-0 lg:aspect-auto lg:h-[100svh]"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          key={image}
          src={image}
          alt={altText}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="photo-drift object-cover"
        />
        {thumbs.length > 1 ? (
          <div className="absolute bottom-4 left-4 z-10 flex gap-2">
            {thumbs.map((thumb) => {
              const active = thumb.index === photoIndex;
              return (
                <button
                  key={thumb.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPhotoIndex(thumb.index)}
                  className={`group relative size-16 overflow-hidden rounded-xl border-2 bg-card shadow-md transition sm:size-20 ${
                    active ? "border-gold-light" : "border-card/70 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image src={thumb.image} alt="" fill unoptimized sizes="80px" className="object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-plum/80 py-0.5 text-[0.55rem] uppercase tracking-[0.14em] text-card">
                    {thumb.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
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
        {piece.badge ? (
          <span className="mt-4 inline-block rounded-full bg-plum px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-gold-light">
            {piece.badge}
          </span>
        ) : null}
        <h1 className="mt-4 font-display text-5xl leading-[1] tracking-tight text-ink sm:text-6xl">
          {piece.name}
        </h1>
        <p className="mt-5 text-sm uppercase tracking-[0.16em] text-muted">
          {piece.materials}
        </p>
        {piece.variants?.length ? (
          <fieldset className="mt-8">
            <legend className="text-[0.72rem] uppercase tracking-[0.22em] text-muted">
              {piece.variantLabel ?? "Color"}: <span className="text-ink">{variant?.name}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {piece.variants.map((option) => {
                const active = option.name === variant?.name;
                return (
                  <button
                    key={option.name}
                    type="button"
                    aria-pressed={active}
                    aria-label={option.name}
                    title={option.name}
                    onClick={() => {
                      setVariantName(option.name);
                      setPhotoIndex(null);
                    }}
                    className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm transition-colors ${
                      active
                        ? "border-ink text-ink"
                        : "border-line text-muted hover:border-ink hover:text-ink"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="size-6 rounded-full border border-ink/10"
                      style={{ backgroundColor: option.swatch }}
                    />
                    {option.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}
        {piece.price || piece.priceOptions?.length ? (
          <div className="mt-8 max-w-lg rounded-2xl border border-line bg-card px-6 py-5">
            <div className="space-y-2.5">
              {piece.price ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-base text-ink/80">Price</span>
                  <span className="dot-leader" />
                  <span className="font-display text-3xl text-ink">{piece.price}</span>
                </div>
              ) : null}
              {piece.priceOptions?.map((option) => (
                <div key={option.label} className="flex items-baseline gap-3">
                  <span className="text-base text-ink/80">{option.label}</span>
                  <span className="dot-leader" />
                  <span className="font-display text-3xl text-ink">{option.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-line pt-3 text-sm text-gold">
              Handmade · {site.shipping}
            </p>
          </div>
        ) : null}
        <div className="mt-10 max-w-lg space-y-5 text-lg leading-relaxed">
          {piece.story.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <blockquote className="mt-12 max-w-lg border-l border-gold pl-6">
          <p className="font-display text-4xl italic leading-tight text-plum">
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
