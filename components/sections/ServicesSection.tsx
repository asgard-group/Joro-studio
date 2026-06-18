"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [ranges, setRanges] = useState({
    yStart:           99999,
    yEnd:             199999,
    ctaStart:         99999,
    ctaEnd:           109999,
    contentFadeStart: 109999,
    contentFadeEnd:   149999,
  });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const top = containerRef.current.offsetTop;
      const h   = containerRef.current.offsetHeight; // 200vh
      setRanges({
        yStart:           top,
        yEnd:             top + h,
        ctaStart:         top + h * 0.08,
        ctaEnd:           top + h * 0.22,
        contentFadeStart: top + h * 0.25,
        contentFadeEnd:   top + h * 0.60,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Tous basés sur scrollY global → reste bloqué à 0 une fois passé
  const contentY       = useTransform(scrollY, [ranges.yStart, ranges.yEnd],             ["0%", "-80%"]);
  const contentOpacity = useTransform(scrollY, [ranges.contentFadeStart, ranges.contentFadeEnd], [1, 0]);
  const ctaOpacity     = useTransform(scrollY, [ranges.ctaStart, ranges.ctaEnd],          [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[200vh]">

      {/* Fond sticky plein écran */}
      <div
        className="sticky top-0 h-screen bg-charcoal flex flex-col overflow-hidden"
        data-navbar-theme="dark"
      >
        {/* Contenu centré — remonte et s'efface */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <motion.div style={{ y: contentY, opacity: contentOpacity }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-cream/50 mb-3 md:mb-5">
              Nos offres
            </p>
            <h2 className="text-[26px] md:text-[46px] font-semibold leading-tight text-cream max-w-2xl">
              Des espaces conçus<br />avec du savoir-faire
            </h2>
          </motion.div>
        </div>

        {/* CTA bas — disparaît en premier, définitivement */}
        <motion.div
          className="flex flex-col items-center pb-0"
          style={{ opacity: ctaOpacity }}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-cream/50">
            Glisser pour découvrir
          </span>
          <div className="h-5" />
          <div className="h-10 w-px bg-cream/30" />
        </motion.div>
      </div>

    </div>
  );
}
