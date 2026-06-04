"use client";

import { useRef, useState, useEffect } from "react";
import ComingSoonLink from "@/components/ui/ComingSoonLink";
import Pill from "@/components/ui/Pill";
import { motion, useScroll, useTransform } from "framer-motion";

const serviceNav = [
  { label: "DESIGN & BUILD", id: "design-build" },
  { label: "AMO", id: "amo" },
  { label: "MARKETING SUITE", id: "marketing-suite" },
  { label: "CONSEIL & STRATÉGIE", id: "conseil-workplace" },
];

// ─── ServicesAll ─────────────────────────────────────────────────
export default function ServicesAll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();

  const [ranges, setRanges] = useState({
    dissolveStart: 99999, dissolveEnd: 109999,
    fadeOutStart: 109999, fadeOutEnd: 119999,
    splitStart: 119999, splitEnd: 129999,
  });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const top = containerRef.current.offsetTop;
      const vh = window.innerHeight;
      setRanges({
        // Slide 1 (cream) → Slide 2 (charcoal) : crossfade court
        dissolveStart: top + vh * 0.3,
        dissolveEnd: top + vh * 0.45,
        // Fade out du contenu intro avant le split
        fadeOutStart: top + vh * 0.65,
        fadeOutEnd: top + vh * 0.9,
        // Split des panneaux pour révéler DESIGN & BUILD
        splitStart: top + vh * 0.9,
        splitEnd: top + vh * 2.2,
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

  // Dissolve : slide 1 (cream) fade out → slide 2 (charcoal) visible derrière
  const slide1Opacity = useTransform(scrollY, [ranges.dissolveStart, ranges.dissolveEnd], [1, 0]);

  // Fade out global de l'intro (pour révéler DESIGN & BUILD via split)
  const contentOpacity = useTransform(scrollY, [ranges.fadeOutStart, ranges.fadeOutEnd], [1, 0]);

  // Split des panneaux
  const leftX = useTransform(scrollY, [ranges.splitStart, ranges.splitEnd], ["0%", "-100%"]);
  const rightX = useTransform(scrollY, [ranges.splitStart, ranges.splitEnd], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "420vh" }}>
      <div id="design-build" style={{ position: "absolute", top: "calc(2.2 * 100vh)" }} />
      <div
        data-navbar-theme="dark"
        className="sticky top-0 h-screen overflow-hidden"
        style={{ zIndex: 35 }}
      >
        {/* Vidéo de fond (révélée par le split) */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
          src="/videos/vecteezy_unrecognizable-female-carpenter-or-furniture-designer_71265347.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 z-0 bg-charcoal/20 mix-blend-color-dodge" />

        {/* Contenu DESIGN & BUILD — révélé par le split (z-5) */}
        <div className="absolute inset-0 z-[5] flex items-center justify-between px-4 sm:px-6 lg:px-[60px]">
          <div className="max-w-[480px]">
            <h2 className="text-[48px] md:text-[64px] font-semibold uppercase leading-none tracking-tight text-cream mb-[40px] md:mb-[70px] whitespace-nowrap">
              DESIGN & BUILD
            </h2>
            <p className="max-w-[460px] text-[16px] leading-relaxed text-cream mb-[25px]">
              Chaque espace est pensé dans ses moindres détails pour conjuguer esthétique et performance durable. Une vision cohérente, du premier trait jusqu'à la remise des clés.
            </p>
            <ComingSoonLink className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream border-b border-cream/50 pb-1">
              Lancer un projet
            </ComingSoonLink>
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
                className={`text-[14px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-cream ${
                  item.id === "design-build" ? "text-cream" : "text-cream/30"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panneaux charcoal (toujours opaques) — glissent au split (z-20) */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-charcoal z-20"
          style={{ width: "50%", x: leftX }}
        />
        <motion.div
          className="absolute top-0 right-0 h-full bg-charcoal z-20"
          style={{ width: "50%", x: rightX }}
        />

        {/* Slide 2 (charcoal + texte cream) — derrière slide 1, fade out global (z-30) */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ opacity: contentOpacity }}
        >
          <IntroSlide dark={true} />
        </motion.div>

        {/* Slide 1 (cream + texte charcoal) — devant slide 2, fade out pendant dissolve (z-31) */}
        <motion.div
          className="absolute inset-0 z-[31] pointer-events-none"
          style={{ opacity: slide1Opacity }}
        >
          <IntroSlide dark={false} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── IntroSlide ──────────────────────────────────────────────────
function IntroSlide({ dark }: { dark: boolean }) {
  // Toutes les couleurs passent par des classes Tailwind tokenisées (cream / charcoal).
  const bgClass = dark ? "bg-charcoal" : "bg-cream";
  const textClass = dark ? "text-cream" : "text-charcoal";
  const subTextClass = dark ? "text-cream/70" : "text-charcoal/70";
  const lineBgClass = dark ? "bg-cream/40" : "bg-charcoal/40";

  return (
    <div className={`absolute inset-0 flex flex-col ${bgClass}`}>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <Pill variant={dark ? "dark" : "light"} className="mb-6 md:mb-8">
          NOS OFFRES
        </Pill>
        {/* Titre */}
        <h2
          className={`font-semibold tracking-tight text-[28px] md:text-[36px] lg:text-[46px] max-w-[900px] ${textClass}`}
          style={{ lineHeight: "130%" }}
        >
          QUATRE EXPERTISES,<br />UN SEUL INTERLOCUTEUR
        </h2>
      </div>
      {/* CTA bas — collé au bas du viewport */}
      <div className="flex flex-col items-center">
        <span className={`text-[11px] font-medium tracking-[0.25em] ${subTextClass}`}>
          GLISSER POUR DÉCOUVRIR
        </span>
        <div className="h-5" />
        <div className={`w-px h-10 ${lineBgClass}`} />
      </div>
    </div>
  );
}
