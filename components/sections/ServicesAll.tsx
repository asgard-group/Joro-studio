"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const serviceNav = [
  { label: "DESIGN & BUILD", id: "design-build" },
  { label: "AMO", id: "amo" },
  { label: "MARKETING SUITE", id: "marketing-suite" },
  { label: "CONSEIL & STRATÉGIE", id: "conseil-workplace" },
];

// ─── Animated character ─────────────────────────────────────────
const INTRO_TEXT = "Notre vision est de repenser les\nespaces dédiés aux nouveaux\nusages urbains";

interface AnimatedCharProps {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}

function AnimatedChar({ char, progress, start, end }: AnimatedCharProps) {
  const color = useTransform(
    progress,
    [start, end],
    ["rgba(186, 182, 170, 0.3)", "rgba(255, 255, 255, 1)"]
  );
  if (char === "\n") return <br />;
  return <motion.span style={{ color }}>{char}</motion.span>;
}

// ─── ServicesAll ─────────────────────────────────────────────────
export default function ServicesAll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();

  const [ranges, setRanges] = useState({
    fadeInStart: 99999, fadeInEnd: 109999,
    fadeOutStart: 109999, fadeOutEnd: 119999,
    splitStart: 119999, splitEnd: 129999,
    textRevealStart: 99999, textRevealEnd: 109999,
  });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const top = containerRef.current.offsetTop;
      const vh = window.innerHeight;
      setRanges({
        fadeInStart: top,
        fadeInEnd: top + vh * 0.3,
        fadeOutStart: top + vh * 0.5,
        fadeOutEnd: top + vh * 0.9,
        splitStart: top + vh * 0.9,
        splitEnd: top + vh * 2.2,
        textRevealStart: top - vh * 0.3,
        textRevealEnd: top + vh * 0.2,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const contentOpacity = useTransform(
    scrollY,
    [ranges.fadeOutStart, ranges.fadeOutEnd],
    [1, 0]
  );

  const leftX = useTransform(scrollY, [ranges.splitStart, ranges.splitEnd], ["0%", "-100%"]);
  const rightX = useTransform(scrollY, [ranges.splitStart, ranges.splitEnd], ["0%", "100%"]);

  // Text reveal: 0 → 1 over the visible window
  const textProgress = useTransform(
    scrollY,
    [ranges.textRevealStart, ranges.textRevealEnd],
    [0, 1]
  );

  const chars = INTRO_TEXT.split("");
  const n = chars.length;

  return (
    <div ref={containerRef} className="relative" style={{ height: "420vh" }}>
      <div id="design-build" style={{ position: "absolute", top: "calc(2.2 * 100vh)" }} />
      <div
        data-navbar-theme="dark"
        className="sticky top-0 h-screen overflow-hidden"
        style={{ zIndex: 35 }}
      >
        {/* Vidéo de fond */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
          src="/vidéos/vecteezy_unrecognizable-female-carpenter-or-furniture-designer_71265347.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 z-0 bg-[#1C2626]/20 mix-blend-color-dodge" />

        {/* Contenu DESIGN & BUILD — révélé par le split */}
        <div className="absolute inset-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-[60px]">
          <div className="max-w-[480px]">
            <h2 className="text-[48px] md:text-[64px] font-semibold uppercase leading-none tracking-tight text-[#F3F2ED] mb-[40px] md:mb-[70px] whitespace-nowrap">
              DESIGN & BUILD
            </h2>
            <p className="max-w-[360px] text-[16px] leading-relaxed text-[#F3F2ED] mb-[25px]">
              Nous transformons les espaces en lieux de vie authentiques,
              conjuguant qualité haut de gamme, design contemporain
              et responsabilité écologique.
            </p>
            <Link
              href="/services#design-build"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#F3F2ED] border-b border-[#F3F2ED]/50 pb-1 hover:border-[#F3F2ED] transition-colors"
            >
              Découvrir l'offre
            </Link>
          </div>
          <div className="hidden md:flex flex-col items-end gap-[18px]">
            {serviceNav.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  const el = document.getElementById(item.id);
                  if (!el) return;
                  const top = el.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({ top, behavior: "smooth" });
                }}
                className={`text-[14px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-[#F3F2ED] ${
                  item.id === "design-build" ? "text-[#F3F2ED]" : "text-[#F3F2ED]/30"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu intro — fade in puis fade out */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col pointer-events-none"
          style={{ opacity: contentOpacity }}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#F3F2ED]/50 mb-3 md:mb-5">
              Nos offres
            </p>
            <h2 className="text-[30px] md:text-[46px] font-semibold leading-tight max-w-3xl">
              {chars.map((char, i) => (
                <AnimatedChar
                  key={i}
                  char={char}
                  progress={textProgress}
                  start={i / n}
                  end={Math.min((i + 1) / n, 1)}
                />
              ))}
            </h2>
          </div>
          <div className="flex flex-col items-center pb-0">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#F3F2ED]/50">
              Glisser pour découvrir
            </span>
            <div className="h-5" />
            <div className="w-px bg-[#F3F2ED]/30" style={{ height: 40 }} />
          </div>
        </motion.div>

        {/* Panneau gauche */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#1C2626] z-20"
          style={{ width: "50%", x: leftX }}
        />

        {/* Panneau droit */}
        <motion.div
          className="absolute top-0 right-0 h-full bg-[#1C2626] z-20"
          style={{ width: "50%", x: rightX }}
        />

      </div>
    </div>
  );
}
