"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
}

// Taille de référence (Figma) de la carte projet blanche — fixe, jamais redimensionnée
// texte-par-texte. Pour rentrer sur mobile, c'est toute la carte qui rétrécit d'un bloc
// via un transform scale() (cf. cardScale), donc les tailles de police (30px / 22px)
// restent inchangées en valeur absolue et rétrécissent proportionnellement avec le reste.
const CARD_W = 328;
const CARD_H = 418;
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

            {/* Carte projet blanche — taille fixe (Figma), rétrécit en bloc via scale() sur mobile
                (jamais via un redimensionnement du texte) */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${cardScale})`, transformOrigin: "center", width: CARD_W, height: CARD_H, background: "#fff", overflow: "hidden" }}>
              {/* divs (pas des <p>) : la règle globale mobile "p, li { font-size: 14px !important }"
                  ne doit pas s'appliquer ici — ces tailles (30px/22px) sont figées, quel que soit l'écran */}
              <div style={{ position: "absolute", left: "21.07%", top: "6.69%", width: "57.61%", textAlign: "center", color: "#1B2424", fontSize: "30px", fontWeight: 500, textTransform: "uppercase", lineHeight: 1.1 }}>
                {item.tags[0]}
                <br />
                {item.tags[1]}
              </div>
              <div style={{ position: "absolute", left: "5.84%", top: "33.45%", width: "88.15%", height: "51.3%" }}>
                <Image src={item.coverImage} alt="" fill className="object-cover" sizes="290px" />
              </div>
              <div style={{ position: "absolute", left: "50%", top: "87.04%", transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center", color: "#1B2424", fontSize: "22px", fontWeight: 500, textTransform: "capitalize" }}>
                {item.title.toLowerCase()}
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

            {/* Bloc image détail + description — centré */}
            {(() => {
              const isDark = !item.accentColor || item.accentColor !== "#F3F2ED";
              const textColor = isDark ? "#FFFFFF" : "#1B2424";
              return (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(353px, 78%)", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "353 / 350" }}>
                    {item.rightImage && (
                      <Image src={item.rightImage} alt="" fill className="object-cover" sizes="360px" />
                    )}
                  </div>
                  <p style={{ margin: 0, color: textColor, fontSize: "12px", fontWeight: 400, lineHeight: "18px" }}>
                    {item.description}
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
