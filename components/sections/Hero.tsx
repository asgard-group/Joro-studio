"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";

interface HeroProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  image?: string;
  video?: string;
  overlay?: boolean;
}

export default function Hero({
  title,
  description,
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
    <section ref={sectionRef} data-navbar-theme="dark" className="relative min-h-[100svh] overflow-hidden">

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
              className="object-cover object-right min-[835px]:object-[100%_60%]"
              sizes="100vw"
            />
          )}
          {overlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(28, 38, 38, 1)", mixBlendMode: "hard-light", opacity: 0.35 }}
            />
          )}
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-cream" />
      )}

      {/* Label + Title — collé en bas à tous les breakpoints (padding-bottom
          sur .hero-container, jamais padding-top) : si la fenêtre est moins
          haute, l'espace se comprime en haut, le container ne remonte pas.
          Tailles/gaps/paddings gérés par le design system fluide (vw) dans
          globals.css. */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="hero-container w-full flex flex-col items-start text-left hero-title-gap">
          {/* En dessous de 835px : titre + description empilés (colonne), avec le
              petit trait séparateur devant la description. À partir de 835px
              (desktop) : titre et description sur une même ligne, calés sur le
              bas (items-end) et espacés automatiquement (justify-between, pas de
              gap fixe) — plus de trait séparateur, cf. capture de référence. */}
          <div className="flex flex-col items-start hero-title-gap w-full min-[835px]:flex-row min-[835px]:items-end min-[835px]:justify-between min-[835px]:gap-x-[40px]">
            <h1 className="title-huge text-cream" style={{ wordWrap: "break-word" }}>
              {title}
            </h1>
            {description && (
              <div className="flex items-start hero-divider-gap max-w-[500px]">
                <span className="mt-[9px] h-px w-[26px] shrink-0 bg-cream/50 min-[835px]:hidden" aria-hidden="true" />
                <div className="texte text-cream" style={{ wordWrap: "break-word" }}>
                  {description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
