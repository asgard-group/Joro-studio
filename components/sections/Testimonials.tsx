"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import Pill from "@/components/ui/Pill";

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);

  const n = testimonials.length;
  const handlePct = 100 / n;
  const handleLeft = progress * (100 - handlePct);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isDragging.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const max = scrollWidth - clientWidth;
    setProgress(max > 0 ? scrollLeft / max : 0);
  }, []);

  const scrollToProgress = useCallback((p: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const max = scrollWidth - clientWidth;
    scrollRef.current.scrollLeft = p * max;
  }, []);

  const onTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const trackW = rect.width;
    const handleW = trackW * (handlePct / 100);
    const usable = trackW - handleW;
    const p = Math.min(1, Math.max(0, (clickX - handleW / 2) / usable));
    setProgress(p);
    scrollToProgress(p);
  }, [handlePct, scrollToProgress]);

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartProgress.current = progress;

    const onMove = (ev: MouseEvent) => {
      if (!trackRef.current) return;
      const trackW = trackRef.current.getBoundingClientRect().width;
      const handleW = trackW * (handlePct / 100);
      const usable = trackW - handleW;
      const delta = (ev.clientX - dragStartX.current) / usable;
      const p = Math.min(1, Math.max(0, dragStartProgress.current + delta));
      setProgress(p);
      scrollToProgress(p);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [progress, handlePct, scrollToProgress]);

  return (
    <section data-navbar-theme="light" className="bg-cream pt-[80px] pb-[80px]">

      {/* Label pill */}
      <div className="px-[24px] sm:px-[40px] lg:px-[60px] mb-[40px]">
        <Pill>TÉMOIGNAGES</Pill>
      </div>

      {/* Corps : titre vertical + carousel */}
      <div className="flex items-stretch">

        {/* AVIS CLIENT — texte vertical aligné en haut */}
        <div className="hidden lg:flex items-start justify-center shrink-0 pl-[60px] pr-[20px]">
          <span
            className="font-semibold uppercase text-[52px] text-charcoal select-none"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            AVIS CLIENT
          </span>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-[20px] overflow-x-auto pr-[24px] sm:pr-[40px] lg:pr-[60px]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group flex-shrink-0 flex flex-col"
              style={{
                width: "clamp(280px, calc((100vw - 220px) / 3), 420px)",
                scrollSnapAlign: "start",
              }}
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden" style={{ height: "520px" }}>
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.author}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#BAB6AA]/30" />
                )}

                {/* Overlay citation — visible au survol */}
                <div className="absolute inset-0 bg-charcoal/60 flex flex-col justify-end p-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="32" height="24" viewBox="0 0 36 28" fill="none" className="mb-[16px]">
                    <path d="M0 28V17.2C0 13.467 0.933 10.2 2.8 7.4C4.667 4.533 7.4 2.2 11 0.399999L13.4 4C11 5.4 9.167 7 8 8.8C6.9 10.6 6.367 12.667 6.4 15H13.4V28H0ZM22.6 28V17.2C22.6 13.467 23.533 10.2 25.4 7.4C27.267 4.533 30 2.2 33.6 0.399999L36 4C33.6 5.4 31.767 7 30.6 8.8C29.5 10.6 28.967 12.667 29 15H36V28H22.6Z" fill="white" fillOpacity="0.5"/>
                  </svg>
                  <p className="text-white text-[14px] leading-[1.65] mb-[20px]">
                    {t.quote}
                  </p>
                  <p className="text-white/60 text-[12px] font-medium tracking-[0.06em]">
                    — {t.author}, {t.company}
                  </p>
                </div>
              </div>

              {/* Caption sous l'image */}
              {(
                <div className="flex justify-between items-baseline pt-[14px]">
                  <span className="text-[15px] font-medium text-charcoal">
                    {t.author}
                  </span>
                  <span className="text-[13px] text-[#BAB6AA] shrink-0 ml-3" style={{ letterSpacing: "0.02em" }}>
                    {t.company}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-[48px]">
        <div
          ref={trackRef}
          onClick={onTrackClick}
          className="relative bg-[#BAB6AA]/30 cursor-pointer"
          style={{ width: "180px", height: "2px" }}
        >
          <div
            onMouseDown={onHandleMouseDown}
            className="absolute top-1/2 -translate-y-1/2 bg-charcoal cursor-grab active:cursor-grabbing transition-[left] duration-150 ease-out"
            style={{
              width: `${handlePct}%`,
              height: "2px",
              left: `${handleLeft}%`,
            }}
          />
        </div>
      </div>

    </section>
  );
}
