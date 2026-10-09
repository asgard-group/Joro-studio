"use client";

import { useConsent } from "@/components/providers/ConsentProvider";

// Bandeau cookies : fond charbon, texte crème, collé au bas de la page et aux deux côtés. Mobile : paragraphe puis boutons
// pleine largeur (20px d'écart). Desktop : barre, paragraphe à gauche et boutons à droite (32px
// d'écart). div et non p pour le texte : la règle globale `p { font-size: 14px !important }`
// sous 768px écraserait les 12px.
export default function CookieBanner() {
  const { consent, hydrated, grant, deny } = useConsent();

  if (!hydrated || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-50 bg-[#1C2626] text-cream shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
    >
      <div className="mx-auto flex max-w-[1100px] flex-col gap-[20px] p-[16px] min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between min-[768px]:gap-[32px] min-[768px]:px-[24px]">
        <div className="text-[12px] leading-[1.5] text-cream min-[768px]:text-[13px]">
          Nous utilisons des cookies pour améliorer la navigation sur le site, analyser son utilisation et
          contribuer à nos efforts de marketing.
          <a href="/privacy" className="mt-[2px] block w-fit underline underline-offset-2 transition-opacity hover:opacity-60">
            En savoir plus
          </a>
        </div>
        <div className="flex shrink-0 gap-[10px] max-[767px]:w-full">
          <button
            type="button"
            onClick={deny}
            className="px-[10px] py-[8px] text-[12px] font-medium uppercase leading-none tracking-[0.06em] text-[#BAB6AA] transition-opacity hover:opacity-70 max-[767px]:flex-1"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={grant}
            className="bg-[#EAE7E3] px-[10px] py-[8px] text-[12px] font-medium uppercase leading-none tracking-[0.06em] text-[#1C2626] transition-opacity hover:opacity-80 max-[767px]:flex-1"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
