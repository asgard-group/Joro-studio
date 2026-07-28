"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={sectionRef} data-navbar-theme="dark" className="relative h-screen overflow-hidden">
      {/* Parallax — le fond déborde de 130% (15% de chaque côté) pour que le déplacement
          vertical au scroll ne révèle jamais de bord vide */}
      <motion.div className="absolute inset-x-0" style={{ top: "-15%", height: "130%", y }}>
        <Image src="/images/bg.png" alt="" fill className="object-cover" priority />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative flex flex-col items-center gap-8 bg-white rounded w-fit max-w-[1200px] p-8 md:p-20 text-center">
          <h2 className="font-semibold uppercase tracking-tight text-charcoal text-[32px] md:text-[46px]">
            Parlons-en
          </h2>
          <p className="text-charcoal/70 text-[15px] md:text-[16px] leading-relaxed max-w-sm">
            De la conception à la réalisation, JÖRO Studio met son expertise au service de vos ambitions.
          </p>
          <ComingSoonLink className="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal border-b border-charcoal/50 pb-1">
            Nous contacter
          </ComingSoonLink>
        </div>
      </div>
    </section>
  );
}
