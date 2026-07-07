"use client";

import Image from "next/image";
import Pill from "@/components/ui/Pill";

export default function AboutHistory() {
  return (
    <section className="bg-cream" style={{ paddingTop: "180px", paddingBottom: "180px" }}>
      <div
        className="flex flex-col lg:flex-row"
        style={{ paddingLeft: "60px", paddingRight: "60px", gap: "100px" }}
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
            className="font-semibold tracking-tight uppercase text-charcoal"
            style={{ fontSize: "64px", lineHeight: "1.05", marginBottom: "40px", whiteSpace: "nowrap" }}
          >
            Repenser<br />les espaces de<br />vie autrement
          </h2>
          <p className="text-charcoal" style={{ fontSize: "14px", lineHeight: "1.75", maxWidth: "330px" }}>
            JÖRO Studio est né d&rsquo;un constat simple&nbsp;: pourquoi l&rsquo;élégance,
            l&rsquo;innovation et l&rsquo;environnement ne pourraient-ils pas coexister&nbsp;?
          </p>
        </div>

        {/* Colonne droite — contenu scrollable */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Photo 1 — texture / chantier */}
          <div
            style={{ position: "relative", width: "100%", maxWidth: "777px", height: "491px", marginBottom: "60px" }}
          >
            <Image
              src="/images/taibout1.webp"
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
          <div style={{ position: "relative", width: "100%", maxWidth: "779px", height: "676px" }}>
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
