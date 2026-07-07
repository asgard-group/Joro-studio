"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { motion, useScroll, useTransform } from "framer-motion";

const serviceNav = [
  { id: "design-build", label: "DESIGN & BUILD" },
  { id: "amo", label: "AMO" },
  { id: "marketing-suite", label: "MARKETING SUITE" },
  { id: "conseil-workplace", label: "CONSEIL & STRATÉGIE" },
];

interface Props {
  activeId: string;
  title: string;
  description: string;
  ctaLabel?: string;
  image?: string;
  video?: string;
  flipX?: boolean;
  noFadeIn?: boolean;
  wide?: boolean;
  overlayClass?: string;
  noParallax?: boolean;
}

export default function ServiceReveal({ activeId, title, description, ctaLabel = "Découvrir l'offre", image, video, flipX, noFadeIn, wide, overlayClass, noParallax }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], noParallax ? ["0%", "0%"] : ["-12%", "12%"]);

  return (
    <div
      ref={sectionRef}
      data-navbar-theme="dark"
      className="relative h-full overflow-hidden"
    >
      {/* Fond parallaxe — vidéo ou image */}
      <motion.div
        className="absolute inset-x-0 w-full"
        style={{ y: bgY, top: "-12%", height: "124%" }}
      >
        {video ? (
          <video
            className={`w-full h-full object-cover${flipX ? " scale-x-[-1]" : ""}`}
            src={video}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : image ? (
          <Image src={image} alt={title} fill className="object-cover" sizes="100vw" />
        ) : null}
      </motion.div>
      {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} />}

      {/* Contenu */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-[60px]"
        initial={{ opacity: noFadeIn ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-10%" }}
      >
        {/* Gauche */}
        <div className={wide ? "max-w-[880px]" : "max-w-[580px]"}>
          <h2 className={`text-[26px] md:text-[64px] font-semibold uppercase tracking-tight text-cream mb-[40px] ${title.includes('\n') ? 'whitespace-pre-line leading-[1.2]' : 'whitespace-nowrap leading-none'}`}>
            {title}
          </h2>
          <p className="max-w-[460px] text-[14px] leading-relaxed text-cream mb-[25px]">
            {description}
          </p>
          <Link href="/contact" className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream border-b border-cream/50 pb-1">
            {ctaLabel}
          </Link>
        </div>

        {/* Droite — navigation verticale */}
        <div className="hidden md:flex flex-col items-end gap-[18px]">
          {serviceNav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (!el) return;
                const top = el.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top, behavior: "smooth" });
              }}
              className={`text-[14px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-cream ${
                item.id === activeId ? "text-cream" : "text-cream/30"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
