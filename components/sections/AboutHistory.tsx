"use client";

import Image from "next/image";
import Pill from "@/components/ui/Pill";

export default function AboutHistory() {
  return (
    <section className="bg-cream py-[80px] min-[840px]:py-[180px]">
      <div
        className="flex flex-col lg:flex-row lg:justify-between gap-[50px] lg:gap-[100px] pl-[20px] min-[840px]:pl-[60px] pr-[20px] min-[840px]:pr-[clamp(60px,12.963vw_-_48.889px,200px)]"
      >
        {/* Colonne gauche — sticky */}
        <div
          className="w-full lg:w-fit lg:sticky lg:mb-[60px]"
          style={{
            top: "180px",
            alignSelf: "flex-start",
            flexShrink: 0,
          }}
        >
          <Pill className="self-start mb-6">NOTRE STUDIO</Pill>
          <h2
            className="hidden lg:block font-semibold tracking-tight uppercase text-charcoal text-[55px] min-[1200px]:text-[64px]"
            style={{ lineHeight: "1.05", marginBottom: "40px", whiteSpace: "nowrap" }}
          >
            Repenser<br />les espaces de<br />vie autrement
          </h2>
          <h2
            className="lg:hidden font-semibold tracking-tight uppercase text-charcoal"
            style={{
              // 52px à 760px de large, réduit fluidement jusqu'à 26px à 375px (puis plancher à 26px en dessous)
              fontSize: "clamp(26px, 6.7532vw + 0.6753px, 52px)",
              lineHeight: "1.05",
              marginBottom: "40px",
              whiteSpace: "nowrap",
            }}
          >
            Repenser les espaces<br />de vie autrement
          </h2>
          <p className="text-charcoal max-w-full lg:max-w-[385px]" style={{ fontSize: "14px", lineHeight: "1.75" }}>
            JÖRO Studio est né d&rsquo;un constat simple&nbsp;: pourquoi l&rsquo;élégance,
            l&rsquo;innovation et l&rsquo;environnement ne pourraient-ils pas coexister&nbsp;?
          </p>
        </div>

        {/* Colonne droite — contenu scrollable. Grid + order pour réordonner "Notre objectif" après la photo 2 en dessous de 1024px sans dupliquer le texte. */}
        <div className="min-w-0 lg:flex-[0_1_779px] grid grid-cols-1 min-[840px]:grid-cols-2 gap-[50px] lg:gap-x-[40px] lg:gap-y-[60px]">
          {/* Photo 1 — texture / chantier */}
          <div
            className="order-1 col-span-1 min-[840px]:col-span-2 relative w-full lg:max-w-[777px] h-[clamp(224px,41.1402vw_+_69.7242px,491px)]"
          >
            <Image
              src="/images/2024-01-Retines-Pigalle-_23A2312-web 2.webp"
              alt="JÖRO Studio — chantier"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>

          <p className="order-2 text-charcoal" style={{ fontSize: "14px", lineHeight: "1.75" }}>
            Aujourd&rsquo;hui, chaque projet que nous concevons, des bureaux aux lieux de vie, est une
            réponse concrète à ce défi&nbsp;: créer des espaces hybrides, inspirants et durables, pensés
            pour les usages urbains de demain.
          </p>

          {/* Photo 2 — parquet (après le 1er texte sur mobile) */}
          <div
            className="order-3 min-[840px]:order-4 col-span-1 min-[840px]:col-span-2 relative w-full lg:max-w-[779px] h-[clamp(308px,56.7026vw_+_95.3652px,676px)]"
          >
            <Image
              src="/images/2024-10-Retines-Asgard-parquet-Pigalle-DSC04495.webp"
              alt="JÖRO Studio — pose de parquet"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>

          <p className="order-4 min-[840px]:order-3 text-charcoal" style={{ fontSize: "14px", lineHeight: "1.75" }}>
            Notre objectif est clair&nbsp;: devenir leaders de la conception d&rsquo;espaces dédiés aux
            nouveaux usages urbains, bureaux, événementiel, hôtellerie…
          </p>
        </div>
      </div>
    </section>
  );
}
