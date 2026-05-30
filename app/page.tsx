import type { Metadata } from "next";
import ComingSoonLink from "@/components/ui/ComingSoonLink";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ServicesAll from "@/components/sections/ServicesAll";
import ServiceReveal from "@/components/sections/ServiceReveal";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ServicesAccordion from "@/components/sections/ServicesAccordion";
import { workItems } from "@/data/work";

export const metadata: Metadata = buildMetadata({
  title: "JÖRO Studio — Architecture intérieure & espaces hybrides durables",
  description:
    "JÖRO Studio conçoit et réalise des espaces hybrides haut de gamme : bureaux, hôtellerie, résidentiel. Design contemporain et engagement écologique depuis 2022.",
  alternates: { canonical: "/" },
});

export default function HomePage() {
  const featuredWork = workItems.filter((w) => w.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Hero
        eyebrow="Architecture & Design d'intérieur"
        title={<>Concevoir les espaces<br />hybrides de demain</>}
        video="/vidéos/final.mp4"
        scrollCta="Découvrir notre studio"
      />

      {/* Notre vision */}
      <section className="pt-[120px] pb-[160px] lg:pt-[160px] lg:pb-[200px] bg-[#F3F2ED] overflow-hidden">

        {/* Bloc texte : titre gauche / texte+lien droite sur desktop */}
        <div className="px-4 sm:px-6 lg:px-[60px] mb-[60px] lg:mb-[145px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_550px] lg:gap-16">

            {/* Gauche — eyebrow + titre */}
            <div>
              <p className="text-[12px] font-medium uppercase tracking-widest text-charcoal mb-4">
                Notre vision
              </p>
              <h2 className="text-[36px] sm:text-[42px] lg:text-[46px] font-semibold leading-tight tracking-tight text-charcoal">
                Une réflexion architecturale<br />au cœur de chaque projet
              </h2>
            </div>

            {/* Droite — texte + lien, aligné sous le tag "Notre vision" */}
            <div className="mt-10 lg:mt-0 lg:pt-[34px] flex flex-col justify-start">
              <p className="text-[16px] leading-relaxed text-charcoal-muted mb-8">
                Chez Jöro Studio, nous transformons les espaces en lieux de vie authentiques,
                conjuguant qualité haut de gamme, design contemporain et responsabilité
                écologique. Notre studio a une vision claire : devenir leaders de la conception
                d'espaces dédiés aux nouveaux usages urbains, bureaux, événementiel,
                hôtellerie lifestyle.
              </p>
              <ComingSoonLink className="text-[12px] font-medium uppercase tracking-widest text-charcoal-muted border-b border-charcoal-muted pb-1 self-start">
                Découvrir notre histoire
              </ComingSoonLink>
            </div>

          </div>
        </div>

        {/* Photo + Accordion services */}
        <ServicesAccordion />

      </section>

      {/* Services — intro + 4 cartes dans le même conteneur sticky */}
      <ServicesAll />
      <div className="relative" style={{ height: "350vh", marginTop: "-100vh" }}>
        {/* Ancres absolues — non-sticky, position réelle dans le document */}
        <div id="amo" style={{ position: "absolute", top: 0 }} />
        <div id="marketing-suite" style={{ position: "absolute", top: "100vh" }} />
        <div id="conseil-workplace" style={{ position: "absolute", top: "200vh" }} />

        <div className="sticky top-0 h-screen" style={{ zIndex: 40 }}>
          <ServiceReveal
            activeId="amo"
            title="AMO"
            description="Assistance à maîtrise d'ouvrage : nous vous accompagnons à chaque étape de votre projet, de la définition du programme jusqu'à la livraison."
            video="/vidéos/Composition 1.mp4"
          />
        </div>
        <div className="sticky top-0 h-screen" style={{ zIndex: 50 }}>
          <ServiceReveal
            activeId="marketing-suite"
            title="MARKETING SUITE"
            description="Des espaces de démonstration et de commercialisation pensés pour valoriser vos actifs immobiliers et séduire vos futurs acquéreurs."
            image="/images/Frame 207.png"
            overlayClass="bg-[#1C2626]/20 mix-blend-color-burn"
          />
        </div>
        <div className="sticky top-0 h-screen" style={{ zIndex: 60 }}>
          <ServiceReveal
            activeId="conseil-workplace"
            title={"CONSEIL WORKPLACE &\nSTRATÉGIE IMMOBILIÈRE"}
            description="Nous vous aidons à définir votre stratégie immobilière, optimiser vos espaces de travail et anticiper les nouveaux usages urbains."
            video="/vidéos/vecteezy_4k-animation-angled-view-of-modern-building-with-clear-blue_40552327.mp4"
            flipX
            wide
            overlayClass="bg-[#1C2626]/20 mix-blend-soft-light"
          />
        </div>
      </div>

      <FeaturedWork items={featuredWork} />

      <Testimonials />

      <CTA />
    </>
  );
}
