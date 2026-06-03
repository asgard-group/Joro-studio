"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";

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
    <section data-navbar-theme="light" className="bg-cream pt-[120px] pb-[80px] lg:pt-[100px] lg:pb-[200px]">

      {/* Header */}
      <div className="text-center px-4 mb-[60px] lg:mb-[80px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-charcoal/50 mb-4">
          Avis client
        </p>
        <h2 className="text-[32px] lg:text-[46px] font-semibold text-charcoal leading-tight">
          Une réflexion architecturale<br />au cœur de chaque projet
        </h2>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-[30px] overflow-x-auto px-4 sm:px-6 lg:px-[60px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="group flex-shrink-0"
            style={{
              width: "calc((100vw - 210px) / 4)",
              minWidth: "260px",
              scrollSnapAlign: "start",
            }}
          >
            {/* Photo + hover overlay */}
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "450px" }}
            >
              {t.photo ? (
                <Image
                  src={t.photo}
                  alt={t.author}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-[#BAB6AA]/40" />
              )}

              {/* Témoignage — révélé au survol */}
              <div className="absolute inset-0 bg-charcoal flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Guillemets + texte */}
                <div>
                  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="mb-5">
                    <path d="M0 28V17.2C0 13.467 0.933 10.2 2.8 7.4C4.667 4.533 7.4 2.2 11 0.399999L13.4 4C11 5.4 9.167 7 8 8.8C6.9 10.6 6.367 12.667 6.4 15H13.4V28H0ZM22.6 28V17.2C22.6 13.467 23.533 10.2 25.4 7.4C27.267 4.533 30 2.2 33.6 0.399999L36 4C33.6 5.4 31.767 7 30.6 8.8C29.5 10.6 28.967 12.667 29 15H36V28H22.6Z" fill="white" fillOpacity="0.25"/>
                  </svg>
                  <p className="text-white text-[14px] leading-relaxed">
                    {t.quote}
                  </p>
                </div>

                {/* Auteur */}
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                    {t.photo && (
                      <Image src={t.photo} alt={t.author} fill className="object-cover" sizes="44px" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-[14px] font-semibold leading-snug">{t.author}</p>
                    <p className="text-white/50 text-[12px] mt-0.5">{t.company}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="flex justify-between items-baseline pt-[14px]">
              <span className="text-[15px] font-medium text-charcoal leading-snug">
                {t.author}
              </span>
              <span
                className="text-[13px] text-[#BAB6AA] shrink-0 ml-3"
                style={{ letterSpacing: "0.02em" }}
              >
                {t.company}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Slider */}
      <div className="flex justify-center mt-[48px]">
        <div
          ref={trackRef}
          onClick={onTrackClick}
          className="relative rounded-full bg-[#BAB6AA]/30 cursor-pointer"
          style={{ width: "180px", height: "2px" }}
        >
          <div
            onMouseDown={onHandleMouseDown}
            className="absolute top-1/2 -translate-y-1/2 bg-charcoal rounded-full cursor-grab active:cursor-grabbing transition-[left] duration-150 ease-out"
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
