"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";

interface HeroProps {
  /** Texte d'accroche (rendu en h1). */
  title: React.ReactNode;
  /** Bouton bas droite (à partir de 840px), ex. "Découvrir" → ancre ctaHref. */
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  video?: string;
  overlay?: boolean;
}

export default function Hero({
  title,
  ctaLabel,
  ctaHref,
  image,
  video,
  overlay = true,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // Parallax réservé au desktop (≥1024px) — désactivé sur mobile/tablette
  const isLargeScreen = useIsDesktop(1024);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Image remonte plus lentement → effet parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={sectionRef} data-navbar-theme="dark" className="relative h-[100svh] overflow-hidden">

      {/* Background — vidéo ou image, avec parallax via Framer Motion */}
      {(video || image) ? (
        <motion.div
          className="absolute inset-0 scale-110"
          style={{ y: isLargeScreen ? imageY : 0 }}
        >
          {video ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source
                src={video}
                type={video.endsWith(".webm") ? "video/webm" : video.endsWith(".mp4") ? "video/mp4" : undefined}
              />
            </video>
          ) : (
            <Image
              src={image!}
              alt=""
              fill
              priority
              className="object-cover object-left min-[835px]:object-[100%_60%]"
              sizes="100vw"
            />
          )}
          {overlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "#1B2424", mixBlendMode: "hard-light", opacity: 0.35 }}
            />
          )}
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-cream" />
      )}

      {/* Texte d'accroche (bas gauche) + bouton "Nos projets" (bas droite, ≥840px)
          — collés en bas à tous les breakpoints (padding-bottom sur
          .hero-container, jamais padding-top) : si la fenêtre est moins haute,
          l'espace se comprime en haut, le container ne remonte pas.
          Tailles/paddings gérés par le design system --u (breakpoints
          390/834/1280/1920) et .hero-lead dans globals.css. */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="hero-container w-full flex items-end justify-between text-left">
          <h1 className="hero-lead text-cream" style={{ wordWrap: "break-word" }}>
            {title}
          </h1>
          {ctaLabel && (
            <a href={ctaHref} className="hero-cta hidden min-[840px]:inline-flex items-center text-cream shrink-0">
              {ctaLabel}
              {/* Flèche vers le bas (diagonale bas-droite, comme la maquette) */}
              <svg
                aria-hidden="true"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                style={{ width: "calc(14 * var(--u))", height: "calc(14 * var(--u))" }}
              >
                <path d="M3 3l8 8M11 4v7H4" />
              </svg>
            </a>
          )}
        </div>
      </div>

    </section>
  );
}
