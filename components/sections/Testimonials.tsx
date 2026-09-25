"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { testimonials, type TestimonialCard } from "@/data/testimonials";
import Pill from "@/components/ui/Pill";

// TODO : texte de témoignage masqué en attendant d'avoir de vrais témoignages
// (cf. data/testimonials.ts, quotes encore en Lorem ipsum) — seuls le titre
// (entreprise + adresse) restent affichés pour l'instant.
const SHOW_QUOTE = false;

const items = testimonials as TestimonialCard[];
const N = items.length;
// Liste triplée dans le DOM (technique classique du carrousel à boucle infinie) :
// tant que l'index logique reste dans le tiers du milieu ([N, 2N[), on peut le
// décaler de ±N sans qu'aucun changement ne soit visible (même photo N cases plus loin).
const tripled = [...items, ...items, ...items];

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADING = ["LEUR", "EXPÉRIENCE"];

// Seuils de breakpoint (mêmes que le reste du site : mobile < 470px, tablette 470–834px,
// desktop ≥ 835px — cf. AboutHistorySticky.tsx / Hero.tsx). Sert au mode d'opacité du
// coverflow (mobile garde un fondu plus large) — la largeur, elle, est fluide (cf. plus bas).
type Tier = "mobile" | "tablet" | "desktop";

function tierOf(width: number): Tier {
  if (width < 470) return "mobile";
  if (width < 835) return "tablet";
  return "desktop";
}

// Hauteur de carte responsive : fixe en desktop (référence 1920px) et fixe en
// tablette/mobile (référence ≤ 834px), interpolée fluidement entre les deux dans la zone
// intermédiaire (pas de palier brutal en rétrécissant l'écran).
const DESKTOP_REF_VW = 1920;
const TABLET_REF_VW = 834;
const DESKTOP_H = 500;

// Ratio des photos de témoignages (toutes au même format, 1054×1320 — cf.
// public/images/{haiku,coinshare,lemlist}). La largeur de la carte se déduit
// de ce ratio plutôt que d'être une valeur fluide indépendante : sinon, dès
// que la boîte n'a pas le même ratio que la photo, `object-cover` doit
// recadrer (et donc zoomer) pour remplir la largeur ET la hauteur — la photo
// ne montre alors plus qu'une fine tranche d'elle-même, agrandie. En calant la
// largeur sur ce ratio, la boîte épouse exactement la photo : elle prend toute
// la hauteur du conteneur sans recadrage superflu.
const PHOTO_ASPECT_RATIO = 1054 / 1320;

// FIXED_H choisie pour retrouver une largeur mobile d'environ 260px
// (MOBILE_TARGET_W ÷ PHOTO_ASPECT_RATIO) une fois ce ratio appliqué — assez
// étroite pour que les cartes voisines dépassent bien de chaque côté au lieu
// d'être presque entièrement masquées par la carte active.
const MOBILE_TARGET_W = 260;
const FIXED_H = MOBILE_TARGET_W / PHOTO_ASPECT_RATIO;

function fluidValue(viewportWidth: number, desktopValue: number, fixedValue: number) {
  if (viewportWidth >= DESKTOP_REF_VW) return desktopValue;
  if (viewportWidth <= TABLET_REF_VW) return fixedValue;
  const t = (viewportWidth - TABLET_REF_VW) / (DESKTOP_REF_VW - TABLET_REF_VW);
  return fixedValue + (desktopValue - fixedValue) * t;
}

function fluidCardHeight(viewportWidth: number) {
  return fluidValue(viewportWidth, DESKTOP_H, FIXED_H);
}

// Effet coverflow mobile — scale() par palier (1 / 0.85 / 0.7 / 0.65) selon la distance à
// la carte active, interpolé en continu entre les paliers pour un rendu fluide au drag.
function scaleFor(d: number) {
  const ad = Math.abs(d);
  if (ad <= 1) return 1 - ad * 0.15;
  if (ad <= 2) return 0.85 - (ad - 1) * 0.15;
  if (ad <= 3) return 0.7 - (ad - 2) * 0.05;
  return 0.65;
}

function opacityFor(d: number) {
  const ad = Math.abs(d);
  if (ad <= 3) return 1;
  if (ad <= 4) return 1 - (ad - 3);
  return 0;
}

// Géométrie d'une carte selon la distance `d` à l'index actif. Une seule taille de boîte
// pour toutes les cartes à un instant donné (pas de "centrale plus grande") : c'est le même
// cadre, juste rétréci visuellement via scale() selon le palier de distance. Desktop/tablet
// n'affichent que 3 cartes (centrale + 1 de chaque côté) ; mobile garde un fondu plus large
// (jusqu'à ~7 cartes visibles).
function cardGeometry(tier: Tier, width: number, height: number, d: number) {
  const scale = scaleFor(d);
  if (tier === "mobile") {
    return { width, height, scale, opacity: opacityFor(d) };
  }
  const ad = Math.abs(d);
  const opacity = ad <= 1 ? 1 : ad <= 1.35 ? 1 - (ad - 1) / 0.35 : 0;
  return { width, height, scale, opacity };
}

// Ramène l'index logique dans le tiers du milieu du triple-set ([N, 2N[)
function wrap(idx: number) {
  if (idx < N) return idx + N;
  if (idx >= 2 * N) return idx - N;
  return idx;
}

