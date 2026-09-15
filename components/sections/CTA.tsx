"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ctaStrings } from "@/lib/strings";
import { useContactPanel } from "@/components/providers/ContactPanelProvider";

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { open: openContact } = useContactPanel();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Aucun endpoint n'est encore branché (même state qu'ailleurs sur le site,
  // cf. ContactPanel.tsx) : on empêche seulement le rechargement de page pour l'instant.
  function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section
      ref={sectionRef}
      data-navbar-theme="dark"
      className="relative overflow-hidden md:min-h-screen md:flex md:items-center md:justify-center"
    >
      {/* Fond — déborde de 130% pour que le parallax ne révèle jamais de bord vide */}
      <motion.div className="absolute inset-x-0" style={{ top: "-15%", height: "130%", y }}>
        <Image src="/images/CTA.png" alt="" fill className="object-cover" priority />
      </motion.div>

      {/* Mobile : hauteur au contenu, blocs empilés avec un gap fixe de 80px.
          Desktop (md+) : centré dans la section pleine hauteur, mais le conteneur
          des 2 blocs reste lui-même en hauteur "hug" (pas étiré à la section). */}
      <div className="relative flex flex-col gap-[80px] py-[80px] md:w-full md:gap-0 md:py-0 md:flex-row md:items-stretch">
        {/* Bloc gauche — prise de rendez-vous. Le divider est un simple border-right sur
            ce bloc (pas un 3e élément séparé) : comme le bloc s'étire déjà sur toute la
            hauteur du conteneur, la bordure s'étend naturellement sur toute cette hauteur. */}
        <div className="flex flex-col items-center justify-center px-6 md:flex-1 md:py-[68px] md:border-r" style={{ borderColor: "#BAB6AA" }}>
          <div className="w-full max-w-[324px] flex flex-col items-center gap-[34px]">
            <p
              className="text-center text-cream font-normal"
              style={{ fontSize: "28px", lineHeight: "125%" }}
            >
              {ctaStrings.appointment.title}
            </p>
            <button
              type="button"
              onClick={openContact}
              className="w-full px-[17px] py-[14px] text-[14px] font-semibold uppercase tracking-[1.1px] transition-opacity duration-200 hover:opacity-80"
              style={{ backgroundColor: "#EAE7E3", color: "#2C2927" }}
            >
              {ctaStrings.appointment.button}
            </button>
          </div>
        </div>

        {/* Bloc droit — newsletter */}
        <div className="flex flex-col items-center justify-center px-6 md:flex-1 md:py-[68px]">
          <div className="w-full max-w-[324px] flex flex-col items-center gap-[34px]">
            <p
              className="text-center text-cream font-normal"
              style={{ fontSize: "28px", lineHeight: "125%" }}
            >
              {ctaStrings.newsletter.titleLine1}
              <br />
              {ctaStrings.newsletter.titleLine2}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="w-full flex items-stretch">
              <input
                type="email"
                name="email"
                required
                placeholder={ctaStrings.newsletter.emailPlaceholder}
                aria-label={ctaStrings.newsletter.emailLabel}
                className="min-w-0 flex-1 px-[14px] py-[12px] text-[13px] font-light bg-transparent text-cream placeholder:text-[#BAB6AA] focus:outline-none"
                style={{ border: "0.85px solid rgba(186, 182, 170, 0.80)" }}
              />
              <button
                type="submit"
                className="shrink-0 px-[17px] py-[12px] text-[14px] font-semibold uppercase tracking-[1.3px] transition-opacity duration-200 hover:opacity-80"
                style={{ backgroundColor: "#F3F2ED", color: "#1C2626" }}
              >
                {ctaStrings.newsletter.button}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
