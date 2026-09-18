"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { heroStrings } from "@/lib/strings";

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

  // CTA de scroll — bascule (opacité + léger décalage vers le bas) dès que
  // l'utilisateur commence à scroller, en CSS pur (transition, pas de valeur
  // continue liée au scroll) pour un fondu net plutôt que progressif.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
              className="object-cover object-right"
              sizes="100vw"
            />
          )}
          {overlay && (
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(38, 28, 28, 0.30)" }} />
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
        <div className="hero-container w-full flex flex-col items-start text-left">
          <div className="flex flex-col items-start hero-title-gap">
            <h1 className="title-huge text-cream" style={{ wordWrap: "break-word" }}>
              {title}
            </h1>
            {description && (
              <div className="flex items-start hero-divider-gap max-w-[500px]">
                <span className="mt-[9px] h-px w-[26px] shrink-0 bg-cream/50" aria-hidden="true" />
                <div className="texte text-cream" style={{ wordWrap: "break-word" }}>
                  {description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA de scroll — masqué sous 835px, flush avec le bord bas de la section, bascule net au scroll */}
      <div
        className="hidden min-[835px]:flex absolute inset-x-0 bottom-0 z-10 flex-col items-center hero-scroll-gap pointer-events-none"
        style={{
          opacity: scrolled ? 0 : 1,
          transition: "opacity .6s cubic-bezier(.25,.5,0,1)",
        }}
      >
        <span className="label-scroll text-cream/90">
          {heroStrings.scrollCta}
        </span>
        <div className="w-px h-8 bg-cream/60" />
      </div>

    </section>
  );
}
