import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import CTA from "@/components/sections/CTA";
import Card from "@/components/ui/Card";
import { services } from "@/data/services";

export const metadata: Metadata = buildMetadata({
  title: "À propos — JÖRO Studio",
  description:
    "Découvrez l'histoire, la vision et les valeurs de JÖRO Studio. Fondé en 2022 par Romain Ruby, notre atelier conçoit les espaces hybrides de demain.",
  alternates: { canonical: "/about" },
});

const values = [
  {
    title: "Engagement environnemental",
    description:
      "Nous intégrons une démarche écologique dans la conception, les achats et la réalisation de tous nos projets. Réemploi, matériaux biosourcés et solutions basse consommation sont au cœur de notre pratique.",
  },
  {
    title: "Innovation",
    description:
      "Nous cultivons l'innovation continue afin d'atteindre l'excellence opérationnelle dans chacune de nos missions. Chaque projet est une opportunité de repousser les limites du possible.",
  },
  {
    title: "Customer focus",
    description:
      "Nous plaçons nos clients au cœur de notre approche, en leur offrant un service personnalisé, transparent et adapté à leurs besoins spécifiques. Votre réussite est notre mesure.",
  },
  {
    title: "Artisanat & Savoir-faire",
    description:
      "Nous valorisons le travail manuel, les techniques traditionnelles et le talent artisanal, gages d'authenticité et de qualité. Chaque détail est pensé, chaque matériau sélectionné avec soin.",
  },
  {
    title: "Intégrité",
    description:
      "Nous agissons toujours avec respect, éthique et transparence, garants de la confiance que nous accordent nos partenaires et clients. Honnêteté et rigueur guident chacune de nos décisions.",
  },
];

const timeline = [
  {
    year: "2020",
    title: "Naissance de JÖRO Office",
    desc: "Lancement de l'opérateur de bureaux opérés à Paris.",
  },
  {
    year: "2022",
    title: "Création de JÖRO Studio",
    desc: "Romain Ruby fonde le studio pour internaliser l'architecture intérieure et les travaux.",
  },
  {
    year: "2023",
    title: "Expansion nationale",
    desc: "Premiers projets en dehors de Paris : Lyon, Bordeaux, Nantes.",
  },
  {
    year: "2024",
    title: "Écosystème JÖRO complet",
    desc: "JÖRO Meeting et JÖRO Living rejoignent l'offre pour couvrir tous les nouveaux usages urbains.",
  },
  {
    year: "2025+",
    title: "Vision 2027",
    desc: "Devenir un des leaders de la conception d'espaces dédiés aux nouveaux usages urbains en France.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-charcoal pb-20 pt-36 text-cream">
        <div className="container-site">
          <p className="label-eyebrow mb-6 text-terracotta-200">À propos</p>
          <h1 className="heading-display max-w-3xl">
            Une vision, une obsession : les espaces qui{" "}
            <em className="not-italic text-terracotta">inspirent</em>
          </h1>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-24">
        <div className="container-site">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="label-eyebrow mb-6">Notre histoire</p>
              <h2 className="heading-section mb-6">
                Né d'un constat, porté par une ambition
              </h2>
              <div className="flex flex-col gap-4 text-charcoal-muted leading-relaxed">
                <p>
                  L'idée de JÖRO Studio est née d'un constat simple mais
                  fondamental : il est aujourd'hui complexe de concevoir des
                  espaces à la fois innovants, élégants et réellement respectueux
                  de l'environnement.
                </p>
                <p>
                  Souvent contraints de faire des compromis entre esthétique,
                  fonctionnalité et durabilité, nous étions frustrés de ne pas
                  trouver une offre répondant pleinement aux attentes des
                  entreprises et particuliers engagés pour l'avenir.
                </p>
                <p>
                  Pour combler ce manque, Romain Ruby a créé JÖRO Studio en 2022 :
                  une approche novatrice de l'architecture et des travaux, où chaque
                  projet conjugue qualité haut de gamme, design contemporain et
                  responsabilité écologique.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/work/portfolio-6.jpg"
                alt="L'équipe JÖRO Studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-cream-200 py-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <p className="label-eyebrow mb-6">Notre mission</p>
            <h2 className="heading-section mb-8">
              Concevoir et réaliser les espaces hybrides de demain
            </h2>
            <p className="text-lg leading-relaxed text-charcoal-muted">
              Nous souhaitons imaginer des lieux de vie pour nos clients qui
              seront à la fois{" "}
              <strong className="text-charcoal">hybrides</strong>,{" "}
              <strong className="text-charcoal">responsables</strong>,{" "}
              <strong className="text-charcoal">ouverts et accueillants</strong>,
              ainsi qu'
              <strong className="text-charcoal">
                innovants et technologiques
              </strong>
              .
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Hybride", "Responsable", "Ouvert & Accueillant", "Innovant & Technologique"].map(
              (pilier) => (
                <div
                  key={pilier}
                  className="border border-cream-300 bg-cream p-6 text-center"
                >
                  <p className="font-serif text-lg text-charcoal">{pilier}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Écosystème */}
      <section className="py-24">
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

      {/* Values */}
      <section className="py-24">
        <div className="container-site">
          <div className="mb-16 max-w-xl">
            <p className="label-eyebrow mb-4">Ce qui nous guide</p>
            <h2 className="heading-section">Nos valeurs</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <div key={value.title} className="flex flex-col gap-4 border-t-2 border-terracotta pt-6">
                <span className="font-serif text-sm text-terracotta">
                  0{i + 1}
                </span>
                <h3 className="font-serif text-xl text-charcoal">{value.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal-muted">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-charcoal py-24 text-cream">
        <div className="container-site">
          <div className="mb-16 max-w-xl">
            <p className="label-eyebrow mb-4 text-terracotta-200">Notre parcours</p>
            <h2 className="heading-section">De l'idée à l'ambition</h2>
          </div>
          <ol className="relative border-l border-cream/20">
            {timeline.map((item) => (
              <li key={item.year} className="mb-10 ml-8">
                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-terracotta">
                  <span className="h-2 w-2 rounded-full bg-cream" />
                </span>
                <p className="label-eyebrow mb-1 text-terracotta-200">{item.year}</p>
                <h3 className="mb-2 font-serif text-lg text-cream">{item.title}</h3>
                <p className="text-sm text-cream/60">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTA
        eyebrow="Travaillons ensemble"
        title="Votre projet mérite l'excellence"
        description="Discutons de vos ambitions et voyons comment JÖRO Studio peut vous accompagner dans la création de votre espace idéal."
        primaryCta={{ label: "Prendre contact", href: "/contact" }}
        secondaryCta={{ label: "Nos réalisations", href: "/work" }}
      />
    </>
  );
}
