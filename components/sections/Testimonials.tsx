"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { testimonials, type TestimonialCard } from "@/data/testimonials";

const items = testimonials as TestimonialCard[];
const N = items.length;

// Rangée de 3 photos centrées sur un même axe horizontal : la centrale (point focal) est
// nettement plus grande, les deux latérales l'encadrent à dimensions égales, avec 50px
// entre chacune. Les latérales sont obtenues par un scale() depuis le centre, ce qui
// conserve l'alignement vertical tout en donnant des hauteurs différentes.
const CENTER_W = 626;
const CENTER_H = 500;
const SIDE_SCALE = 532 / 626; // = 425/500 = 0,85 → photos latérales de 532 × 425
const GAP = 50;
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
  const [centerW, setCenterW] = useState(CENTER_W);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cursorInfo, setCursorInfo] = useState<{ x: number; y: number; side: "left" | "right" } | null>(null);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    // La rangée complète (532 + 50 + 626 + 50 + 532 = 1790) doit tenir à l'écran ;
    // en dessous, tout rétrécit proportionnellement (les dimensions données sont des maximums).
    const ROW_W = CENTER_W * (1 + 2 * SIDE_SCALE) + GAP * 2;
    const calc = () => {
      const available = window.innerWidth - 48;
      setCenterW(Math.round(CENTER_W * Math.min(1, available / ROW_W)));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // Échelle globale déduite de la largeur de la photo centrale
  const s = centerW / CENTER_W;
  const centerH = Math.round(CENTER_H * s);
  const gap = GAP * s;
  const sideW = centerW * SIDE_SCALE;
  // Distance entre le centre de la photo centrale et celui d'une photo latérale
  const STEP = centerW / 2 + gap + sideW / 2;

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
        {/* Rangée de 3 photos — centrale plus grande, latérales alignées par le haut */}
        <div
          ref={wrapRef}
          className="relative w-full flex justify-center overflow-hidden"
          style={{ height: centerH }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursorInfo(null)}
        >
          {items.map((t, i) => {
            const off = offsetOf(i, active);
            const abs = Math.abs(off);
            const isActive = abs === 0;
            // Centrale au milieu, latérales à ±STEP ; les suivantes attendent hors champ
            const x =
              abs === 0
                ? 0
                : Math.sign(off) * (STEP + (abs - 1) * (sideW + gap));
            return (
              <div
                key={t.id}
                className="absolute top-0 left-1/2 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
                style={{
                  width: centerW,
                  height: centerH,
                  transform: `translateX(-50%) translateX(${x}px) scale(${isActive ? 1 : SIDE_SCALE})`,
                  transformOrigin: "center", // scale depuis le centre → les 3 photos partagent le même axe horizontal
                  opacity: abs <= 1 ? 1 : 0,
                  zIndex: isActive ? 10 : 5 - abs,
                }}
              >
                {/* Cadre — sa couleur (taupe) n'apparaît que sur la photo centrale,
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
                      sizes="480px"
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
