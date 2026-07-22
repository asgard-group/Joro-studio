"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  image?: string;
  video?: string;
  overlay?: boolean;
}

export default function Hero({
  eyebrow,
  title,
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
              className="object-cover"
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

      {/* Label + Title — centrés sur la section */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className="w-full px-[16px] min-[390px]:px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px] inline-flex flex-col items-center justify-center text-center"
        >
          <div
            className="self-stretch flex flex-col items-center justify-center text-center gap-[9px]"
          >
            {eyebrow && (
              <p
                className="uppercase text-[14px] min-[840px]:text-[18px] min-[1200px]:text-[26px] text-cream"
                style={{
                  fontWeight: 500,
                  lineHeight: '100%',
                  letterSpacing: '0.05em',
                  wordWrap: 'break-word',
                }}
              >
                {eyebrow}
              </p>
            )}
            <h1
              className="uppercase text-[clamp(20px,calc(20px+28*(100vw-320px)/448),48px)] min-[840px]:text-[56px] min-[1200px]:text-[77px] min-[1600px]:text-[92px] text-cream"
              style={{
                fontWeight: 600,
                lineHeight: '126.7%',
                letterSpacing: '0.02em',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Monogramme — ancré en bas de la section, centré */}
      <div className="absolute inset-x-0 bottom-[5svh] min-[1600px]:bottom-[8svh] z-10 flex justify-center">
        <Image
          src="/images/logos/monograme.svg"
          alt=""
          width={177}
          height={113}
          className="w-[48px] min-[768px]:w-[68px] min-[1200px]:w-[95px] min-[1600px]:w-[114px] h-auto"
          style={{ filter: "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)" }}
        />
      </div>

    </section>
  );
}
