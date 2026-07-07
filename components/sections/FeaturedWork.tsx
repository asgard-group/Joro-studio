"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Pill from "@/components/ui/Pill";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
  total: number;
}

export function MobileFeaturedWork({ items }: { items: WorkItem[] }) {
  return (
    <div className="md:hidden flex flex-col" style={{ position: "relative", zIndex: 70 }}>
      {items.map((item, i) => (
        <div key={item.id} className="flex flex-col">
          <div className="relative w-full" style={{ height: "410px" }}>
            <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="100vw" />
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <Pill variant="dark">NOS RÉALISATIONS</Pill>
              <span className="text-white font-medium" style={{ fontSize: "13px", letterSpacing: "0.1em" }}>
                {i + 1} / {items.length}
              </span>
            </div>
          </div>
          <div className="bg-cream px-5 pt-[50px] pb-[80px]">
            <h2 className="font-semibold uppercase text-charcoal leading-none mb-3" style={{ fontSize: "26px", letterSpacing: "-0.01em" }}>
              {item.title}
            </h2>
            <p className="font-medium uppercase text-charcoal/50 mb-[20px]" style={{ fontSize: "12px", letterSpacing: "0.08em" }}>
              {item.tags.join(" • ")}
            </p>
            <p className="text-charcoal leading-relaxed" style={{ fontSize: "14px" }}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
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
                      <h2 style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(28px, 3.5vw, 56px)", color: textColor, letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
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
