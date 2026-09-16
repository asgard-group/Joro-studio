import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { homeHeroStrings } from "@/lib/strings";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ServicesAll from "@/components/sections/ServicesAll";
import ServiceReveal from "@/components/sections/ServiceReveal";
import FeaturedWork from "@/components/sections/FeaturedWork";
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
        title={
          <>
            <span className="block">{homeHeroStrings.title.line1}</span>
            <span className="block">{homeHeroStrings.title.line2}</span>
            <span className="block font-normal italic">
              {/* 1 seule ligne à partir de 470px (tablette et desktop), 2 lignes en dessous (mobile) */}
              <span className="block min-[470px]:inline">{homeHeroStrings.title.line3a}</span>
              <span className="hidden min-[470px]:inline">&nbsp;</span>
              <span className="block min-[470px]:inline">{homeHeroStrings.title.line3b}</span>
            </span>
          </>
        }
        description={
          <>
            <span className="hidden min-[835px]:inline">
              {homeHeroStrings.descriptionDesktop.line1}
              <br />
              {homeHeroStrings.descriptionDesktop.line2}
              <br />
              {homeHeroStrings.descriptionDesktop.line3}
              <br />
              {homeHeroStrings.descriptionDesktop.line4}
            </span>
            <span className="hidden min-[470px]:inline min-[835px]:hidden">
              {homeHeroStrings.descriptionTablet.line1}
              <br />
              {homeHeroStrings.descriptionTablet.line2}
              <br />
              {homeHeroStrings.descriptionTablet.line3}
            </span>
            <span className="min-[470px]:hidden">
              {homeHeroStrings.descriptionMobile.line1}
              <br />
              {homeHeroStrings.descriptionMobile.line2}
              <br />
              {homeHeroStrings.descriptionMobile.line3}
            </span>
          </>
        }
        image="/images/BG.png"
        overlay={false}
      />

      {/* À propos — Notre histoire (avec animation clip-path révélation au scroll) */}
      <div id="notre-studio">
        <AboutHistory />
      </div>

      {/* Services + FeaturedWork — un seul conteneur sticky pour tout l'enchaînement */}
      <div id="nos-offres">
        <ServicesAll />
      </div>
      <div className="relative md:h-[450vh] md:-mt-[100vh]">
        {/* Ancres absolues (desktop uniquement — scroll-jack au format mobile désactivé, offres empilées normalement) */}
        <div id="amo" className="hidden md:block" style={{ position: "absolute", top: 0 }} />
        <div id="marketing-suite" className="hidden md:block" style={{ position: "absolute", top: "100vh" }} />
        <div id="conseil-workplace" className="hidden md:block" style={{ position: "absolute", top: "200vh" }} />

        <div className="hidden md:block md:sticky md:top-0 h-screen" style={{ zIndex: 40 }}>
          <ServiceReveal
            activeId="amo"
            title="AMO"
            description="Assistance à la maîtrise d'ouvrage : conseil en faisabilité, diagnostic RSE et accompagnement à la certification, nous vous guidons à chaque étape stratégique de votre projet."
            ctaLabel="Être accompagné"
            video="/videos/Composition 1.webm"
            flipX
            noParallax
          />
        </div>
        <div className="hidden md:block md:sticky md:top-0 h-screen" style={{ zIndex: 50 }}>
          <ServiceReveal
            activeId="marketing-suite"
            title="MARKETING SUITE"
            description="Des supports visuels et des espaces de présentation pensés pour valoriser vos actifs immobiliers pour que votre projet trouve son acquéreur avant même d'être livré."
            ctaLabel="Valoriser mon actif"
            video="/videos/vecteezy_elegant-wooden-lamp-casting-warm-light-in-cozy-room_73284090.mp4"
            overlayClass="bg-[rgba(96,96,96,0.2)] mix-blend-lighten"
            noParallax
          />
        </div>
        {/* Conseil Workplace — desktop uniquement (mobile géré par le carrousel) */}
        <div className="hidden md:block md:sticky md:top-0 h-screen" style={{ zIndex: 60 }}>
          <ServiceReveal
            activeId="conseil-workplace"
            title={"CONSEIL WORKPLACE &\nSTRATÉGIE IMMOBILIÈRE"}
            description="Nous vous aidons à définir une stratégie immobilière alignée sur vos ambitions. Une approche conseil qui conjugue vision long terme, culture d'entreprise et exigence de qualité."
            ctaLabel="Affiner ma stratégie"
            video="/videos/vecteezy_4k-animation-angled-view-of-modern-building-with-clear-blue_40552327.webm"
            flipX
            wide
            zoomed
            overlayClass="bg-charcoal/20 mix-blend-soft-light"
            noParallax
          />
        </div>
      </div>

      {/* FeaturedWork — se superpose aux offres depuis l'arrivée de Conseil Workplace (desktop), colonne unique sur mobile */}
      <div id="nos-realisations" className="md:-mt-[250vh]">
        <FeaturedWork items={featuredWork} />
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
