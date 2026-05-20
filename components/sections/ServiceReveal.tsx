"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const serviceNav = [
  { id: "design-build", label: "DESIGN & BUILD", href: "/services#design-build" },
  { id: "amo", label: "AMO", href: "/services#amo" },
  { id: "marketing-suite", label: "MARKETING SUITE", href: "/services#marketing-suite" },
  { id: "conseil-workplace", label: "CONSEIL WORKPLACE & STRATÉGIE IMMOBILIÈRE", href: "/services#conseil-workplace" },
];

interface Props {
  activeId: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  flipX?: boolean;
}

export default function ServiceReveal({ activeId, title, description, image, video, flipX }: Props) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
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
      className="relative h-screen overflow-hidden"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
      }}
      onMouseLeave={() => setCursor((c) => ({ ...c, visible: false }))}
      style={{ cursor: "none" }}
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
      <div className="absolute inset-0 bg-[#1C2626]/50" />

      {/* Contenu */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-10%" }}
      >
        {/* Nav offres */}
        <div className="pt-[100px] px-4 sm:px-6 lg:px-[60px]">
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {serviceNav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-[11px] font-medium uppercase tracking-[0.18em] pb-1 transition-colors ${
                  item.id === activeId
                    ? "text-[#F3F2ED] border-b border-[#F3F2ED]"
                    : "text-[#F3F2ED]/50 hover:text-[#F3F2ED]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Titre + description */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-[60px]">
          <h2 className="text-[48px] md:text-[64px] font-semibold uppercase leading-none tracking-tight text-[#F3F2ED] mb-6 whitespace-pre-line">
            {title}
          </h2>
          <p className="max-w-[340px] text-[16px] font-normal leading-relaxed text-[#F3F2ED]/80">
            {description}
          </p>
        </div>
      </motion.div>

      {/* Curseur custom */}
      <div
        className="pointer-events-none absolute z-40 transition-opacity duration-200"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: "translate(-50%, -50%)",
          opacity: cursor.visible ? 1 : 0,
        }}
      >
        <span className="text-[#F3F2ED] text-[11px] font-medium uppercase tracking-[0.2em] whitespace-nowrap">
          • Voir le service
        </span>
      </div>
    </div>
  );
}
