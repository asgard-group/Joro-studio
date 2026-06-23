import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ServicesAll from "@/components/sections/ServicesAll";
import ServiceReveal from "@/components/sections/ServiceReveal";
import FeaturedWork, { MobileFeaturedWork } from "@/components/sections/FeaturedWork";
import AboutHistory from "@/components/sections/AboutHistory";
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
        video="/videos/Transition 3_5.webm"
        scrollCta="Découvrir notre studio"
      />

      {/* À propos — Notre histoire (avec animation clip-path révélation au scroll) */}
      <div id="notre-studio">
        <AboutHistory />
      </div>

      {/* Services + FeaturedWork — un seul conteneur sticky pour tout l'enchaînement */}
      <div id="nos-offres">
        <ServicesAll />
      </div>
      <div className="relative h-[350vh] md:h-[800vh]" style={{ marginTop: "-100vh" }}>
        {/* Ancres absolues */}
        <div id="amo" style={{ position: "absolute", top: 0 }} />
        <div id="marketing-suite" style={{ position: "absolute", top: "100vh" }} />
        <div id="conseil-workplace" style={{ position: "absolute", top: "200vh" }} />

        <div className="sticky top-0 h-screen" style={{ zIndex: 40 }}>
          <ServiceReveal
            activeId="amo"
            title="AMO"
            description="Assistance à la maîtrise d'ouvrage : conseil en faisabilité, diagnostic RSE et accompagnement à la certification, nous vous guidons à chaque étape stratégique de votre projet."
            ctaLabel="Être accompagné"
            video="/videos/Composition 1.mp4"
          />
        </div>
        <div className="sticky top-0 h-screen" style={{ zIndex: 50 }}>
          <ServiceReveal
            activeId="marketing-suite"
            title="MARKETING SUITE"
            description="Des supports visuels et des espaces de présentation pensés pour valoriser vos actifs immobiliers pour que votre projet trouve son acquéreur avant même d'être livré."
            ctaLabel="Valoriser mon actif"
            image="/images/Frame 207.png"
            overlayClass="bg-charcoal/25"
          />
        </div>
        <div className="sticky top-0 h-screen" style={{ zIndex: 60 }}>
          <ServiceReveal
            activeId="conseil-workplace"
            title={"CONSEIL WORKPLACE &\nSTRATÉGIE IMMOBILIÈRE"}
            description="Nous vous aidons à définir une stratégie immobilière alignée sur vos ambitions. Une approche conseil qui conjugue vision long terme, culture d'entreprise et exigence de qualité."
            ctaLabel="Affiner ma stratégie"
            video="/videos/vecteezy_4k-animation-angled-view-of-modern-building-with-clear-blue_40552327.mp4"
            flipX
            wide
            overlayClass="bg-charcoal/20 mix-blend-soft-light"
          />
        </div>

        {/* FeaturedWork — desktop split-screen + mobile empilé */}
        <div id="nos-realisations">
          <FeaturedWork items={featuredWork} total={featuredWork.length} />
        </div>
      </div>

      {/* Réalisations mobile — après le container des services */}
      <MobileFeaturedWork items={featuredWork} />

      <div style={{ marginTop: "-1px" }}>
        <Testimonials />
      </div>

      <div id="contact">
        <CTA />
      </div>
    </>
  );
}
