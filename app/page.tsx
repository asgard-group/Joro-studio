import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Card from "@/components/ui/Card";
import ParallaxImage from "@/components/ui/ParallaxImage";
import ServicesAll from "@/components/sections/ServicesAll";
import ServiceReveal from "@/components/sections/ServiceReveal";
import { services } from "@/data/services";
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
        image="/images/hero2.png"
        scrollCta="Découvrir notre studio"
      />

      {/* Notre vision */}
      <section className="pt-[200px] pb-[200px] bg-[#F3F2ED] overflow-hidden">
        <div className="container-site">
          <div className="md:pl-[22%]">
            <p className="text-[12px] font-medium uppercase tracking-widest text-charcoal mb-4">
              Notre vision
            </p>
            <h2 className="text-[46px] font-semibold leading-tight tracking-tight text-charcoal mb-[40px] md:mb-[50px]">
              Repenser les espaces dédiés aux<br />nouveaux usages urbains
            </h2>
          </div>
        </div>

        {/* Photo — bord gauche aligné sur le heading, bord droit touche l'écran */}
        <div className="mb-[40px] md:mb-[50px] pl-4 sm:pl-6 md:pl-[calc(0.84rem+22%)] lg:pl-[calc(1.12rem+22%)] xl:pl-[calc((100vw-80rem)/2+18.72rem)]">
          <ParallaxImage
            src="/images/desk.jpg"
            alt="Espace JÖRO Studio"
            aspectClass="aspect-[2/1]"
          />
        </div>

        <div className="container-site">
          <div className="md:pl-[22%]">
            <div className="max-w-[380px]">
              <p className="text-[16px] leading-relaxed text-charcoal-muted mb-8">
                Chez Jöro Studio, nous transformons les espaces en lieux de vie authentiques,
                conjuguant qualité haut de gamme, design contemporain et responsabilité
                écologique. Notre studio a une vision claire : devenir leaders de la conception
                d'espaces dédiés aux nouveaux usages urbains, bureaux, événementiel,
                hôtellerie lifestyle.
              </p>
              <Link
                href="/about"
                className="text-[12px] font-medium uppercase tracking-widest text-charcoal-muted border-b border-charcoal-muted pb-1 hover:text-charcoal hover:border-charcoal transition-colors"
              >
                Découvrir notre histoire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services — intro + 4 cartes dans le même conteneur sticky */}
      <ServicesAll />
      <div className="relative" style={{ height: "400vh", marginTop: "-100vh" }}>
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
          />
        </div>
        <div className="sticky top-0 h-screen" style={{ zIndex: 60 }}>
          <ServiceReveal
            activeId="conseil-workplace"
            title={"CONSEIL WORKPLACE\n& STRATÉGIE IMMOBILIÈRE"}
            description="Nous vous aidons à définir votre stratégie immobilière, optimiser vos espaces de travail et anticiper les nouveaux usages urbains."
            video="/vidéos/vecteezy_4k-animation-angled-view-of-modern-building-with-clear-blue_40552327.mp4"
            flipX
          />
        </div>
      </div>

      {/* Featured work */}
      <section className="py-24">
        <div className="container-site">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="label-eyebrow mb-4">Réalisations</p>
              <h2 className="heading-section">Nos projets récents</h2>
            </div>
            <Link href="/work" className="btn-ghost shrink-0">
              Voir toutes les réalisations →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featuredWork.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.category}
                description={item.description}
                image={item.coverImage}
                href={`/work/${item.id}`}
                tags={[item.location, item.year]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="border-y border-cream-300 bg-cream py-16">
        <div className="container-site">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🌿",
                title: "Engagement environnemental",
                desc: "Réemploi, matériaux biosourcés, basse consommation.",
              },
              {
                icon: "✦",
                title: "Innovation",
                desc: "Excellence opérationnelle et amélioration continue.",
              },
              {
                icon: "◎",
                title: "Customer focus",
                desc: "Service personnalisé, transparent, adapté.",
              },
              {
                icon: "⬡",
                title: "Artisanat & Savoir-faire",
                desc: "Techniques traditionnelles, talent artisanal.",
              },
            ].map((v) => (
              <div key={v.title} className="flex flex-col gap-3">
                <span className="text-2xl" role="img" aria-hidden>
                  {v.icon}
                </span>
                <h3 className="font-semibold text-charcoal">{v.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal-muted">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <CTA
        eyebrow="Parlons de votre projet"
        title="Transformez vos espaces avec JÖRO Studio"
        description="Que vous soyez asset manager, directeur immobilier ou prescripteur, notre équipe est disponible pour étudier votre projet."
        primaryCta={{ label: "Prendre contact", href: "/contact" }}
        secondaryCta={{ label: "Voir nos réalisations", href: "/work" }}
      />
    </>
  );
}
