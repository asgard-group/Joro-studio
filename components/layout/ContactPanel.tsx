"use client";

import Image from "next/image";
import { useContactPanel } from "@/components/providers/ContactPanelProvider";
import Script from "next/script";
import { headerStrings } from "@/lib/strings";

const { contactPanel: strings } = headerStrings;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Panneau plein écran pour la demande de contact — même mécanique d'ouverture/
// fermeture que FullscreenMenu (clip-path + translateX pilotés en CSS via la
// classe `is-open`), mais toujours depuis la droite (`.joro-contact`, miroir de
// `.joro-menu` — cf. globals.css) : le bouton Contact est désormais toujours
// ancré à droite (navbar principale, MiniNavbar, Footer, CTA), plus besoin de
// gérer un changement de côté en cours d'ouverture.
export default function ContactPanel({ isOpen, onClose }: Props) {
  // Photo déjà affichée par le menu ouvert dessous : seul le bloc sombre s'anime (cf. globals.css).
  const { keepPhoto } = useContactPanel();
  const formSide = (
    <div className="joro-contact__form-wrap">

      {/* Formulaire HubSpot embarqué (portail 145387833) — le script
          cherche ce div par data-form-id au chargement et y injecte
          l'iframe du formulaire. Centré verticalement dans l'espace
          restant sous la croix. */}
      <div className="flex flex-1 flex-col justify-center">
        <div
          className="hs-form-frame"
          data-region="eu1"
          data-form-id="6fe859d7-a258-4ba1-a67a-a317895b4758"
          data-portal-id="145387833"
        />
        <Script src="https://js-eu1.hsforms.net/forms/embed/145387833.js" strategy="afterInteractive" defer />
      </div>
    </div>
  );

  const photoSide = (
    <div className="joro-contact__photo" aria-hidden="true">
      <Image
        src="/images/contact.png"
        alt=""
        fill
        className="joro-contact__photo-img"
        sizes="50vw"
      />
    </div>
  );

  return (
    <>
      <div className={`joro-contact__backdrop${isOpen ? " is-visible" : ""}`} aria-hidden="true" />
      <div
        className={`joro-contact${keepPhoto ? " joro-contact--keep-photo" : ""}${isOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={strings.dialogAriaLabel}
      >
        {/* Bouton de fermeture : même texte, même style, mêmes marges et même position (haut droite)
            que « Fermer » du menu ouvert (cf. FullscreenMenu.tsx) : 16 / 32 / 40 px, haut 24 px. */}
        <div className="joro-contact__close absolute inset-x-0 top-0 z-20 mx-auto max-w-[1920px] px-[16px] min-[835px]:px-[32px] min-[1280px]:px-[40px]">
          <div className="flex items-center justify-end pt-[24px] pb-[20px]">
            <button
              type="button"
              onClick={onClose}
              aria-label={strings.closeAriaLabel}
              className="bg-transparent border-0 p-0 cursor-pointer text-[13px] font-semibold uppercase tracking-[0.08em] text-cream transition-opacity hover:opacity-60"
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="joro-contact__body">
          {photoSide}
          {formSide}
        </div>
      </div>
    </>
  );
}
