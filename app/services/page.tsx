import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { services } from "@/data/services";
import CTA from "@/components/sections/CTA";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = buildMetadata({
  title: "Nos offres — JÖRO Studio",
  description:
    "Découvrez les quatre offres de l'écosystème JÖRO : Office, Meeting, Living et Studio. Des espaces hybrides haut de gamme pour toutes vos ambitions.",
  alternates: { canonical: "/services" },
});

const faqItems = [
  {
    question: "JÖRO Studio prend-il en charge l'ensemble du projet ?",
    answer:
      "Oui. De la définition du programme à la livraison finale, nous pilotons l'ensemble du projet : conception, direction artistique, coordination des corps de métier, approvisionnement et suivi de chantier. Un interlocuteur unique pour plus de sérénité.",
  },
  {
    question: "Quels types de clients accompagnez-vous ?",
    answer:
      "Nos clients sont principalement des entreprises en croissance, des asset managers et des investisseurs institutionnels souhaitant valoriser leurs actifs tertiaires, ainsi que des opérateurs hôteliers et résidentiels exigeants.",
  },
  {
    question: "Comment intégrez-vous les enjeux de durabilité ?",
    answer:
      "La durabilité est une contrainte de conception, pas une option. Nous travaillons avec des matériaux biosourcés, intégrons le réemploi mobilier quand c'est pertinent, et sélectionnons des prestataires engagés dans une démarche RSE.",
  },
  {
    question: "Quels sont vos délais habituels ?",
    answer:
      "Les délais varient selon la complexité du projet. En règle générale, un aménagement de bureaux de 200 à 500 m² est livré en 3 à 5 mois. Nous établissons un planning détaillé dès la phase de conception.",
  },
  {
    question: "Intervenez-vous hors de Paris ?",
    answer:
      "Oui. Nous avons livré des projets à Lyon, Bordeaux, Nantes et dans plusieurs autres grandes métropoles françaises. Nos équipes se déplacent pour l'ensemble des missions.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal pb-20 pt-36 text-cream">
        <div className="container-site">
          <p className="label-eyebrow mb-6 text-terracotta-200">Nos offres</p>
          <h1 className="heading-display max-w-3xl">
            L'écosystème{" "}
            <em className="not-italic text-terracotta">JÖRO</em> — quatre
            offres, une exigence
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/70">
            Chaque dimension de vos espaces mérite une expertise dédiée.
            JÖRO couvre l'intégralité du spectre des nouveaux usages urbains.
          </p>
        </div>
      </section>

      {/* Services detail */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-24 ${index % 2 === 1 ? "bg-cream-200" : "bg-cream"}`}
        >
          <div className="container-site">
            <div
              className={`grid gap-16 lg:grid-cols-2 lg:items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <p className="label-eyebrow mb-4">{service.tagline}</p>
                <h2 className="heading-section mb-6">{service.name}</h2>
                <p className="mb-8 text-lg leading-relaxed text-charcoal-muted">
                  {service.description}
                </p>
                <ul className="mb-10 flex flex-col gap-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-charcoal">
                      <span className="h-1 w-4 shrink-0 bg-terracotta" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-primary">
                  Parler de ce projet
                </Link>
              </div>
              <div
                className={`relative aspect-[4/3] overflow-hidden ${
                  index % 2 === 1 ? "lg:col-start-1" : ""
                }`}
              >
                <Image
                  src={service.image ?? "/images/placeholder.jpg"}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      <FAQ items={faqItems} />

      <CTA />
    </>
  );
}
