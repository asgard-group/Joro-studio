"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ctaStrings } from "@/lib/strings";
import { useContactPanel } from "@/components/providers/ContactPanelProvider";
import { useIsDesktop } from "@/hooks/useIsDesktop";

// Mesure la largeur réellement affichée d'un élément (après retour à la ligne
// éventuel) et la garde à jour au resize/reflow — utilisé pour faire adapter
// la largeur du bouton/input à celle du titre au-dessus, plutôt qu'une
// largeur fixe commune (qui ne suit pas si le titre passe sur 1 ou 2 lignes).
function useMeasuredWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { open: openContact } = useContactPanel();
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  // Parallax désactivé en mobile (même seuil que le passage de layout md:).
  const y = isDesktop ? rawY : "0%";

  const [appointmentTitleRef, appointmentTitleWidth] = useMeasuredWidth<HTMLParagraphElement>();
  const [newsletterTitleRef, newsletterTitleWidth] = useMeasuredWidth<HTMLParagraphElement>();

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
      {/* Fond — déborde de 130% sur desktop pour que le parallax ne révèle jamais de
          bord vide ; sur mobile, le parallax est désactivé donc ce surdimensionnement
          n'a plus lieu d'être (il ne ferait que zoomer/recadrer l'image pour rien). */}
      <motion.div
        className="absolute inset-x-0"
        style={{ top: isDesktop ? "-15%" : "0%", height: isDesktop ? "130%" : "100%", y }}
      >
        <Image src="/images/CTA.png" alt="" fill className="object-cover" priority />
      </motion.div>

      {/* Mobile : hauteur au contenu, blocs empilés avec un gap fixe de 80px.
          Desktop (md+) : centré dans la section pleine hauteur, mais le conteneur
          des 2 blocs reste lui-même en hauteur "hug" (pas étiré à la section). */}
      <div className="relative flex flex-col gap-[80px] py-[80px] md:w-full md:gap-0 md:py-0 md:flex-row md:items-stretch">
        {/* Bloc gauche — prise de rendez-vous. Le divider est un simple border-right sur
            ce bloc (pas un 3e élément séparé) : comme le bloc s'étire déjà sur toute la
            hauteur du conteneur, la bordure s'étend naturellement sur toute cette hauteur. */}
        <div className="flex flex-col items-center justify-center px-6 md:flex-1 md:py-[68px] md:border-r" style={{ borderColor: "rgba(186, 182, 170, 0.4)" }}>
          <div className="w-full max-w-[324px] md:max-w-none flex flex-col items-center gap-[34px]">
            <p
              ref={appointmentTitleRef}
              className="cta-title whitespace-nowrap text-center text-cream font-normal text-[24px] md:text-[32px] leading-[1.25]"
            >
              {ctaStrings.appointment.titleLine1}
              <br />
              {ctaStrings.appointment.titleLine2}
            </p>
            <button
              type="button"
              onClick={openContact}
              className="w-full px-[17px] py-[14px] text-[14px] font-medium uppercase tracking-[1.1px] transition-opacity duration-200 hover:opacity-80"
              style={{
                backgroundColor: "#EAE7E3",
                color: "#2C2927",
                width: isDesktop && appointmentTitleWidth ? appointmentTitleWidth : undefined,
              }}
            >
              {ctaStrings.appointment.button}
            </button>
          </div>
        </div>

        {/* Bloc droit — newsletter */}
        <div className="flex flex-col items-center justify-center px-6 md:flex-1 md:py-[68px]">
          <div className="w-full max-w-[324px] md:max-w-none flex flex-col items-center gap-[34px]">
            <p
              ref={newsletterTitleRef}
              className="cta-title whitespace-nowrap text-center text-cream font-normal text-[24px] md:text-[32px] leading-[1.25]"
            >
              {ctaStrings.newsletter.titleLine1}
              <br />
              {ctaStrings.newsletter.titleLine2}
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full flex items-stretch"
              style={{ width: isDesktop && newsletterTitleWidth ? newsletterTitleWidth : undefined }}
            >
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
                className="shrink-0 px-[17px] py-[12px] text-[14px] font-medium uppercase tracking-[1.3px] transition-opacity duration-200 hover:opacity-80"
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
