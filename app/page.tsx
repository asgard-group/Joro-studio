import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ServicesAll from "@/components/sections/ServicesAll";
import ServiceReveal from "@/components/sections/ServiceReveal";
import FeaturedWork from "@/components/sections/FeaturedWork";
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

      {/* À propos — Notre histoire */}
      <section className="py-[80px] lg:py-[200px] bg-[#F3F2ED] overflow-hidden">

        {/* Bloc texte : titre gauche / description droite */}
        <div className="px-4 sm:px-6 lg:px-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">

            {/* Gauche — label pill + titre */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              <div
                className="inline-flex self-start items-center justify-center"
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 10000,
                  outline: "1px black solid",
                  outlineOffset: "-1px",
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    color: "#1C2626",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  NOTRE HISTOIRE
                </span>
              </div>
              <h2
                className="font-semibold tracking-tight text-[40px] sm:text-[48px] lg:text-[64px]"
                style={{ color: "#1C2626", lineHeight: "130%" }}
              >
                Une réflexion architecturale
              </h2>
            </div>

            {/* Droite — description */}
            <div className="mt-10 lg:mt-0">
              <p
                className="font-medium"
                style={{
                  color: "#1C2626",
                  fontSize: 16,
                  lineHeight: "26px",
                }}
              >
                Notre studio est né d&rsquo;un constat simple : il est aujourd&rsquo;hui difficile de concevoir des espaces qui allient innovation, élégance et respect de l&rsquo;environnement. Pour répondre à ce défi, nous avons créé JORO Studio, une approche nouvelle de l&rsquo;architecture et des travaux où chaque projet est pensé dans les moindres détails afin de conjuguer qualité haut de gamme, design contemporain et responsabilité écologique.
              </p>
            </div>

          </div>
        </div>

        {/* Bloc 2 photos — pas de padding latéral, gap 30px */}
        <div
          className="mt-[60px] lg:mt-[150px] grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 30 }}
        >
          <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
            <Image
              src="/images/1.png"
              alt="JÖRO Office — salle de réunion"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
            <Image
              src="/images/f11417fe33c2cc32ef0ecc7b3c1c059e.jpg"
              alt="JÖRO Studio — espace lounge"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

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
