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
  image?: string;
  video?: string;
  flipX?: boolean;
  noFadeIn?: boolean;
  wide?: boolean;
  overlayClass?: string;
}

export default function ServiceReveal({ activeId, title, description, image, video, flipX, noFadeIn, wide, overlayClass }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

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
        <div className={wide ? "max-w-[880px]" : "max-w-[480px]"}>
          <h2 className={`text-[48px] md:text-[64px] font-semibold uppercase leading-none tracking-tight text-[#F3F2ED] mb-[40px] md:mb-[70px] ${title.includes('\n') ? 'whitespace-pre-line' : 'whitespace-nowrap'}`}>
            {title}
          </h2>
          <p className="max-w-[360px] text-[16px] leading-relaxed text-[#F3F2ED] mb-[25px]">
            {description}
          </p>
          <Link
            href={`/services#${activeId}`}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#F3F2ED] border-b border-[#F3F2ED]/50 pb-1 hover:border-[#F3F2ED] transition-colors"
          >
            Découvrir l'offre
          </Link>
        </div>

        {/* Droite — navigation verticale */}
        <div className="hidden md:flex flex-col items-end gap-[18px]">
          {serviceNav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-[#F3F2ED] ${
                item.id === activeId ? "text-[#F3F2ED]" : "text-[#F3F2ED]/30"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
