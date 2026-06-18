"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Pill from "@/components/ui/Pill";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
  total: number;
}

const LEFT_IMAGES = [
  "/images/taibout1.webp",
  "/images/taibout2.webp",
  "/images/lepire1.webp",
  "/images/lempire2.webp",
  "/images/mail1.webp",
  "/images/mail2.webp",
];

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

export default function FeaturedWork({ items, total }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);
  const colRightRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lastStepRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const N = LEFT_IMAGES.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = container!.offsetHeight - vh;
      const scrolled = Math.max(0, -rect.top);

      // Phase 1 — clip-path reveal (premier screenful de scroll)
      const p_reveal = Math.min(1, scrolled / vh);
      const imgTop = 100 - p_reveal * 100;
      const contentBottom = p_reveal * 100;
      if (colLeftRef.current) {
        colLeftRef.current.style.clipPath = `polygon(0% ${imgTop.toFixed(3)}%, 100% ${imgTop.toFixed(3)}%, 100% 100%, 0% 100%)`;
      }
      if (colRightRef.current) {
        colRightRef.current.style.clipPath = `polygon(0% 0%, 100% 0%, 100% ${contentBottom.toFixed(3)}%, 0% ${contentBottom.toFixed(3)}%)`;
      }
      // Phase 2 — filmstrip parallax + text fade (après le reveal)
      const parallaxScrolled = scrolled - vh;
      const parallaxTotal = totalScroll - vh;
      const p = Math.min(0.9999, Math.max(0, parallaxScrolled / parallaxTotal));

      // Background transparent pendant le reveal, atteint l'opacité totale à mi-chemin du parallax
      const bgAlpha = p_reveal < 1 ? 0 : Math.min(1, p * 2);
      if (containerRef.current) {
        containerRef.current.style.backgroundColor = `rgba(243, 242, 237, ${bgAlpha.toFixed(3)})`;
      }

      imgRefs.current.forEach((el, i) => {
        if (!el) return;
        const y = (i - p * (N - 1)) * 100;
        el.style.transform = `translateY(${y.toFixed(3)}%)`;
      });

      const currentStep = Math.min(items.length - 1, Math.floor(p * items.length));

      if (currentStep !== lastStepRef.current) {
        const title = titleRef.current;
        const subtitle = subtitleRef.current;
        const desc = descRef.current;
        const counter = counterRef.current;

        if (title) title.style.opacity = "0";
        if (subtitle) subtitle.style.opacity = "0";
        if (desc) desc.style.opacity = "0";

        setTimeout(() => {
          setActiveIndex(currentStep);
          if (counter) counter.textContent = `${currentStep + 1}/${total}`;
          requestAnimationFrame(() => {
            if (title) title.style.opacity = "1";
            if (subtitle) subtitle.style.opacity = "1";
            if (desc) desc.style.opacity = "1";
          });
        }, 400);

        lastStepRef.current = currentStep;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items, total, N]);

  const item = items[activeIndex] ?? items[0];

  // 100vh reveal + scroll entre les projets
  const totalHeight = `${100 + items.length * 100 + 100}vh`;

  return (
    <>
      <div
        ref={containerRef}
        className="hidden md:block"
        style={{ position: "relative", height: totalHeight, zIndex: 69 }}
      >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          overflow: "hidden",
        }}
      >
        {/* Colonne gauche — reveal clip-path + filmstrip parallax */}
        <div
          ref={colLeftRef}
          style={{
            position: "relative",
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            willChange: "clip-path",
            overflow: "hidden",
          }}
        >
          {LEFT_IMAGES.map((src, i) => (
            <div
              key={src}
              ref={(el) => { imgRefs.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                willChange: "transform",
                transform: `translateY(${i * 100}%)`,
              }}
            >
              <Image
                src={src}
                alt={`réalisation ${i + 1}`}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          ))}
        </div>

        {/* Colonne droite — reveal clip-path + contenu avec fade */}
        <div
          ref={colRightRef}
          style={{
            position: "relative",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            willChange: "clip-path",
            background: "#F3F2ED",
            display: "flex",
            flexDirection: "column",
            padding: "60px 60px 80px 60px",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Pill variant="light">RÉALISATIONS</Pill>
            <span
              ref={counterRef}
              style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.12em", color: "rgba(28,26,24,0.4)", textTransform: "uppercase" }}
            >
              1/{total}
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <h2
              ref={titleRef}
              style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "64px", color: "#1C1A18", letterSpacing: "-0.02em", lineHeight: 1, margin: 0, transition: "opacity 1000ms ease", willChange: "opacity" }}
            >
              {item.title}
            </h2>
            <div style={{ marginTop: "50px" }}>
              <p
                ref={subtitleRef}
                style={{ fontSize: "18px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.25, color: "rgba(28,26,24,0.5)", margin: 0, transition: "opacity 1000ms ease", willChange: "opacity" }}
              >
                {item.tags.join(" • ")}
              </p>
              <p
                ref={descRef}
                style={{ marginTop: "20px", fontSize: "16px", color: "#1C1A18", maxWidth: "560px", lineHeight: 1.5 }}
              >
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
