"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
}

function ProjectRow({ item, reversed = false }: { item: WorkItem; reversed?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Image : parallax subtil
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={containerRef}>

      {/* MOBILE / TABLET — texte au-dessus, image en dessous */}
      <div className="lg:hidden flex flex-col">
        <div className="flex flex-col gap-[24px] px-[24px] sm:px-[40px] pt-[80px] pb-[40px]">
          <h2
            className="font-semibold uppercase text-[36px] sm:text-[48px] text-charcoal"
            style={{ lineHeight: 1.05 }}
          >
            {item.title}
          </h2>
          <p className="text-[14px] text-charcoal" style={{ lineHeight: 1.7 }}>
            {item.description}
          </p>
          <div className="flex flex-wrap gap-[8px]">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-charcoal border border-charcoal/30 px-[14px] py-[6px] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden w-full" style={{ height: "500px" }}>
          <div className="absolute inset-0">
            <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="100vw" />
          </div>
        </div>
      </div>

      {/* DESKTOP — texte sticky à gauche, image à droite */}
      <div className={`hidden lg:flex items-start py-[100px]${reversed ? " flex-row-reverse" : ""}`}>
        <div className={`w-[35%] sticky top-[200px] ${reversed ? "pr-[60px] pl-[40px]" : "pl-[60px] pr-[40px]"}`}>
          <div className="flex flex-col gap-[24px]">
            <h2
              className="font-semibold uppercase text-[40px] min-[1200px]:text-[52px] text-charcoal"
              style={{ lineHeight: 1.05 }}
            >
              {item.title}
            </h2>
            <p className="text-[14px] text-charcoal" style={{ lineHeight: 1.7, maxWidth: "380px" }}>
              {item.description}
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-charcoal border border-charcoal/30 px-[14px] py-[6px] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[65%] relative overflow-hidden" style={{ height: "789px" }}>
          <motion.div className="absolute inset-x-0" style={{ y: imageY, top: "-10%", height: "120%" }}>
            <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="65vw" />
          </motion.div>
        </div>
      </div>

    </div>
  );
}

export default function FeaturedWork({ items }: Props) {
  return (
    <section data-navbar-theme="light" className="bg-cream">
      {/* Lignes projets */}
      {items.map((item, i) => (
        <ProjectRow key={item.id} item={item} reversed={i % 2 === 1} />
      ))}

      <div className="h-[80px]" />
    </section>
  );
}
