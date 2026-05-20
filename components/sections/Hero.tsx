"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  image?: string;
  overlay?: boolean;
  scrollCta?: string;
}

export default function Hero({
  eyebrow,
  title,
  image,
  overlay = true,
  scrollCta = "Découvrir notre studio",
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Image remonte plus lentement → effet parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  // "Découvrir" — opacité basée sur scrollY global (pixels absolus) pour rester à 0 sur tout le site
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);
  useEffect(() => { setVh(window.innerHeight); }, []);
  const ctaOpacity = useTransform(scrollY, [vh * 0.15, vh * 0.30], [1, 0]);

  return (
    <section ref={sectionRef} data-navbar-theme="dark" className="relative h-screen overflow-hidden">

      {/* Background image — parallax via Framer Motion */}
      {image && (
        <motion.div
          className="absolute inset-0 scale-110"
          style={{ y: imageY }}
        >
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {overlay && (
            <div className="absolute inset-0 bg-[#1C2626]/50" />
          )}
        </motion.div>
      )}
      {!image && <div className="absolute inset-0 bg-cream" />}

      {/* Label + Title — ancré à 30vh du bas */}
      <div className="absolute inset-x-0 z-10 bottom-[30vh]">
        <div className="flex flex-col gap-1 min-[1440px]:gap-2 px-6 lg:px-[40px] min-[1920px]:px-[185px] min-[1920px]:max-w-[1550px]">
          {eyebrow && (
            <p className="text-[12px] md:text-[15px] min-[1440px]:text-[20px] font-medium uppercase tracking-widest text-[#F3F2ED]">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[26px] md:text-[50px] lg:text-[57px] min-[1440px]:text-[80px] font-semibold uppercase leading-none tracking-tight text-[#F3F2ED]">
            {title}
          </h1>
        </div>
      </div>

      {/* DÉCOUVRIR NOTRE STUDIO — ancré au bas, centré */}
      {scrollCta && (
        <motion.div
          className="absolute bottom-0 inset-x-0 z-10 flex flex-col items-center"
          style={{ opacity: ctaOpacity }}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#F3F2ED]">
            {scrollCta}
          </span>
          <div className="h-5" />
          <div className="h-10 w-px bg-[#F3F2ED]/70" />
        </motion.div>
      )}

    </section>
  );
}
