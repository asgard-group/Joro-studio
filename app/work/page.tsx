import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { workItems } from "@/data/work";
import Card from "@/components/ui/Card";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = buildMetadata({
  title: "Réalisations — JÖRO Studio",
  description:
    "Découvrez les projets d'architecture intérieure et d'aménagement réalisés par JÖRO Studio : bureaux, hôtellerie, résidentiel et espaces événementiels.",
  alternates: { canonical: "/work" },
});

const categories = ["Tous", "JÖRO Office", "JÖRO Meeting", "JÖRO Living", "JÖRO Studio"];

export default function WorkPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-cream pb-16 pt-36">
        <div className="container-site">
          <div className="max-w-2xl">
            <p className="label-eyebrow mb-6">Portfolio</p>
            <h1 className="heading-display mb-6">
              Nos{" "}
              <em className="not-italic text-terracotta">réalisations</em>
            </h1>
            <p className="text-lg leading-relaxed text-charcoal-muted">
              Chaque projet est une conversation entre nos convictions et les
              ambitions de nos clients. Voici ce que nous avons créé ensemble.
            </p>
          </div>

          {/* Category filters — static labels, filtering requires client component */}
          <div className="mt-10 flex flex-wrap gap-3" aria-label="Filtres par catégorie">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`cursor-pointer border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  cat === "Tous"
                    ? "border-terracotta bg-terracotta text-cream"
                    : "border-cream-300 text-charcoal-muted hover:border-terracotta hover:text-terracotta"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="container-site">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {workItems.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.category}
                description={item.description}
                image={item.coverImage}
                href={`/work/${item.id}`}
                tags={[item.location, item.year, ...item.tags.slice(0, 1)]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Case studies highlight */}
      <section className="bg-cream-200 py-24">
        <div className="container-site">
          <div className="mb-12 max-w-xl">
            <p className="label-eyebrow mb-4">Études de cas</p>
            <h2 className="heading-section">
              Projets documentés en détail
            </h2>
            <p className="mt-4 text-charcoal-muted">
              Pour certains projets emblématiques, nous partageons la démarche
              complète : enjeux, parti pris, réponse technique et résultat.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {workItems
              .filter((w) => w.caseStudy)
              .slice(0, 2)
              .map((item) => (
                <Card
                  key={item.id}
                  variant="horizontal"
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

      <CTA />
    </>
  );
}
