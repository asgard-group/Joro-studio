"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Pill from "@/components/ui/Pill";

const CLIP_HIDDEN = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const CLIP_VISIBLE = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export default function AboutHistory() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // 0 → 0.15 : pause initiale (user voit bien les photos de départ)
  // 0.15 → 1  : reveal clip-path
  const clipPath = useTransform(scrollYProgress, [0.15, 1], [CLIP_HIDDEN, CLIP_VISIBLE]);

  return (
    // Pin-spacer : hauteur étendue = zone de scroll pendant laquelle la section reste pinnée.
    <div ref={wrapperRef} className="relative z-10" style={{ height: "250vh" }}>
      <section
        className="sticky top-0 min-h-screen grid grid-rows-[auto_1fr] gap-[50px] min-[1020px]:gap-[100px] pt-[50px] pb-[20px] bg-cream overflow-hidden"
      >
        {/* ROW TEXTES */}
        <div className="flex flex-col gap-[50px] min-[1020px]:flex-row min-[1020px]:gap-[30px]">
          {/* Texte gauche : pill + titre — container max 749px ≤1920px, 1129px au-dessus */}
          <div
            className="flex-1 min-[1440px]:flex-[1129_1_0%] min-[1020px]:max-w-[749px] min-[1921px]:max-w-[1129px] flex flex-col gap-[10px] pl-[20px] min-[840px]:pl-[40px] min-[1440px]:pl-[60px]"
          >
            <Pill className="self-start">NOTRE HISTOIRE</Pill>
            <h2
              className="font-semibold tracking-tight uppercase text-[26px] min-[1020px]:text-[64px] text-charcoal"
              style={{ lineHeight: "130%" }}
            >
              Penser l&rsquo;espace <br className="hidden min-[1020px]:inline min-[1601px]:hidden" />autrement
            </h2>
          </div>
          {/* Texte droite : description */}
          <div className="flex-1 min-[1440px]:flex-[761_1_0%] min-[1440px]:min-w-[660px] px-[20px] min-[840px]:px-[40px] min-[1020px]:pt-[46px] min-[1020px]:pl-0 min-[1020px]:pr-[40px] min-[1440px]:pr-[60px]">
            <p
              className="font-medium text-[14px] leading-[24px] min-[1020px]:text-[16px] min-[1020px]:leading-[26px] text-charcoal"
            >
              JÖRO Studio est né d&rsquo;un constat simple&nbsp;: pourquoi l&rsquo;élégance, l&rsquo;innovation et l&rsquo;environnement ne pourraient-ils pas coexister&nbsp;? Aujourd&rsquo;hui, chaque projet que nous concevons, des bureaux aux lieux de vie, est une réponse concrète à ce défi&nbsp;: créer des espaces hybrides, durables et inspirants, pensés pour les usages urbains de demain.
            </p>
          </div>
        </div>

        {/* ROW IMAGES — chaque côté a 2 images superposées, la 2ème se révèle via clip-path.
            Ref `photoRowRef` : sa position .bottom sert à caler la sticky top dynamique. */}
        <div
          className="flex flex-col gap-[30px] min-[1020px]:flex-row min-[1020px]:items-stretch"
        >
          {/* Côté gauche : superposition — aspect fixe sur mobile, hauteur dynamique sur desktop */}
          <div className="max-[1019px]:hidden flex-1 min-[1440px]:flex-[1129_1_0%] min-[1020px]:max-w-[749px] min-[1921px]:max-w-[1129px] relative aspect-[1020/560] min-[1020px]:aspect-auto min-[1020px]:h-full overflow-hidden">
            {/* Image du dessous — visible dès le départ */}
            <Image
              src="/images/Frame253.webp"
              alt="JÖRO Studio — espace lounge"
              fill
              className="object-cover"
              sizes="(max-width: 1020px) 100vw, (max-width: 1440px) 50vw, 60vw"
            />
            {/* Image du dessus — révélée via clip-path animé au scroll */}
            <motion.div className="absolute inset-0" style={{ clipPath }}>
              <Image
                src="/images/1762939680941-1.webp"
                alt="Salle de réunion — chaises orange"
                fill
                className="object-cover"
                sizes="(max-width: 1020px) 100vw, (max-width: 1440px) 50vw, 60vw"
              />
            </motion.div>
          </div>

          {/* Côté droit : superposition — caché sous 1020 (anciennement à gauche) */}
          <div className="flex-1 min-[1440px]:flex-[761_1_0%] min-[1440px]:min-w-[660px] relative aspect-[1020/560] min-[1020px]:aspect-auto min-[1020px]:h-full overflow-hidden">
            {/* Image du dessous */}
            <Image
              src="/images/2024-10-Retines-Asgard-parquet-Pigalle-DSC04495.webp"
              alt="JÖRO Office — salle de réunion taupe"
              fill
              className="object-cover"
              sizes="(max-width: 1440px) 50vw, 40vw"
            />
            {/* Image du dessus — révélée via clip-path animé au scroll */}
            <motion.div className="absolute inset-0" style={{ clipPath }}>
              <Image
                src="/images/1762939681123-1.webp"
                alt="CoinShares — espace lounge"
                fill
                className="object-cover"
                sizes="(max-width: 1440px) 50vw, 40vw"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
