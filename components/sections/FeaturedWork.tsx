"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { WorkItem } from "@/types";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

interface ParallaxImgProps {
  src: string;
  alt: string;
  sizes: string;
  height: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function ParallaxImg({ src, alt, sizes, height, className = "", style, children }: ParallaxImgProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ height, ...style }}>
      <motion.div className="absolute inset-x-0" style={{ y, top: "-8%", height: "116%" }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
      </motion.div>
      {children}
    </div>
  );
}

interface Props {
  items: WorkItem[];
}

interface CaptionBarProps {
  title: string;
  subtitle: string;
}

function CaptionBar({ title, subtitle }: CaptionBarProps) {
  return (
    <div className="flex justify-between items-start pb-[6px] border-b border-[#BAB6AA]/75">
      <span
        style={{ fontSize: "24px", fontWeight: 500, color: "#1C2626" }}
      >
        {title}
      </span>
      <span
        style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.06em", color: "#1C2626" }}
        className="shrink-0 ml-4"
      >
        {subtitle}
      </span>
    </div>
  );
}

export default function FeaturedWork({ items }: Props) {
  const item0 = items[0];
  const item1 = items[1];
  const item2 = items[2];

  return (
    <section
      data-navbar-theme="light"
      className="bg-[#F3F2ED] py-[200px] lg:pb-[100px] px-4 sm:px-6 lg:px-[60px]"
    >
      {/* Header block */}
      <div className="flex flex-col gap-9 mb-9">
        <p
          style={{
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#1C2626",
          }}
        >
          NOS RÉALISATIONS
        </p>
        <h2
          className="text-[32px] lg:text-[46px]"
          style={{ fontWeight: 600, color: "#1C2626", lineHeight: 1.15 }}
        >
          Une réflexion architecturale
          <br />
          au cœur de chaque projet
        </h2>
      </div>

      {/* Row 1 */}
      <div className="hidden lg:flex justify-between items-start gap-0">
        {/* LEFT — 73% */}
        <div className="flex flex-col gap-[25px]" style={{ width: "73%" }}>
          {item0 && (
            <>
              <ParallaxImg src={item0.coverImage} alt={item0.title} sizes="73vw" height="576px" />
              <CaptionBar
                title={item0.title}
                subtitle={`${item0.location} • ${item0.tags[0] ?? ""}`}
              />
            </>
          )}
        </div>

        {/* RIGHT — 23% */}
        <div className="flex flex-col gap-[25px]" style={{ width: "23%" }}>
          <p style={{ fontSize: "16px", fontWeight: 400, color: "#1C2626", lineHeight: 1.6 }}>
            «&nbsp;Nous transformons les espaces en lieux de vie authentiques,
            conjuguant qualité haut de gamme et responsabilité écologique.&nbsp;»
          </p>
          <ComingSoonLink
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#BAB6AA",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              borderBottom: "1px solid #BAB6AA",
              paddingBottom: "4px",
            }}
          >
            DÉCOUVRIR NOTRE HISTOIRE
          </ComingSoonLink>
        </div>
      </div>

      {/* Mobile row 1 */}
      <div className="flex flex-col gap-[25px] lg:hidden mb-[48px]">
        {item0 && (
          <>
            <ParallaxImg src={item0.coverImage} alt={item0.title} sizes="100vw" height="auto" className="aspect-[4/3]" />
            <CaptionBar
              title={item0.title}
              subtitle={`${item0.location} • ${item0.tags[0] ?? ""}`}
            />
          </>
        )}
      </div>

      {/* Gap between row 1 and row 2 */}
      <div className="hidden lg:block" style={{ height: "81px" }} />

      {/* Row 2 */}
      <div className="hidden lg:flex justify-between items-start gap-0">
        {/* LEFT — 47% */}
        <div className="flex flex-col gap-[25px]" style={{ width: "47%" }}>
          {item1 && (
            <>
              <ParallaxImg src={item1.coverImage} alt={item1.title} sizes="47vw" height="743px" />
              <CaptionBar
                title={item1.title}
                subtitle={`${item1.location} • ${item1.tags[0] ?? ""}`}
              />
            </>
          )}
        </div>

        {/* RIGHT — 49% */}
        <div className="flex flex-col gap-[25px]" style={{ width: "49%" }}>
          {item2 && (
            <>
              <ParallaxImg
                src={item2.coverImage}
                alt={item2.title}
                sizes="49vw"
                height="415px"
                className="group/cs cursor-default"
              >
                {/* Tooltip À venir */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1C2626] px-[8px] py-[4px] text-[10px] font-medium uppercase tracking-[0.12em] text-[#F3F2ED] opacity-0 transition-opacity duration-150 group-hover/cs:opacity-100">
                  À venir
                </span>
                {/* Barre "VOIR LE PROJET" — visible au survol uniquement */}
                <div
                  className="absolute bottom-0 inset-x-0 flex items-center justify-between px-5 opacity-0 group-hover/cs:opacity-100 transition-opacity duration-300"
                  style={{ height: "62px", backgroundColor: "#BAB6AA" }}
                >
                  <span style={{ fontSize: "15px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.067em", color: "#111111" }}>
                    VOIR LE PROJET
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </ParallaxImg>
              <CaptionBar
                title={item2.title}
                subtitle={`${item2.location} • ${item2.tags[0] ?? ""}`}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile row 2 */}
      <div className="flex flex-col gap-[48px] lg:hidden">
        {item1 && (
          <div className="flex flex-col gap-[25px]">
            <ParallaxImg src={item1.coverImage} alt={item1.title} sizes="100vw" height="auto" className="aspect-[4/3]" />
            <CaptionBar
              title={item1.title}
              subtitle={`${item1.location} • ${item1.tags[0] ?? ""}`}
            />
          </div>
        )}
        {item2 && (
          <div className="flex flex-col gap-[25px]">
            <ParallaxImg src={item2.coverImage} alt={item2.title} sizes="100vw" height="auto" className="aspect-[4/3] group/cs cursor-default">
              <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1C2626] px-[8px] py-[4px] text-[10px] font-medium uppercase tracking-[0.12em] text-[#F3F2ED] opacity-0 transition-opacity duration-150 group-hover/cs:opacity-100">
                À venir
              </span>
              <div
                className="absolute bottom-0 inset-x-0 flex items-center justify-between px-5 opacity-0 group-hover/cs:opacity-100 transition-opacity duration-300"
                style={{ height: "62px", backgroundColor: "#BAB6AA" }}
              >
                <span style={{ fontSize: "15px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.067em", color: "#111111" }}>
                  VOIR LE PROJET
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H5M13 3V11" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </ParallaxImg>
            <CaptionBar
              title={item2.title}
              subtitle={`${item2.location} • ${item2.tags[0] ?? ""}`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
