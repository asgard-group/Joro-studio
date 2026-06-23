"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Pill from "@/components/ui/Pill";

export default function AboutHistory() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.intersectionRatio >= 0.2) {
            e.target.classList.add("is-revealed");
          } else if (e.intersectionRatio === 0) {
            e.target.classList.remove("is-revealed");
          }
        });
      },
      { threshold: [0, 0.2] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-cream overflow-hidden" style={{ paddingTop: "200px" }}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-24">
        {/* Colonne gauche — texte */}
        <div
          className="uc-text-col flex-1 px-5 md:px-10 lg:pl-[60px] lg:pr-0"
        >
          <Pill className="self-start mb-4">NOTRE STUDIO</Pill>
          <h2
            className="uc-title font-semibold tracking-tight uppercase text-charcoal"
            style={{ fontSize: "64px", lineHeight: "110%", marginBottom: "70px" }}
          >
            Repenser <br />les espaces de <br />vie autrement
          </h2>
          <p
            className="uc-desc font-medium text-charcoal max-w-[520px]"
            style={{ fontSize: "16px", lineHeight: "26px" }}
          >
            JÖRO Studio est né d&rsquo;un constat simple&nbsp;: pourquoi l&rsquo;élégance,
            l&rsquo;innovation et l&rsquo;environnement ne pourraient-ils pas
            coexister&nbsp;? Aujourd&rsquo;hui, chaque projet que nous concevons, des
            bureaux aux lieux de vie, est une réponse concrète à ce défi&nbsp;:
            créer des espaces hybrides, inspirants et durables, pensés pour les
            usages urbains de demain.
          </p>
        </div>

        {/* Colonne droite — photo avec animation reveal */}
        <div
          ref={wrapRef}
          className="uc-reveal-wrap uc-photo"
        >
          <Image
            src="/images/2024-10-Retines-Asgard-parquet-Pigalle-DSC04495.webp"
            alt="JÖRO Studio — atelier"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="uc-overlay" />
        </div>
      </div>

      <style>{`
        .uc-reveal-wrap {
          position: relative;
          overflow: hidden;
        }
        .uc-overlay {
          position: absolute;
          inset: 0;
          left: 0;
          background: #f5f0eb;
          z-index: 2;
          transform-origin: left center;
          transform: scaleX(1);
          transition: transform ease-in-out 2s 250ms;
        }
        .uc-reveal-wrap.is-revealed .uc-overlay {
          transform: scaleX(0);
        }
        @media (max-width: 1023px) {
          .uc-title { font-size: 26px !important; }
          .uc-title br { display: none; }
          .uc-desc { font-size: 12px !important; line-height: 20px !important; }
        }
        /* Photo responsive */
        .uc-photo {
          width: 100%;
          aspect-ratio: 16/9;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) {
          .uc-text-col { min-width: 620px; }
          .uc-photo {
            flex: 0 1 1102px;
            height: 569px;
          }
        }
        @media (min-width: 1920px) {
          .uc-photo {
            width: 1102px;
            height: 632px;
          }
        }
      `}</style>
    </section>
  );
}
