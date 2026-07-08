"use client";

import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import type { TestimonialCard } from "@/data/testimonials";
import Pill from "@/components/ui/Pill";

function QuoteIcon() {
  return (
    <svg width="44" height="34" viewBox="0 0 36 28" fill="none" className="mb-6">
      <path
        d="M0 28V17.2C0 13.467 0.933 10.2 2.8 7.4C4.667 4.533 7.4 2.2 11 0.399999L13.4 4C11 5.4 9.167 7 8 8.8C6.9 10.6 6.367 12.667 6.4 15H13.4V28H0ZM22.6 28V17.2C22.6 13.467 23.533 10.2 25.4 7.4C27.267 4.533 30 2.2 33.6 0.399999L36 4C33.6 5.4 31.767 7 30.6 8.8C29.5 10.6 28.967 12.667 29 15H36V28H22.6Z"
        fill="white"
        fillOpacity="0.25"
      />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section data-navbar-theme="light" className="bg-cream pt-[150px] pb-[150px]">

      {/* Header : titre + pill sur la même ligne */}
      <div className="flex items-center justify-between px-[24px] sm:px-[40px] lg:px-[60px] mb-[60px]">
        <h2 className="font-semibold uppercase text-[36px] sm:text-[52px] text-charcoal leading-none tracking-tight">
          AVIS CLIENT
        </h2>
        <Pill>TÉMOIGNAGES</Pill>
      </div>

      {/* 4 cartes témoignage : photo fixe, citation révélée au survol — scroll horizontal si ça ne rentre pas */}
      <div
        className="flex gap-[20px] overflow-x-auto px-[24px] sm:px-[40px] lg:px-[60px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
      >
        {(testimonials as TestimonialCard[]).map((t) => (
          <div
            key={t.id}
            className="group flex flex-col flex-shrink-0"
            style={{ width: "clamp(280px, 21.5625vw, 414px)", scrollSnapAlign: "start" }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "clamp(360px, 33.854vw, 650px)" }}
            >
              {t.photo ? (
                <Image
                  src={t.photo}
                  alt={t.author}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-[#BAB6AA]/30" />
              )}

              {/* Témoignage — révélé au survol */}
              <div className="absolute inset-0 bg-charcoal flex flex-col justify-between p-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <QuoteIcon />
                  <p className="text-white text-[15px] leading-relaxed">{t.quote}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-white/10" />
                  <div>
                    <p className="text-white text-[15px] font-semibold leading-snug">{t.author}</p>
                    <p className="text-white/50 text-[13px] mt-0.5">
                      {t.company}
                      {t.location ? `, ${t.location}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption : nom + localisation */}
            <div className="flex justify-between items-baseline pt-[14px] pb-[10px]">
              <span className="text-[15px] font-medium text-charcoal">
                {t.company}
              </span>
              <span className="text-[13px] text-[#BAB6AA] shrink-0 ml-3" style={{ letterSpacing: "0.02em" }}>
                {t.location}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
