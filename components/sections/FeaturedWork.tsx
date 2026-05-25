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
            className="flex items-center justify-center hover:opacity-50 transition-opacity"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo("next")}
            aria-label="Projet suivant"
            className="flex items-center justify-center hover:opacity-50 transition-opacity"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            <div className="mt-5 lg:mt-[20px] flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h3 className="text-[16px] font-medium text-charcoal leading-tight">
                  {item.title}
                </h3>
                <span className="text-charcoal/30 text-[14px] font-light">•</span>
                <p className="text-[16px] font-medium text-charcoal/40">
                  {item.location}
                </p>
              </div>
              {/* Voir plus — apparaît au survol */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[16px] font-medium tracking-wide text-charcoal opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  Voir plus
                </span>
                <span className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-75 flex items-center">
                  <Image src="/images/icon/arrow-right-line.svg" alt="" width={20} height={20} />
                </span>
              </div>
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
