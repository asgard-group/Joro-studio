"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
}

export default function FeaturedWork({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (dir: "prev" | "next") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("a") as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth + 12 : 320;
    scrollRef.current.scrollBy({ left: dir === "next" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    const cardWidth = scrollWidth / items.length;
    setActiveIndex(Math.round(scrollLeft / cardWidth));
  };

  return (
    <section data-navbar-theme="light" className="bg-[#F3F2ED]" style={{ paddingTop: 200, paddingBottom: 200 }}>

      {/* En-tête : eyebrow + titre à gauche, flèches en bas à droite */}
      <div className="flex items-end justify-between gap-6 mb-10 lg:mb-14 px-4 sm:px-6 lg:px-[60px]">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/50 mb-3">
            Nos réalisations
          </p>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-tight tracking-tight text-charcoal">
            Une réflexion architecturale<br />au cœur de chaque projet
          </h2>
        </div>

        {/* Flèches prev / next — masquées sur mobile */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => scrollTo("prev")}
            aria-label="Projet précédent"
            className="w-9 h-9 border border-charcoal/25 flex items-center justify-center hover:bg-charcoal hover:text-cream transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M8.5 2L3.5 6.5l5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo("next")}
            aria-label="Projet suivant"
            className="w-9 h-9 border border-charcoal/25 flex items-center justify-center hover:bg-charcoal hover:text-cream transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M4.5 2l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto pl-4 sm:pl-6 lg:pl-[60px] [scroll-padding-left:16px] sm:[scroll-padding-left:24px] lg:[scroll-padding-left:60px]"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/work/${item.id}`}
            className="shrink-0 group w-[85vw] md:w-[62vw] lg:w-[64vw] lg:max-w-[926px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="relative w-full overflow-hidden aspect-square lg:aspect-[926/487]">
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 767px) 85vw, (max-width: 1023px) 62vw, min(64vw, 926px)"
              />
            </div>
            <div className="mt-5 lg:mt-[30px] pr-2">
              <h3 className="text-[24px] font-medium text-charcoal leading-tight">
                {item.title}
              </h3>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-charcoal/40 mt-1">
                {item.location}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Dots — mobile uniquement */}
      <div className="flex sm:hidden justify-center gap-2 mt-6 px-4">
        {items.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === activeIndex ? "bg-charcoal" : "bg-charcoal/20"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
