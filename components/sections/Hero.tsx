"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  image?: string;
  video?: string;
  overlay?: boolean;
  scrollCta?: string;
}

export default function Hero({
  eyebrow,
  title,
  image,
  video,
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
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  const ctaOpacity = useTransform(scrollY, [vh * 0.15, vh * 0.30], [1, 0]);

  return (
    <section ref={sectionRef} data-navbar-theme="dark" className="relative h-screen overflow-hidden">

      {/* Background — vidéo ou image, avec parallax via Framer Motion */}
      {(video || image) ? (
        <motion.div
          className="absolute inset-0 scale-110"
          style={{ y: imageY }}
        >
          {video ? (
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
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
            <div
              className={`absolute inset-0 mix-blend-hard-light ${
                video ? "bg-[#1C2626]/30" : "bg-[#1C2626]/50"
              }`}
            />
          )}
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-cream" />
      )}

      {/* Label + Title — ancré à 30vh du bas */}
      <div className="absolute inset-x-0 z-10 bottom-[30vh]">
        <div
          className="w-full px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px] inline-flex flex-col items-start justify-start"
        >
          <div
            className="self-stretch flex flex-col items-start justify-start"
            style={{ paddingBottom: 0.63 }}
          >
            {eyebrow && (
              <p
                className="uppercase text-[12px] min-[840px]:text-[18px] min-[1200px]:text-[20px]"
                style={{
                  color: '#F3F2ED',
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
              className="uppercase text-[clamp(28px,6.857vw,48px)] min-[700px]:text-[48px] min-[840px]:text-[56px] min-[1200px]:text-[80px]"
              style={{
                color: '#F3F2ED',
                fontWeight: 600,
                lineHeight: '115%',
                letterSpacing: '0.02em',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>
          </div>
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
