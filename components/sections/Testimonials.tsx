"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { testimonials, type TestimonialCard } from "@/data/testimonials";

const items = testimonials as TestimonialCard[];
const N = items.length;

// Disposition « coverflow » selon l'écart à la carte active (valeurs de la maquette,
// exprimées en fraction de la largeur de carte pour rester responsive).
const FACTOR_X = [0, 1.03, 1.911, 2.691, 3.371, 3.952, 4.532, 5.112];
const SCALE = [1, 0.85, 0.75, 0.65, 0.55, 0.55, 0.55, 0.55];
const Z = [10, 5, 3, 2, 1, 1, 1, 1];

const BASE_W = 330;
const RATIO = 460 / 330;
const EASE = [0.16, 1, 0.3, 1] as const;

// Écart signé le plus court autour de l'anneau (carrousel bouclé)
function offsetOf(i: number, active: number) {
  let off = i - active;
  if (off > N / 2) off -= N;
  else if (off < -N / 2) off += N;
  return off;
}

const HEADING = ["AVIS", "CLIENT"];

// Chevron du curseur personnalisé (survol gauche/droite du coverflow)
function CursorArrow({ side }: { side: "left" | "right" }) {
  const points = side === "left" ? "16,4 6,20 16,36" : "8,4 18,20 8,36";
  return (
    <svg width="32" height="54" viewBox="0 0 24 40" fill="none">
      <polyline points={points} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [cardW, setCardW] = useState(BASE_W);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cursorInfo, setCursorInfo] = useState<{ x: number; y: number; side: "left" | "right" } | null>(null);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const calc = () => setCardW(Math.min(BASE_W, Math.round(window.innerWidth * 0.62)));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const cardH = Math.round(cardW * RATIO);
  const prev = () => setActive((a) => (a - 1 + N) % N);
  const next = () => setActive((a) => (a + 1) % N);
  const activeItem = items[active];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hasHover || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorInfo({ x, y, side: x < rect.width / 2 ? "left" : "right" });
  }

  return (
    <section data-navbar-theme="light" className="bg-cream pt-[100px] lg:pt-[160px] pb-[100px] lg:pb-[160px]">

      {/* Titre — révélé mot par mot (montée depuis le bas) */}
      <h2 ref={headingRef} className="text-center mb-[40px] lg:mb-[60px] px-[20px] font-semibold uppercase text-charcoal text-[36px] sm:text-[52px] lg:text-[64px] leading-none tracking-tight">
        {HEADING.map((word, i) => (
          <span key={word} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block whitespace-nowrap"
              initial={{ y: "100%" }}
              animate={headingInView ? { y: "0%" } : { y: "100%" }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
            >
              {word}&nbsp;
            </motion.span>
          </span>
        ))}
      </h2>

      <div className="relative flex flex-col items-center w-full">
        {/* Coverflow */}
        <div
          ref={wrapRef}
          className="relative w-full flex items-center justify-center overflow-hidden"
          style={{ height: cardH }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursorInfo(null)}
        >
          {items.map((t, i) => {
            const off = offsetOf(i, active);
            const d = Math.min(Math.abs(off), FACTOR_X.length - 1);
            const x = Math.sign(off) * cardW * FACTOR_X[d];
            const isActive = off === 0;
            return (
              <div
                key={t.id}
                className="absolute transition-transform duration-500 origin-center ease-[cubic-bezier(0.77,0,0.175,1)]"
                style={{ transform: `translateX(${x}px) scale(${SCALE[d]})`, zIndex: Z[d], width: cardW, height: cardH }}
              >
                {/* Cadre — sa couleur (taupe) n'apparaît que sur la carte active,
                    révélée par le léger retrait de l'image (scale 0.9) ci-dessous */}
                <div className="relative w-full h-full overflow-hidden bg-taupe">
                  <div
                    className="relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
                    style={{ transform: isActive ? "scale(0.9)" : "scale(1)" }}
                  >
                    <Image
                      src={t.photo}
                      alt={t.author}
                      fill
                      className="object-cover"
                      sizes="330px"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Zones cliquables gauche/droite pour naviguer — curseur personnalisé (chevron) sur pointeur fin */}
          <button
            type="button"
            aria-label="Témoignage précédent"
            onClick={prev}
            className={`absolute left-0 top-0 w-1/2 h-full z-20 ${hasHover ? "" : "cursor-pointer"}`}
            style={hasHover ? { cursor: "none" } : undefined}
          />
          <button
            type="button"
            aria-label="Témoignage suivant"
            onClick={next}
            className={`absolute right-0 top-0 w-1/2 h-full z-20 ${hasHover ? "" : "cursor-pointer"}`}
            style={hasHover ? { cursor: "none" } : undefined}
          />

          {/* Curseur personnalisé — chevron qui suit la souris, mix-blend-mode pour rester visible sur toute image */}
          {hasHover && cursorInfo && (
            <div
              className="absolute z-30 pointer-events-none"
              style={{ left: cursorInfo.x, top: cursorInfo.y, transform: "translate(-50%, -50%)", mixBlendMode: "difference" }}
            >
              <CursorArrow side={cursorInfo.side} />
            </div>
          )}
        </div>

        {/* Légende — titre et texte révélés en fondu/masque (montée depuis le bas),
            rejoués à chaque changement de témoignage actif */}
        <div className="relative mt-[40px] w-full" style={{ minHeight: 149 }}>
          <div className="max-w-[464px] flex flex-col gap-y-[16px] px-[20px] mx-auto absolute left-0 right-0 top-0 text-center">
            <h3 className="overflow-hidden uppercase tracking-wider text-charcoal text-[14px] font-medium">
              <motion.span
                key={`title-${active}`}
                className="block"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: "0%" }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {activeItem.company}
                {activeItem.location ? ` — ${activeItem.location}` : ""}
              </motion.span>
            </h3>
            <div className="overflow-hidden">
              <motion.p
                key={`quote-${active}`}
                className="text-charcoal/80 text-[14px] leading-[1.4] whitespace-pre-line"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: "0%" }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
              >
                {activeItem.quote}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
