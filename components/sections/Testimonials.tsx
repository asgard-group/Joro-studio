"use client";

import { useRef, useState, useCallback } from "react";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { testimonials } from "@/data/testimonials";
import type { TestimonialCard } from "@/data/testimonials";
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
    <section data-navbar-theme="light" className="bg-cream pt-[150px] pb-[150px]">

      {/* Label pill */}
      <div className="px-[24px] sm:px-[40px] lg:px-[60px] mb-[60px]">
        <Pill>TÉMOIGNAGES</Pill>
      </div>

      {/* Corps : titre vertical + carousel */}
      <div className="flex items-stretch">

        {/* AVIS CLIENT — texte vertical aligné en haut */}
        <div className="hidden lg:flex items-start justify-center shrink-0 pl-[60px] pr-[60px]">
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
          {(testimonials as TestimonialCard[]).map((t) => (
            <div
              key={t.id}
              className="flex-shrink-0 flex flex-col"
              style={{
                width: "clamp(280px, 527px, 527px)",
                scrollSnapAlign: "start",
              }}
            >
              {/* Image galerie hover */}
              <div className="relative w-full overflow-hidden" style={{ height: "clamp(360px, 660px, 660px)" }}>
                {t.images?.length ? (
                  <AnimatedImage
                    images={t.images}
                    alt={t.author}
                  />
                ) : (
                  <div className="w-full h-full bg-[#BAB6AA]/30" />
                )}
              </div>

              {/* Caption : nom + localisation */}
              <div className="flex justify-between items-baseline pt-[14px] pb-[10px]">
                <span className="text-[15px] font-medium text-charcoal uppercase tracking-wide">
                  {t.author}
                </span>
                <span className="text-[13px] text-[#BAB6AA] shrink-0 ml-3" style={{ letterSpacing: "0.02em" }}>
                  {t.location ?? t.company}
                </span>
              </div>

              {/* Citation visible en permanence */}
              <p className="text-[13px] text-charcoal/60 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
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
