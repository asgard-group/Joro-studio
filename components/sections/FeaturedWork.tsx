"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
}

// Dimensions exactes de la maquette Figma. Les bordures (150/70/20) sont identiques aux
// deux formats ; seules la taille de la carte et les tailles de texte changent au point de
// bascule 1200px (à partir duquel le panneau droit apparaît aussi).
const BREAKPOINT = 1200;
const BORDER_TOP = 150;
const BORDER_BOTTOM = 70;
const BORDER_SIDE = 20;
const ZONE_PADDING = 20;
const CARD_MARGIN = 24; // marge de sécurité de chaque côté avant de devoir réduire

const CARD_DESKTOP = { w: 350, h: 450, titleSize: 32, titleLineHeight: 44.8, nameSize: 24, nameLineHeight: 45.6 };
const CARD_MOBILE = { w: 280, h: 400, titleSize: 24, titleLineHeight: 33.6, nameSize: 16, nameLineHeight: 30.4 };

export default function FeaturedWork({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Pour chaque item : { left, right }
  const itemRefs = useRef<Array<{ left: HTMLDivElement | null; right: HTMLDivElement | null }>>(
    items.map(() => ({ left: null, right: null }))
  );
  const [isWideLayout, setIsWideLayout] = useState(false);
  const [cardScale, setCardScale] = useState(1);
  const card = isWideLayout ? CARD_DESKTOP : CARD_MOBILE;

  useEffect(() => {
    // ≥1200px : carte "desktop" + panneau droit visible, colonne gauche = 50vw.
    // <1200px : carte "mobile" (plus petite, textes réduits), panneau droit masqué, colonne pleine largeur.
    function calc() {
      const wide = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
      setIsWideLayout(wide);
      const columnWidth = wide ? window.innerWidth / 2 : window.innerWidth;
      const available = columnWidth - CARD_MARGIN * 2;
      const w = wide ? CARD_DESKTOP.w : CARD_MOBILE.w;
      setCardScale(Math.min(1, available / w));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);

      items.forEach((_, i) => {
        const refs = itemRefs.current[i];
        if (!refs?.left || !refs?.right) return;

        // Chaque item se révèle pendant sa tranche de scroll [i*vh, (i+1)*vh]
        const itemScrolled = scrolled - i * vh;
        const p = Math.min(1, Math.max(0, itemScrolled / vh));

        const imgTop = 100 - p * 100;
        const contentBottom = p * 100;

        refs.left.style.clipPath = `polygon(0% ${imgTop.toFixed(3)}%, 100% ${imgTop.toFixed(3)}%, 100% 100%, 0% 100%)`;
        refs.right.style.clipPath = `polygon(0% 0%, 100% 0%, 100% ${contentBottom.toFixed(3)}%, 0% ${contentBottom.toFixed(3)}%)`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  // (N+1) * 100vh : N tranches de reveal + 1vh pour rester visible à la fin
  const totalHeight = `${(items.length + 1) * 100}vh`;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: totalHeight, zIndex: 69 }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className="grid grid-cols-1 min-[1200px]:grid-cols-2"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            zIndex: i + 1,
          }}
        >
          {/* Colonne gauche — photo */}
          <div
            ref={(el) => { itemRefs.current[i].left = el; }}
            style={{
              position: "relative",
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              willChange: "clip-path",
              overflow: "hidden",
            }}
          >
            {/* Photo plein fond */}
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover"
              sizes="50vw"
            />

            {/* Carte projet blanche — Figma : 350 × 450 (≥1200px) / 280 × 400 (<1200px),
                rétrécit en bloc via scale() en cas de manque de place (jamais le texte) */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${cardScale})`,
                transformOrigin: "center",
                width: card.w,
                height: card.h,
                background: "#fff",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0px 2px 8px -2px rgba(38, 34, 30, 0.08), 0px 30px 70px -25px rgba(38, 34, 30, 0.28)",
              }}
            >
              {/* Zone haute — tags centrés dans la bordure haute (150px, padding 20)
                  (divs, pas des <p> : la règle globale mobile "p, li { font-size: 14px !important }"
                  ne doit pas s'appliquer ici — ces tailles Figma sont figées, quel que soit l'écran) */}
              <div style={{ alignSelf: "stretch", height: BORDER_TOP, padding: ZONE_PADDING, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", whiteSpace: "nowrap", color: "black", fontSize: card.titleSize, fontWeight: 400, textTransform: "uppercase", lineHeight: `${card.titleLineHeight}px` }}>
                  {item.tags[0]}
                  <br />
                  {item.tags[1]}
                </div>
              </div>

              {/* Photo — bordures 20px sur les côtés, 150 en haut / 70 en bas */}
              <div style={{ position: "relative", width: card.w - BORDER_SIDE * 2, height: card.h - BORDER_TOP - BORDER_BOTTOM, margin: "0 auto", flexShrink: 0 }}>
                <Image src={item.coverImage} alt="" fill className="object-cover" sizes={`${card.w - BORDER_SIDE * 2}px`} />
              </div>

              {/* Zone basse — nom du projet centré dans la bordure basse (70px, padding 20) */}
              <div style={{ alignSelf: "stretch", height: BORDER_BOTTOM, paddingLeft: ZONE_PADDING, paddingRight: ZONE_PADDING, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ whiteSpace: "nowrap", textAlign: "center", color: "black", fontSize: card.nameSize, fontWeight: 400, lineHeight: `${card.nameLineHeight}px`, textTransform: "capitalize" }}>
                  {item.title.toLowerCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — fond couleur + image détail + description (masquée en dessous de 1200px) */}
          <div
            ref={(el) => { itemRefs.current[i].right = el; }}
            className="hidden min-[1200px]:block"
            style={{
              position: "relative",
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              willChange: "clip-path",
              overflow: "hidden",
            }}
          >
            {/* Fond couleur */}
            <div style={{ position: "absolute", inset: 0, background: item.accentColor ?? "#96461F" }} />

            {/* Bloc image détail + description — centré (Figma : image 400 × 400, gap 15) */}
            {(() => {
              const isDark = !item.accentColor || item.accentColor !== "#F3F2ED";
              const textColor = isDark ? "#FFFFFF" : "rgba(0, 0, 0, 0.6)";
              return (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(400px, 78%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
                  {/* Image détail — carrée 400 × 400 */}
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
                    {item.rightImage && (
                      <Image src={item.rightImage} alt="" fill className="object-cover" sizes="400px" />
                    )}
                  </div>
                  {/* Description — 12px, limitée à 3 lignes */}
                  <p
                    style={{
                      margin: 0,
                      alignSelf: "stretch",
                      color: textColor,
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "19.2px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                    }}
                  >
                    {item.shortDescription ?? item.description}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
