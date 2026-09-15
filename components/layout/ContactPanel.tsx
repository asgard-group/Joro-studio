"use client";

import Image from "next/image";
import { headerStrings } from "@/lib/strings";

const { contactPanel: strings } = headerStrings;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Panneau plein écran pour la demande de contact — même mécanique d'ouverture/
// fermeture que FullscreenMenu (clip-path + translateX pilotés en CSS via la
// classe `is-open`). Le bouton Contact est maintenant à gauche de la navbar :
// le panneau s'ouvre donc depuis la gauche, en réutilisant la classe
// d'animation `.joro-menu` (balayage gauche → droite), qui n'a rien à voir
// avec le menu plein écran lui-même, seulement avec son sens d'ouverture. Le
// formulaire (côté de l'ouverture) est donc à gauche, la photo à droite.
export default function ContactPanel({ isOpen, onClose }: Props) {
  // Aucun endpoint n'est encore branché (même state qu'ailleurs sur le site,
  // cf. Footer.tsx) : on empêche seulement le rechargement de page pour l'instant.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      <div className={`joro-contact__backdrop${isOpen ? " is-visible" : ""}`} aria-hidden="true" />
      <div
        className={`joro-menu${isOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={strings.dialogAriaLabel}
      >
        {/* Top bar — bouton de fermeture, même position/style que FullscreenMenu */}
        <div className="absolute inset-x-0 top-0 z-20 px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px]">
          <div className="flex items-center pt-[40px] pb-[20px]">
            <button
              type="button"
              onClick={onClose}
              aria-label={strings.closeAriaLabel}
              className="inline-flex items-center gap-[6px] bg-transparent border-0 p-0 cursor-pointer"
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
          </div>
        </div>

        {/* Ordre inversé par rapport à avant : le panneau s'ouvrant désormais
            depuis la gauche, le formulaire (côté de l'ouverture) passe à
            gauche et la photo à droite. */}
        <div className="joro-contact__body">
          {/* Gauche — formulaire */}
          <div className="joro-contact__form-wrap">
            <div className="flex flex-1 flex-col justify-center gap-8 py-[100px] max-w-[460px]">
              <div className="flex flex-col gap-3">
                <h2 className="text-[28px] min-[900px]:text-[35px] font-normal uppercase leading-[1.15] text-[#FAF6ED]">
                  {strings.title}
                </h2>
                <p className="text-[14px] font-light leading-relaxed text-[#FAF6ED]">
                  {strings.intro}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <ContactTextarea name="projectDescription" label={strings.fields.projectDescription} />
                <ContactField name="projectType" label={strings.fields.projectType} />

                <div className="flex flex-row gap-4">
                  <ContactField name="budget" label={strings.fields.budget} className="flex-1" />
                  <ContactField name="surface" label={strings.fields.surface} className="flex-1" />
                </div>

                <div className="flex flex-row gap-4">
                  <ContactField name="firstName" label={strings.fields.firstName} className="flex-1" />
                  <ContactField name="lastName" label={strings.fields.lastName} className="flex-1" />
                </div>

                <div className="flex flex-row gap-4">
                  <ContactField name="email" label={strings.fields.email} type="email" className="flex-1" />
                  <ContactField name="phone" label={strings.fields.phone} type="tel" className="flex-1" />
                </div>

                <button
                  type="submit"
                  className="mt-4 self-start border-b border-[#FAF6ED] pb-1 text-[14px] font-medium uppercase tracking-[1.4px] text-[#FAF6ED] transition-opacity duration-200 hover:opacity-60"
                >
                  {strings.submit}
                </button>
              </form>
            </div>
          </div>

          {/* Droite — photo unique, statique (pas de survol/interaction) */}
          <div className="joro-contact__photo" aria-hidden="true">
            <Image
              src="/images/2024-10-Retines-Asgard-parquet-Pigalle-DSC04495.webp"
              alt=""
              fill
              className="joro-contact__photo-img"
              sizes="50vw"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Champ texte souligné — même esthétique que les champs de saisie du site.
function ContactField({
  name,
  label,
  type = "text",
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      required
      placeholder={`${label} *`}
      aria-label={label}
      className={`w-full min-w-0 border-b border-[#FAF6ED]/50 bg-transparent pb-2 text-[14px] tracking-[1.4px] text-[#FAF6ED] placeholder:uppercase placeholder:text-[#FAF6ED]/60 focus:border-[#FAF6ED] focus:outline-none ${className}`}
    />
  );
}

// Zone de texte soulignée — pour la courte présentation du projet.
function ContactTextarea({ name, label }: { name: string; label: string }) {
  return (
    <textarea
      name={name}
      required
      rows={3}
      placeholder={`${label} *`}
      aria-label={label}
      className="w-full min-w-0 resize-none border-b border-[#FAF6ED]/50 bg-transparent pb-2 text-[14px] tracking-[1.4px] text-[#FAF6ED] placeholder:uppercase placeholder:text-[#FAF6ED]/60 focus:border-[#FAF6ED] focus:outline-none"
    />
  );
}
