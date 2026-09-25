"use client";

import Image from "next/image";
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
  const formSide = (
    <div className="joro-contact__form-wrap">
      <button
        type="button"
        onClick={onClose}
        aria-label={strings.closeAriaLabel}
        className="self-start inline-flex items-center gap-[6px] bg-transparent border-0 p-0 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-[30px] h-[30px] text-cream"
          style={{ filter: "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)" }}
        >
          <line x1="2" y1="2" x2="14" y2="14" />
          <line x1="14" y1="2" x2="2" y2="14" />
        </svg>
      </button>

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
        src="/images/2024-10-Retines-Asgard-parquet-Pigalle-DSC04495.webp"
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
        className={`joro-contact${isOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={strings.dialogAriaLabel}
      >
        <div className="joro-contact__body">
          {photoSide}
          {formSide}
        </div>
      </div>
    </>
  );
}
