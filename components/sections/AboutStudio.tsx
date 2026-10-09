import Image from "next/image";
import { aboutStudioStrings } from "@/lib/strings";
import RevealText from "@/components/ui/RevealText";

// Section "Notre studio" — statique (aucune animation). Mise en page 100 %
// fluide : toutes les valeurs sont dans globals.css (.studio, variable --s).
export default function AboutStudio() {
  return (
    <section data-navbar-theme="light" className="studio">
      <div className="studio__inner">
        {/* Cercles décoratifs — derrière le contenu, non cliquables, coupés par
            le overflow:hidden de la section. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG décoratif positionné en absolu, next/image n'apporte rien ici */}
        <img src="/images/logos/svg.svg" alt="" aria-hidden="true" className="studio__ring" />

        <RevealText as="h2" className="studio__title">{aboutStudioStrings.title}</RevealText>
        {/* div (et non p) : la règle globale `p { font-size: 14px !important }`
            sous 768px écraserait la taille de maquette. */}
        <RevealText as="div" className="studio__text" delay={0.15} step={0.07}>{aboutStudioStrings.text}</RevealText>
        <div className="studio__image">
          <Image
            src="/images/à propos.png"
            alt={aboutStudioStrings.imageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 806px, (min-width: 834px) 480px, 100vw"
          />
        </div>
        <div className="studio__label">
          <span className="studio__dot" aria-hidden="true" />
          {aboutStudioStrings.label}
        </div>
      </div>
    </section>
  );
}