// Chevron du curseur personnalisé (survol gauche/droite du carrousel, indique le sens du drag)
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
  const [dragIndex, setDragIndex] = useState(N); // position logique continue dans le triple-set
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(DESKTOP_REF_VW);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(N);
  const dragMoved = useRef(false);
  const settleAnim = useRef<ReturnType<typeof animate> | null>(null);
  const [cursorInfo, setCursorInfo] = useState<{ x: number; y: number; side: "left" | "right" } | null>(null);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const calc = () => setViewportWidth(window.innerWidth);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const tier = tierOf(viewportWidth);
  const cardH = fluidCardHeight(viewportWidth);
  const cardW = cardH * PHOTO_ASPECT_RATIO;
  const step = cardW;
  const activeItem = items[active];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hasHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorInfo({ x, y, side: x < rect.width / 2 ? "left" : "right" });
  }

  // Anime dragIndex vers `target`, puis reboucle si besoin et met à jour la légende.
  // Toute animation de settle en cours est stoppée avant d'en lancer une nouvelle,
  // pour éviter que son onComplete ne réécrase l'état avec une cible obsolète.
  function settleTo(target: number) {
    settleAnim.current?.stop();
    settleAnim.current = animate(dragIndex, target, {
      type: "spring",
      stiffness: 300,
      damping: 32,
      onUpdate: (v) => setDragIndex(v),
      onComplete: () => {
        const wrapped = wrap(target);
        if (wrapped !== target) setDragIndex(wrapped);
        setActive(((Math.round(wrapped) % N) + N) % N);
      },
    });
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    settleAnim.current?.stop();
    setIsDragging(true);
    dragMoved.current = false;
    dragStartX.current = e.clientX;
    dragStartIndex.current = dragIndex;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore — arrive uniquement sur un pointeur déjà relâché, sans impact sur le drag.
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    const deltaPx = e.clientX - dragStartX.current;
    // Tolérance de 10px avant de considérer que c'est un drag : en dessous, une souris
    // ou un trackpad bouge de quelques pixels même sur un simple clic, et un seuil trop
    // bas (3px) bloquait alors le clic-pour-centrer sur les cartes latérales.
    if (Math.abs(deltaPx) > 10) dragMoved.current = true;
    let next = dragStartIndex.current - deltaPx / step;
    if (next < N) {
      next += N;
      dragStartIndex.current += N;
    } else if (next >= 2 * N) {
      next -= N;
      dragStartIndex.current -= N;
    }
    setDragIndex(next);
  }

  // Un pointerup sans déplacement est un simple clic : on laisse le onClick de la
  // carte gérer la sélection plutôt que de re-snapper ici (sinon les deux entrent
  // en conflit et le clic sur une carte latérale n'a aucun effet visible).
  function handlePointerUp() {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragMoved.current) settleTo(Math.round(dragIndex));
  }

  return (
    <section data-navbar-theme="light" className="bg-cream pt-[100px] lg:pt-[160px] pb-[100px] lg:pb-[160px] min-[470px]:px-[32px]">

      {/* Eyebrow — puce des deux côtés du label */}
      <div className="flex justify-center mb-4">
        <Pill dotSide="both">TÉMOIGNAGES</Pill>
      </div>

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
        {/* Carrousel coverflow draggable — liste triplée pour la boucle infinie */}
        <div
          className="relative w-full select-none touch-pan-y overflow-hidden"
          style={{
            height: cardH,
            paddingTop: 16,
            paddingBottom: 16,
            cursor: hasHover ? "none" : isDragging ? "grabbing" : "grab",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            handlePointerUp();
            setCursorInfo(null);
          }}
          onPointerCancel={handlePointerUp}
          onMouseMove={handleMouseMove}
          onClick={(e) => {
            // Le pointerdown pose setPointerCapture() sur CE conteneur (pour le drag),
            // ce qui redirige aussi le click résultant vers lui plutôt que vers la carte
            // visuellement cliquée (comportement documenté de la Pointer Events spec) : un
            // onClick posé sur chaque carte ne reçoit donc jamais de vrai clic utilisateur.
            // On retrouve la carte réellement sous le curseur via elementFromPoint, qui fait
            // un hit-test frais indépendant de cette redirection.
            if (dragMoved.current) return;
            const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
            const cardEl = el?.closest<HTMLElement>("[data-card-index]");
            if (!cardEl) return;
            const i = Number(cardEl.dataset.cardIndex);
            if (Number.isNaN(i)) return;
            if (Math.round(dragIndex) !== i) settleTo(i);
          }}
        >
          {tripled.map((t, i) => {
            const d = i - dragIndex;
            const geo = cardGeometry(tier, cardW, cardH, d);
            return (
              <div
                key={`${t.id}-${i}`}
                data-card-index={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: geo.width,
                  height: geo.height,
                  transform: `translate(-50%, -50%) translateX(${d * step}px) scale(${geo.scale})`,
                  opacity: geo.opacity,
                  zIndex: Math.round(100 - Math.abs(d) * 10),
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={t.photo}
                    alt={t.author}
                    fill
                    draggable={false}
                    className="object-cover pointer-events-none"
                    sizes="(min-width: 835px) 667px, 260px"
                  />
                </div>
              </div>
            );
          })}

          {/* Curseur personnalisé — chevron qui suit la souris, indique le sens du drag */}
          {hasHover && cursorInfo && (
            <div
              className="absolute z-[200] pointer-events-none"
              style={{ left: cursorInfo.x, top: cursorInfo.y, transform: "translate(-50%, -50%)", mixBlendMode: "difference" }}
            >
              <CursorArrow side={cursorInfo.side} />
            </div>
          )}
        </div>

        {/* Légende — titre (et texte, tant que SHOW_QUOTE est actif) révélés en
            fondu/masque (montée depuis le bas), rejoués à chaque changement de
            témoignage actif */}
        <div className="relative mt-[40px] w-full" style={{ minHeight: SHOW_QUOTE ? 149 : undefined }}>
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
            {SHOW_QUOTE && (
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
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
