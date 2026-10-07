"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Hero en 2 temps (d'après la maquette « Nouveau projet — Hero ») : la photo reste collée (sticky)
// pendant que la section fait 155svh.
// 1. Écran 1 : le titre, bas gauche, se révèle ligne par ligne (masque qui remonte) ; indication
//    « Défiler » en bas à droite, qui disparaît dès le scroll.
// 2. Au scroll : un dégradé sombre monte du bas, et le paragraphe (à droite) se « remplit » lettre
//    par lettre (opacité 22 % → 100 %) ; bouton en dessous.

interface HeroProps {
  /** Lignes du titre (h1) : chaque ligne se révèle l'une après l'autre. */
  headingLines: readonly string[];
  /** Paragraphe d'accroche, rempli lettre par lettre au scroll. */
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
  scrollHint?: string;
  image?: string;
  video?: string;
}

const ARROW = "M11 4 6.9 8H4.5L8 4.8H0V3.2h8L4.5 0h2.4z";

// Texte qui se remplit lettre par lettre : la progression va de 0 (le bloc entre par le bas) à 1
// (il atteint le milieu de l'écran).
function ScrollFill({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-c]"));
    if (reduced) {
      chars.forEach((c) => (c.style.opacity = "1"));
      return;
    }
    const update = () => {
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.5 + r.height)));
      const lit = prog * (chars.length + 10);
      chars.forEach((c, i) => {
        c.style.opacity = (0.22 + 0.78 * Math.min(1, Math.max(0, (lit - i) / 10))).toFixed(3);
      });
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    // div (et non p) : la règle globale `p { font-size: 14px !important }` sous 768px.
    <div ref={ref} className="hero-fill" aria-label={text}>
      {text.split(" ").map((word, w) => (
        <React.Fragment key={w}>
          {w > 0 && " "}
          <span className="hero-word" aria-hidden="true">
            {Array.from(word).map((ch, i) => (
              <span key={i} data-c className="hero-char">
                {ch}
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Hero({ headingLines, text, ctaLabel, ctaHref, scrollHint, image, video }: HeroProps) {
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Double rAF : laisse le navigateur peindre l'état initial (lignes masquées) avant la transition.
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setReady(true));
    });
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      data-navbar-theme="dark"
      className={`relative h-[155svh] overflow-clip bg-[#111] text-cream${ready ? " hero-ready" : ""}`}
    >
      {/* Média collé en haut pendant toute la hauteur du hero */}
      <div className="sticky top-0 h-[100svh] overflow-hidden" aria-hidden="true">
        {video ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
            <source src={video} type={video.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          </video>
        ) : image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover object-left min-[835px]:object-[100%_60%]"
            sizes="100vw"
          />
        ) : null}
      </div>

      {/* Écran 1 : titre (bas gauche) + indication de défilement (bas droite) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[100svh] items-end">
        <div className="hero-container relative w-full" style={{ paddingBottom: "calc(24 * var(--u))" }}>
          <h1 className="hero-heading" aria-label={headingLines.join(" ")}>
            {headingLines.map((line) => (
              <span key={line} className="hero-line" aria-hidden="true">
                <span className="hero-line-inner">{line}</span>
              </span>
            ))}
          </h1>
        </div>
        {scrollHint && (
          <span
            className="hero-scroll-hint absolute bottom-[calc(48*var(--u))] right-[calc(40*var(--u))] max-[700px]:hidden"
            style={{ opacity: ready && !scrolled ? 1 : 0, transitionDelay: ready && !scrolled ? "0.9s" : "0s" }}
            aria-hidden="true"
          >
            {scrollHint}
            <span className="hero-mouse">
              <svg viewBox="0 0 11 8" aria-hidden="true">
                <path fill="currentColor" d={ARROW} />
              </svg>
            </span>
          </span>
        )}
      </div>

      {/* Écran 2 : dégradé + paragraphe rempli au scroll + bouton (colonne à droite) */}
      <div className="absolute inset-x-0 top-[55svh] z-10 flex h-[100svh] items-end">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-b from-[rgba(10,14,12,0)] to-[rgba(10,14,12,0.55)]"
        />
        <div className="hero-container relative w-full" style={{ paddingBottom: "12svh" }}>
          <div className="ml-auto flex w-[min(560px,100%)] flex-col gap-[36px]">
            <ScrollFill text={text} />
            {ctaLabel && (
              <a href={ctaHref} className="group inline-flex items-center gap-[10px] self-start text-cream">
                <span className="border-b border-current pb-[3px] text-[16px]">{ctaLabel}</span>
                <span className="relative block h-[22px] w-[31px] overflow-hidden rounded-full bg-cream text-charcoal" aria-hidden="true">
                  <svg viewBox="0 0 11 8" className="absolute inset-0 m-auto h-[8px] w-[11px] transition-[translate,scale] duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-[150%] group-hover:scale-0">
                    <path fill="currentColor" d={ARROW} />
                  </svg>
                  <svg viewBox="0 0 11 8" className="absolute inset-0 m-auto h-[8px] w-[11px] -translate-x-[150%] scale-0 transition-[translate,scale] duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0 group-hover:scale-100">
                    <path fill="currentColor" d={ARROW} />
                  </svg>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
