import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Card from "@/components/ui/Card";
import { services } from "@/data/services";
import { workItems } from "@/data/work";

export const metadata: Metadata = buildMetadata({
  title: "JÖRO Studio — Architecture intérieure & espaces hybrides durables",
  description:
    "JÖRO Studio conçoit et réalise des espaces hybrides haut de gamme : bureaux, hôtellerie, résidentiel. Design contemporain et engagement écologique depuis 2022.",
  alternates: { canonical: "/" },
});

const stats = [
  { value: "50+", label: "Projets livrés" },
  { value: "12", label: "Villes en France" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "2022", label: "Année de création" },
];

export default function HomePage() {
  const featuredWork = workItems.filter((w) => w.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Hero
        eyebrow="Architecture tetstestzatazegzeaf & Design d'intérieur"
        title="Concevoir les espaces hybrides"
        titleHighlight="de demain"
        subtitle="JÖRO Studio imagine et réalise des environnements haut de gamme alliant design contemporain, fonctionnalité et responsabilité écologique — pour les entreprises et investisseurs les plus exigeants."
        cta={{ label: "Découvrir nos réalisations", href: "/work" }}
        ctaSecondary={{ label: "Parler d'un projet", href: "/contact" }}
        image="/images/hero.jpeg"
      />

      {/* Stats */}
      <section className="border-b border-cream-300 bg-cream py-16">
        <div className="container-site">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="font-serif text-4xl font-normal text-terracotta lg:text-5xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-sm text-charcoal-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Intro / Manifeste */}
      <section className="py-24">
        <div className="container-site">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="label-eyebrow mb-6">Notre raison d'être</p>
              <h2 className="heading-section mb-6">
                L'exigence du design, l'impératif de la durabilité
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-charcoal-muted">
                Chez JÖRO Studio, nous refusons de choisir entre esthétique,
                performance et responsabilité environnementale. Chaque projet est
                conçu pour durer, inspirer et respecter les ressources de demain.
              </p>
              <p className="mb-10 leading-relaxed text-charcoal-muted">
                Fondé en 2022 par Romain Ruby dans la continuité de JÖRO Office,
                notre studio porte une vision claire : devenir un des leaders de la
                conception d'espaces dédiés aux nouveaux usages urbains — bureaux,
                événementiel, hôtellerie lifestyle.
              </p>
              <Link href="/about" className="btn-outline">
                Notre histoire
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/work/portfolio-2.jpg"
                alt="Espace JÖRO Studio — design et durabilité"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-cream-200 py-24">
        <div className="container-site">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="label-eyebrow mb-4">L'écosystème JÖRO</p>
              <h2 className="heading-section">Quatre offres, une exigence</h2>
            </div>
            <Link href="/services" className="btn-ghost shrink-0">
              Toutes nos offres →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card
                key={service.id}
                title={service.name}
                subtitle={service.tagline}
                description={service.description}
                href={service.href}
                image={service.image}
              />
            ))}
          </div>
        </div>
      </section>

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
