"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
}

// Dimensions exactes de la maquette Figma : vignette 350 × 450, bordures blanches
// 150 (haut) / 70 (bas) / 20 (côtés) → photo de 310 × 230.
// Taille fixe, jamais redimensionnée texte-par-texte : pour rentrer sur mobile, c'est toute
// la carte qui rétrécit d'un bloc via un transform scale() (cf. cardScale), donc les tailles
// de police restent inchangées et rétrécissent proportionnellement avec le reste.
const CARD_W = 350;
const CARD_H = 450;
const BORDER_TOP = 150;
const BORDER_BOTTOM = 70;
const BORDER_SIDE = 20;
const ZONE_PADDING = 20;
const CARD_MARGIN = 24; // marge de sécurité de chaque côté avant de devoir réduire

export default function FeaturedWork({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Pour chaque item : { left, right }
  const itemRefs = useRef<Array<{ left: HTMLDivElement | null; right: HTMLDivElement | null }>>(
    items.map(() => ({ left: null, right: null }))
  );
  const [cardScale, setCardScale] = useState(1);

  useEffect(() => {
    function calcScale() {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const columnWidth = isDesktop ? window.innerWidth / 2 : window.innerWidth;
      const available = columnWidth - CARD_MARGIN * 2;
      setCardScale(Math.min(1, available / CARD_W));
    }
    calcScale();
    window.addEventListener("resize", calcScale);
    return () => window.removeEventListener("resize", calcScale);
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
          className="grid grid-cols-1 md:grid-cols-2"
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

            {/* Carte projet blanche — 350 × 450 (Figma), rétrécit en bloc via scale() sur mobile
                (jamais via un redimensionnement du texte) */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${cardScale})`,
                transformOrigin: "center",
                width: CARD_W,
                height: CARD_H,
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
                <div style={{ textAlign: "center", whiteSpace: "nowrap", color: "black", fontSize: "32px", fontWeight: 400, textTransform: "uppercase", lineHeight: "44.8px" }}>
                  {item.tags[0]}
                  <br />
                  {item.tags[1]}
                </div>
              </div>

              {/* Photo — 310 × 230 (bordures 20px sur les côtés, 150 en haut / 70 en bas) */}
              <div style={{ position: "relative", width: CARD_W - BORDER_SIDE * 2, height: CARD_H - BORDER_TOP - BORDER_BOTTOM, margin: "0 auto", flexShrink: 0 }}>
                <Image src={item.coverImage} alt="" fill className="object-cover" sizes="310px" />
              </div>

              {/* Zone basse — nom du projet centré dans la bordure basse (70px, padding 20) */}
              <div style={{ alignSelf: "stretch", height: BORDER_BOTTOM, paddingLeft: ZONE_PADDING, paddingRight: ZONE_PADDING, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ whiteSpace: "nowrap", textAlign: "center", color: "black", fontSize: "24px", fontWeight: 400, lineHeight: "45.6px", textTransform: "capitalize" }}>
                  {item.title.toLowerCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — fond couleur + image détail + description (masquée sur mobile) */}
          <div
            ref={(el) => { itemRefs.current[i].right = el; }}
            className="hidden md:block"
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
