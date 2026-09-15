"use client";

import { useRef, useState, useEffect } from "react";
import ComingSoonLink from "@/components/ui/ComingSoonLink";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, type MotionValue } from "framer-motion";
import ServicesMobileCarousel from "@/components/sections/ServicesMobileCarousel";
import { useIsDesktop } from "@/hooks/useIsDesktop";

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
  // Ce bloc vidéo n'est jamais visible sur mobile (masqué par `hidden md:contents`),
  // on évite donc de le monter/décoder tant qu'on n'est pas sur desktop.
  const isDesktop = useIsDesktop();

  const [ranges, setRanges] = useState({
    dissolveStart: 99999, dissolveEnd: 109999,
    phase1ExitStart: 99999, phase1ExitEnd: 109999,
    phase2Start: 109999,
    fadeOutStart: 119999, fadeOutEnd: 129999,
    splitStart: 129999, splitEnd: 139999,
  });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      // getBoundingClientRect + scrollY plutôt que offsetTop : indépendant de
      // l'offsetParent et recalculé après le chargement des médias, sinon les
      // seuils se décalent quand la mise en page bouge encore.
      const top = containerRef.current.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      setRanges({
        // Slide 1 (cream) → Slide 2 (charcoal) : crossfade court
        dissolveStart: top + vh * 0.3,
        dissolveEnd: top + vh * 0.45,
        // Temps 1 — "QUATRE EXPERTISES" tient l'écran puis sort par le haut
        phase1ExitStart: top + vh * 0.6,
        phase1ExitEnd: top + vh * 0.9,
        // Temps 2 — "UN SEUL INTERLOCUTEUR" se révèle lettre par lettre
        phase2Start: top + vh * 0.87,
        // Fade out de l'intro — le temps 2 reste lisible ~1 écran avant de partir
        fadeOutStart: top + vh * 1.9,
        fadeOutEnd: top + vh * 2.15,
        // Split des panneaux pour révéler DESIGN & BUILD
        splitStart: top + vh * 2.15,
        splitEnd: top + vh * 3.0,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("load", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("load", calc);
    };
  }, []);

  useEffect(() => {
    if (isDesktop && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isDesktop]);

  // Dissolve : slide 1 (cream) fade out → slide 2 (charcoal) visible derrière
  // const slide1Opacity = useTransform(scrollY, [ranges.dissolveStart, ranges.dissolveEnd], [1, 0]);

  // Fade out global de l'intro (pour révéler DESIGN & BUILD via split)
  const contentOpacity = useTransform(scrollY, [ranges.fadeOutStart, ranges.fadeOutEnd], [1, 0]);

  // Temps 1 — sortie de "QUATRE EXPERTISES" vers le haut (fondu + translation)
  const phase1Opacity = useTransform(scrollY, [ranges.phase1ExitStart, ranges.phase1ExitEnd], [1, 0]);
  const phase1Y = useTransform(scrollY, [ranges.phase1ExitStart, ranges.phase1ExitEnd], ["0px", "-40px"]);

  // Temps 2 — déclencheur de la révélation lettre par lettre. Réversible : en
  // remontant, les lettres se re-masquent et le temps 1 réapparaît.
  const rangesRef = useRef(ranges);
  rangesRef.current = ranges;
  const [phase2Visible, setPhase2Visible] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    setPhase2Visible(v >= rangesRef.current.phase2Start);
  });

  // Split des panneaux
  const leftX = useTransform(scrollY, [ranges.splitStart, ranges.splitEnd], ["0%", "-100%"]);
  const rightX = useTransform(scrollY, [ranges.splitStart, ranges.splitEnd], ["0%", "100%"]);

  return (
    // 520vh (et non 420) : chaque temps de l'intro dispose d'assez de scroll pour
    // rester lisible avant de céder la place au suivant.
    <div ref={containerRef} className="relative" style={{ height: "520vh" }}>
      <div id="design-build" style={{ position: "absolute", top: "calc(3 * 100vh)" }} />
      <div
        data-navbar-theme="dark"
        className="sticky top-0 h-screen overflow-hidden bg-charcoal"
        style={{ zIndex: 35 }}
      >
        {/* Carrousel mobile — révélé par le split, commence par Design & Build */}
        <ServicesMobileCarousel />

        {/* Vidéo + split Design & Build (desktop) */}
        <div className="hidden md:contents">
          {isDesktop && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
              src="/videos/vecteezy_unrecognizable-female-carpenter-or-furniture-designer_71265347.webm"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          <div className="absolute inset-0 z-0" style={{ backgroundColor: "rgba(35, 6, 6, 0.2)", mixBlendMode: "soft-light" }} />

          {/* Contenu DESIGN & BUILD — révélé par le split (z-5) */}
          <div className="absolute inset-0 z-[5] flex items-center justify-between px-4 sm:px-6 lg:px-[60px]">
            <div className="max-w-[480px]">
              <h2 className="text-[26px] md:text-[52px] lg:text-[55px] min-[1200px]:text-[64px] font-semibold uppercase leading-none tracking-tight text-cream mb-[40px] whitespace-nowrap">
                DESIGN & BUILD
              </h2>
              <p className="max-w-[460px] text-[14px] leading-relaxed text-cream mb-[25px]">
                Chaque espace est pensé dans ses moindres détails pour conjuguer esthétique et performance durable. Une vision cohérente, du premier trait jusqu'à la remise des clés.
              </p>
              <ComingSoonLink className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream border-b border-cream/50 pb-1">
                Lancer un projet
              </ComingSoonLink>
            </div>
            <div className="hidden min-[940px]:flex flex-col items-end gap-[18px]">
              {serviceNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const el = document.getElementById(item.id);
                    if (!el) return;
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-2 text-[14px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-cream ${
                    item.id === "design-build" ? "text-cream" : "text-cream/30"
                  }`}
                >
                  {item.id === "design-build" && (
                    <span className="w-2 h-2 rounded-full bg-taupe shrink-0" />
                  )}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panneaux charcoal (toujours opaques) — glissent au split (z-20), sur toutes tailles
            d'écran. `will-change: transform` force la promotion en couche composite : sans lui,
            ces deux grands aplats sont repeints à chaque frame du scroll. */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-charcoal z-20"
          style={{ width: "50%", x: leftX, willChange: "transform" }}
        />
        <motion.div
          className="absolute top-0 right-0 h-full bg-charcoal z-20"
          style={{ width: "50%", x: rightX, willChange: "transform" }}
        />

        {/* Slide 2 (charcoal + texte cream) — derrière slide 1, fade out global (z-30) */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ opacity: contentOpacity }}
        >
          <IntroSlide
            dark={true}
            phase1Opacity={phase1Opacity}
            phase1Y={phase1Y}
            phase2Visible={phase2Visible}
          />
        </motion.div>

        {/* Slide 1 (cream + texte charcoal) — masquée, décommenter pour réactiver
        <motion.div
          className="absolute inset-0 z-[31] pointer-events-none"
          style={{ opacity: slide1Opacity }}
        >
          <IntroSlide dark={false} />
        </motion.div>
        */}
      </div>
      {/*
        Marqueur "light" pour la navbar pendant la phase crème (slide 1 visible).
        Placé après le sticky div → il override "dark" quand les deux sont sous la navbar.
        Height = dissolveEnd = 45vh : une fois scrollé au-delà, seul "dark" s'applique.
      */}
      <div
        data-navbar-theme="light"
        aria-hidden
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ height: "45vh" }}
      />
    </div>
  );
}

// ─── AnimatedLetters ─────────────────────────────────────────────
// Révélation lettre par lettre (flou + fondu + légère remontée), mots groupés en
// nowrap pour ne jamais se couper au milieu — reproduit l'effet Framer de référence
// ("Full stories are.") appliqué ici sur plusieurs lignes avec un décalage continu.
function AnimatedLetters({ text, startIndex, inView }: { text: string; startIndex: number; inView: boolean }) {
  let idx = startIndex;
  return (
    <>
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((ch, li) => {
            const delay = idx * 0.025;
            idx += 1;
            return (
              <motion.span
                key={li}
                style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
                initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(10px)", y: 10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

// ─── IntroSlide ──────────────────────────────────────────────────
interface IntroSlideProps {
  dark: boolean;
  /** Sortie du temps 1 vers le haut, pilotée par le scroll. */
  phase1Opacity: MotionValue<number>;
  phase1Y: MotionValue<string>;
  /** Déclencheur du temps 2 (révélation lettre par lettre). */
  phase2Visible: boolean;
}

function IntroSlide({ dark, phase1Opacity, phase1Y, phase2Visible }: IntroSlideProps) {
  // Toutes les couleurs passent par des classes Tailwind tokenisées (cream / charcoal).
  const bgClass = dark ? "bg-charcoal" : "bg-cream";
  const textClass = dark ? "text-cream" : "text-charcoal";
  const subTextClass = dark ? "text-cream/70" : "text-charcoal/70";
  const lineBgClass = dark ? "bg-cream/40" : "bg-charcoal/40";

  const titleRef = useRef<HTMLHeadingElement>(null);
  // Révélation à l'entrée dans le viewport : fondu + légère remontée
  // (même principe que l'effet Framer de référence : opacity 0 → 1, translateY → 0)
  const titleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <div className={`absolute inset-0 flex flex-col ${bgClass}`}>
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6">
        {/* Titre en deux temps — les deux lignes se superposent pour occuper la même place.
            Temps 1 : "QUATRE EXPERTISES" apparaît (fondu + remontée) puis sort par le haut au scroll.
            Temps 2 : "UN SEUL INTERLOCUTEUR" se révèle lettre par lettre. */}
        <div ref={titleRef} className="relative w-full max-w-[900px]">
          {/* Temps 1 — la translation de sortie (scroll) et la remontée d'entrée (viewport)
              sont sur deux éléments imbriqués pour ne pas se écraser l'une l'autre. */}
          <motion.div style={{ opacity: phase1Opacity, y: phase1Y }}>
            <motion.h2
              className={`font-semibold tracking-tight text-[clamp(26px,6.7532vw_+_0.6753px,52px)] lg:text-[55px] min-[1200px]:text-[64px] ${textClass}`}
              style={{ lineHeight: "130%" }}
              initial={{ opacity: 0, y: 40 }}
              animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              QUATRE EXPERTISES
            </motion.h2>
          </motion.div>

          {/* Temps 2 — superposé, révélé une fois le temps 1 sorti */}
          <h2
            className={`absolute inset-0 flex items-center justify-center font-semibold tracking-tight text-[clamp(26px,6.7532vw_+_0.6753px,52px)] lg:text-[55px] min-[1200px]:text-[64px] ${textClass}`}
            style={{ lineHeight: "130%" }}
          >
            <AnimatedLetters text="UN SEUL INTERLOCUTEUR" startIndex={0} inView={phase2Visible} />
          </h2>
        </div>
      </div>
      {/* CTA bas — collé au bas du viewport */}
      <div className="relative flex flex-col items-center gap-2">
        <span className={`text-[11px] font-medium ${subTextClass}`}>
          GLISSER POUR DÉCOUVRIR
        </span>
        <div className={`w-px h-8 ${lineBgClass}`} />
      </div>
    </div>
  );
}
