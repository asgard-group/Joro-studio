"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import ComingSoonLink from "@/components/ui/ComingSoonLink";
import Pill from "@/components/ui/Pill";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [ranges, setRanges] = useState({
    glisserFadeStart: 99999,
    glisserFadeEnd:   109999,
    contentFadeStart: 109999,
    contentFadeEnd:   119999,
    titleMoveStart:   99999,
    titleMoveEnd:     119999,
  });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const top = containerRef.current.offsetTop;
      const vh = window.innerHeight;
      setRanges({
        glisserFadeStart: top,
        glisserFadeEnd:   top + vh * 0.3,
        contentFadeStart: top + vh * 0.35,
        contentFadeEnd:   top + vh * 0.8,
        titleMoveStart:   top,
        titleMoveEnd:     top + vh * 0.8,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const glisserOpacity = useTransform(
    scrollY,
    [ranges.glisserFadeStart, ranges.glisserFadeEnd],
    [1, 0]
  );

  const contentOpacity = useTransform(
    scrollY,
    [ranges.contentFadeStart, ranges.contentFadeEnd],
    [0, 1]
  );

  const titleY = useTransform(
    scrollY,
    [ranges.titleMoveStart, ranges.titleMoveEnd],
    ["0vh", "-27vh"]
  );

  return (
    <div ref={containerRef} className="bg-charcoal" style={{ height: "200vh" }}>
      <div
        data-navbar-theme="dark"
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* Background image */}
        <Image
          src="/images/bg-cta.png"
          alt=""
          fill
          className="object-cover"
          priority
        />

        {/* Title block — centered, moves up on scroll */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.div style={{ y: titleY }} className="flex flex-col items-center">
            <Pill variant="dark" className="mb-5">NOUS CONTACTER</Pill>
            <h2 className="text-[46px] font-semibold leading-tight text-cream max-w-3xl uppercase">
              Transformons<br />vos idées en réalité
            </h2>
          </motion.div>
        </div>

        {/* Glisser pour découvrir — fades out on scroll */}
        <motion.div
          className="absolute bottom-0 inset-x-0 z-10 flex flex-col items-center pointer-events-none"
          style={{ opacity: glisserOpacity }}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-cream/50">
            Glisser pour découvrir
          </span>
          <div className="h-5" />
          <div className="w-px bg-cream/30" style={{ height: 40 }} />
        </motion.div>

        {/* Two-column content — fades in after glisser disappears */}
        <motion.div
          className="absolute inset-x-0 bottom-[28vh] z-10 px-4 sm:px-6 lg:px-[60px]"
          style={{ opacity: contentOpacity }}
        >
          <div className="relative grid grid-cols-1 sm:grid-cols-2">
            {/* Vertical separator */}
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-cream/20" />

            {/* Left — Prendre rendez-vous */}
            <div className="flex flex-col items-center text-center sm:pr-12 lg:pr-20 mb-10 sm:mb-0">
              <p className="text-[20px] md:text-[24px] lg:text-[26px] font-normal text-cream leading-snug mb-8 max-w-xs">
                Rencontrez notre équipe<br />dès maintenant
              </p>
              <ComingSoonLink className="inline-flex items-center justify-center px-8 py-4 bg-cream text-charcoal text-[11px] font-medium uppercase tracking-[0.18em]">
                Prendre rendez-vous
              </ComingSoonLink>
            </div>

            {/* Right — Newsletter */}
            <div className="flex flex-col items-center text-center sm:pl-12 lg:pl-20">
              <p className="text-[20px] md:text-[24px] lg:text-[26px] font-normal text-cream leading-snug mb-8 max-w-xs">
                Tenez vous aux courants<br />des derniers projets
              </p>
              <div className="flex w-full max-w-sm">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="flex-1 min-w-0 bg-transparent border border-cream/40 px-4 py-4 text-[13px] text-cream placeholder-cream/40 focus:outline-none focus:border-cream/70 transition-colors"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-cream text-charcoal px-5 text-[11px] font-medium uppercase tracking-[0.18em] hover:bg-cream/90 transition-colors"
                >
                  Rejoindre
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
