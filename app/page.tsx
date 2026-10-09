import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { homeHeroStrings } from "@/lib/strings";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ServicesAll from "@/components/sections/ServicesAll";
import ServiceReveal from "@/components/sections/ServiceReveal";
import ServiceStage from "@/components/sections/ServiceStage";
import FeaturedWork from "@/components/sections/FeaturedWork";
import AboutStudio from "@/components/sections/AboutStudio";

export const metadata: Metadata = buildMetadata({
  title: "JÖRO Studio — Architecture, AMO & Travaux",
  description:
    "JÖRO Studio conçoit et réalise des espaces hybrides haut de gamme : bureaux, hôtellerie, résidentiel. Design contemporain et engagement écologique depuis 2022.",
  alternates: { canonical: "/" },
});

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        headingLines={homeHeroStrings.headingLines}
        text={homeHeroStrings.lead}
        ctaLabel={homeHeroStrings.discover}
        ctaHref="#nos-realisations"
        scrollHint={homeHeroStrings.scroll}
        image="/images/hero.webp"
      />

      {/* À propos — Notre studio (statique, sans animation) */}
      <div id="notre-studio">
        <AboutStudio />
      </div>

      {/* Services + FeaturedWork — un seul conteneur sticky pour tout l'enchaînement */}
      <div id="nos-offres">
        <ServicesAll />
      </div>
      {/* Transition AMO → Marketing Suite → Conseil : chaque service se dévoile par le bas
          (clip-path) par-dessus le précédent, pendant que l'image fait un léger parallaxe
          (cf. ServiceStage). Démarre 200vh avant la fin de ServicesAll, comme l'entrée d'AMO. */}
      <ServiceStage>
      <ServiceReveal
          activeId="amo"
          title="AMO"
          description="Assistance à la maîtrise d'ouvrage : conseil en faisabilité, diagnostic RSE et accompagnement à la certification, nous vous guidons à chaque étape stratégique de votre projet."
          ctaLabel="Être accompagné"
          video="/videos/amo-web.webm"
          poster="/images/posters/amo-poster.webp"
          // Filtre Figma : aplat rgba(28,38,38,0.2), mode Color dodge
          overlayClass="bg-[rgba(28,38,38,0.2)] mix-blend-color-dodge"
      />
      <ServiceReveal
          activeId="marketing-suite"
          title="Marketing Suite"
          description="Des supports visuels et des espaces de présentation pensés pour valoriser vos actifs immobiliers pour que votre projet trouve son acquéreur avant même d'être livré."
          ctaLabel="Valoriser mon actif"
          video="/videos/marketing-suite-web.webm"
          poster="/images/posters/marketing-suite-poster.webp"
          overlayClass="bg-[rgba(96,96,96,0.2)] mix-blend-lighten"
      />
      <ServiceReveal
          activeId="conseil-workplace"
          title="Conseil & Stratégie"
          description="Nous vous aidons à définir une stratégie immobilière alignée sur vos ambitions. Une approche conseil qui conjugue vision long terme, culture d'entreprise et exigence de qualité."
          ctaLabel="Affiner ma stratégie"
          video="/videos/conseil-workplace-web.webm"
          poster="/images/posters/conseil-workplace-poster.webp"
          wide
          zoomed
          overlayClass="bg-charcoal/20 mix-blend-soft-light"
          // Filtre Figma : dégradé linéaire rgba(106,125,149,1) → rgba(106,125,149,0), 60 %,
          // mode Plus darker (repli multiply hors Safari, cf. .blend-plus-darker). Sens :
          // opaque à gauche → transparent à droite.
          gradientOverlayClass="blend-plus-darker"
          gradientOverlayStyle={{
            background: "linear-gradient(to right, rgba(106, 125, 149, 1), rgba(106, 125, 149, 0))",
            opacity: 0.6,
          }}
      />
      </ServiceStage>

      <div id="nos-realisations">
        <FeaturedWork />
      </div>

      <div id="temoignages" style={{ marginTop: "-1px" }}>
        <Testimonials />
      </div>

      <div id="contact">
        <CTA />
      </div>
    </>
  );
}
