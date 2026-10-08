"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Piece } from "@/lib/types";

type Slide = {
  key: string;
  name: string;
  category: string;
  line: string;
  image: string;
  alt: string;
  frame: string;
  links: { href: string; label: string }[];
};

function pieceSlide(piece: Piece, frame: string): Slide {
  return {
    key: piece.id,
    name: piece.name,
    category: piece.category,
    line: piece.adHeadline,
    image: piece.image,
    alt: piece.altText,
    frame,
    links: [{ href: `/pieces/${piece.id}`, label: piece.name }],
  };
}

function campaignSlides(pieces: Piece[]): Slide[] {
  return pieces.map((piece) => pieceSlide(piece, "object-cover object-center"));
}

export function ScrollCampaign({ pieces }: { pieces: Piece[] }) {
  const reduce = useReducedMotion();
  const slides = campaignSlides(pieces);
  const trackRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const active = slides[index] ?? slides[0];

  useEffect(() => {
    if (reduce) {
      return;
    }
    const track = trackRef.current;
    if (!track) {
      return;
    }

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = track.offsetHeight - window.innerHeight;
        const scrolled = Math.min(
          Math.max(-track.getBoundingClientRect().top, 0),
          total,
        );
        const segment = total <= 0 ? 1 : total / slides.length;
        const next = Math.min(slides.length - 1, Math.floor(scrolled / segment));
        setIndex(next);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce, slides.length]);

  if (!active) {
    return null;
  }

  return (
    <section
      id="campaign"
      ref={trackRef}
      className="bg-[#f7f2ea]"
      style={reduce ? undefined : { height: `${slides.length * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {slides.map((slide, slideIndex) => (
          <Image
            key={slide.key}
            src={slide.image}
            alt={slideIndex === index ? slide.alt : ""}
            fill
            priority={slideIndex === 0}
            unoptimized
            sizes="100vw"
            className={`${slide.frame} transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f1ea] via-[#f6f1ea]/20 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 pt-28 md:px-10 md:pb-16">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-gold">
            {active.category}
          </p>
          <h1 className="mt-3 max-w-xl font-display text-5xl font-light leading-[0.95] tracking-tight text-ink sm:text-7xl">
            {active.line}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {active.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-ink px-5 py-3 text-sm text-card"
              >
                {link.label}
              </Link>
            ))}
            <p className="ml-auto font-display text-lg text-ink/70">
              {String(index + 1).padStart(2, "0")}
              <span className="text-ink/40"> / {String(slides.length).padStart(2, "0")}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
