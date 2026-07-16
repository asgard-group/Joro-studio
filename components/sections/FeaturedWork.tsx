"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Pill from "@/components/ui/Pill";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
}

export function MobileFeaturedWork({ items }: { items: WorkItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>(items.map(() => null));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);

      items.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (!card) return;

        // Chaque carte se révèle en entier (photo + panneau) du bas vers le haut, pendant sa tranche de scroll [i*vh, (i+1)*vh]
        const itemScrolled = scrolled - i * vh;
        const p = Math.min(1, Math.max(0, itemScrolled / vh));
        const topInset = 100 - p * 100;

        card.style.clipPath = `polygon(0% ${topInset.toFixed(3)}%, 100% ${topInset.toFixed(3)}%, 100% 100%, 0% 100%)`;
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
      id="nos-realisations-mobile"
      ref={containerRef}
      className="md:hidden -mt-[200vh]"
      style={{ position: "relative", height: totalHeight, zIndex: 69 }}
    >
      {items.map((item, i) => {
        const isDark = item.accentColor && item.accentColor !== "#F3F2ED";
        const textColor = isDark ? "#F3F2ED" : "#1C1A18";
        const subColor = isDark ? "rgba(243,242,237,0.55)" : "rgba(28,26,24,0.45)";

        return (
          <div
            key={item.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="mobile-work-card"
            style={{
              position: "sticky",
              top: 0,
              width: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              gap: "50px",
              padding: "0 20px 20px 20px",
              zIndex: i + 1,
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              willChange: "clip-path",
            }}
          >
            {/* Photo plein fond */}
            <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="100vw" />

            {/* Panneau couleur */}
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                alignSelf: "stretch",
                gap: "20px",
                padding: "26px 20px",
                background: item.accentColor ?? "#F3F2ED",
              }}
            >
              <Pill variant={isDark ? "dark" : "light"}>RÉALISATIONS</Pill>

              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", width: "100%" }}>
                <h2 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "clamp(26px, 8vw, 34px)", color: textColor, letterSpacing: "-0.01em", lineHeight: 1, margin: 0 }}>
                  {item.title}
                </h2>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  {item.tags.map((tag) => (
                    <p key={tag} style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: subColor, margin: 0, lineHeight: 1.7 }}>
                      {tag}
                    </p>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: "13px", color: textColor, lineHeight: 1.6, margin: 0 }}>
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FeaturedWork({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Pour chaque item : { left, right }
  const itemRefs = useRef<Array<{ left: HTMLDivElement | null; right: HTMLDivElement | null }>>(
    items.map(() => ({ left: null, right: null }))
  );

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
      className="hidden md:block"
      style={{ position: "relative", height: totalHeight, zIndex: 69 }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
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
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>

          {/* Colonne droite — photo plein fond + texte en bas */}
          <div
            ref={(el) => { itemRefs.current[i].right = el; }}
            style={{
              position: "relative",
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              willChange: "clip-path",
              overflow: "hidden",
            }}
          >
            {/* Photo de fond */}
            {item.rightImage && (
              <Image
                src={item.rightImage}
                alt=""
                fill
                className="object-cover"
                sizes="50vw"
              />
            )}
            {!item.rightImage && (
              <div style={{ position: "absolute", inset: 0, background: item.accentColor ?? "#1C1A18" }} />
            )}

            {/* Container texte — bloc solide ancré en bas */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: item.accentColor ?? "#F3F2ED",
              margin: "0 30px 30px",
              padding: "32px 40px 40px",
            }}>
              <div style={{ marginBottom: "20px" }}>
                <Pill variant={item.accentColor && item.accentColor !== "#F3F2ED" ? "dark" : "light"}>RÉALISATIONS</Pill>
              </div>

              {(() => {
                const isDark = item.accentColor && item.accentColor !== "#F3F2ED";
                const textColor = isDark ? "#F3F2ED" : "#1C1A18";
                const subColor = isDark ? "rgba(243,242,237,0.55)" : "rgba(28,26,24,0.45)";
                return (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "25px", marginBottom: "16px" }}>
                      <h2 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "clamp(28px, 3.5vw, 56px)", color: textColor, letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
                        {item.title}
                      </h2>
                      <div style={{ flexShrink: 0, textAlign: "left" }}>
                        {item.tags.map((tag) => (
                          <p key={tag} style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: subColor, margin: 0, lineHeight: 1.8 }}>
                            {tag}
                          </p>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", color: textColor, maxWidth: "100%", lineHeight: 1.6, margin: 0 }}>
                      {item.description}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
