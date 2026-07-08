"use client";

import Image from "next/image";
import Pill from "@/components/ui/Pill";

export default function AboutHistory() {
  return (
    <section className="bg-cream py-[80px] min-[840px]:py-[180px]">
      <div
        className="flex flex-col lg:flex-row lg:justify-between gap-[100px] pl-[20px] min-[840px]:pl-[60px] pr-[20px] min-[840px]:pr-[clamp(60px,12.963vw_-_48.889px,200px)]"
      >
        {/* Colonne gauche — sticky */}
        <div
          className="lg:sticky"
          style={{
            top: "180px",
            alignSelf: "flex-start",
            flexShrink: 0,
            width: "fit-content",
            marginBottom: "60px",
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
          <p className="text-charcoal max-w-[330px] lg:max-w-[385px]" style={{ fontSize: "14px", lineHeight: "1.75" }}>
            JÖRO Studio est né d&rsquo;un constat simple&nbsp;: pourquoi l&rsquo;élégance,
            l&rsquo;innovation et l&rsquo;environnement ne pourraient-ils pas coexister&nbsp;?
          </p>
        </div>

        {/* Colonne droite — contenu scrollable */}
        <div className="min-w-0 lg:flex-[0_1_779px]">
          {/* Photo 1 — texture / chantier */}
          <div
            className="max-w-none min-[1020px]:max-w-[777px]"
            style={{ position: "relative", width: "100%", height: "491px", marginBottom: "60px" }}
          >
            <Image
              src="/images/2024-01-Retines-Pigalle-_23A2312-web 2.webp"
              alt="JÖRO Studio — chantier"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>

          {/* Deux colonnes de texte */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "60px" }}
          >
            <p className="text-charcoal" style={{ fontSize: "14px", lineHeight: "1.75" }}>
              Aujourd&rsquo;hui, chaque projet que nous concevons, des bureaux aux lieux de vie, est une
              réponse concrète à ce défi&nbsp;: créer des espaces hybrides, inspirants et durables, pensés
              pour les usages urbains de demain.
            </p>
            <p className="text-charcoal" style={{ fontSize: "14px", lineHeight: "1.75" }}>
              Notre objectif est clair&nbsp;: devenir leaders de la conception d&rsquo;espaces dédiés aux
              nouveaux usages urbains, bureaux, événementiel, hôtellerie…
            </p>
          </div>

          {/* Photo 2 — parquet */}
          <div
            className="max-w-none min-[1020px]:max-w-[779px]"
            style={{ position: "relative", width: "100%", height: "676px" }}
          >
            <Image
              src="/images/2024-10-Retines-Asgard-parquet-Pigalle-DSC04495.webp"
              alt="JÖRO Studio — pose de parquet"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
