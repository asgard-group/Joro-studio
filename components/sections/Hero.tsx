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
              className="object-cover object-right min-[840px]:object-center"
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

      {/* Label + Title — aligné en bas à gauche sur mobile, centré verticalement à partir de 840px */}
      <div className="absolute inset-0 z-10 flex items-end min-[840px]:items-center">
        <div className="w-full px-[16px] min-[390px]:px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px] pb-[48px] min-[840px]:pb-0 flex flex-col items-start text-left">
          <div className="flex flex-col items-start gap-[24px] min-[840px]:gap-[32px] min-[1600px]:gap-[48px]">
            <h1
              className="uppercase text-[44px] min-[840px]:text-[56px] min-[1200px]:text-[77px] min-[1600px]:text-[92px] min-[1920px]:text-[110px] text-cream"
              style={{
                fontWeight: 600,
                lineHeight: '100%',
                letterSpacing: '-1px',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>
            {description && (
              <div className="flex items-start gap-[20px] max-w-[500px]">
                <span className="mt-[9px] h-px w-[26px] shrink-0 bg-cream/50" aria-hidden="true" />
                <p
                  className="!text-[12px] min-[840px]:!text-[16px] text-cream"
                  style={{ fontWeight: 500, lineHeight: '125%', wordWrap: 'break-word' }}
                >
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA de scroll — masqué sur mobile, flush avec le bord bas de la section, bascule net au scroll */}
      <div
        className="hidden min-[840px]:flex absolute inset-x-0 bottom-0 z-10 flex-col items-center gap-2 pointer-events-none"
        style={{
          opacity: scrolled ? 0 : 1,
          transition: "opacity .6s cubic-bezier(.25,.5,0,1)",
        }}
      >
        <span className="text-[11px] font-medium uppercase text-cream/90">
          {heroStrings.scrollCta}
        </span>
        <div className="w-px h-8 bg-cream/60" />
      </div>

    </section>
  );
}
