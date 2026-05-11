import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { workItems } from "@/data/work";
import CTA from "@/components/sections/CTA";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return workItems.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const item = workItems.find((w) => w.id === params.id);
  if (!item) return {};
  return buildMetadata({
    title: `${item.title} — JÖRO Studio`,
    description: item.description,
    alternates: { canonical: `/work/${item.id}` },
  });
}

export default function WorkDetailPage({ params }: Props) {
  const item = workItems.find((w) => w.id === params.id);
  if (!item) notFound();

  const related = workItems
    .filter((w) => w.id !== item.id && w.category === item.category)
    .slice(0, 3);

  return (
    <>
      {/* Hero image */}
      <section className="relative min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 flex min-h-[60vh] items-end">
          <div className="container-site pb-16 pt-32">
            <Link
              href="/work"
              className="mb-8 inline-flex items-center gap-2 text-sm text-cream/60 hover:text-cream"
            >
              ← Toutes les réalisations
            </Link>
            <p className="label-eyebrow mb-4 text-terracotta-200">{item.category}</p>
            <h1 className="heading-display max-w-2xl text-cream">{item.title}</h1>
          </div>
        </div>
      </section>

      {/* Project info */}
      <section className="py-16">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Sidebar meta */}
            <aside className="flex flex-col gap-6 border-t border-cream-300 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {[
                { label: "Localisation", value: item.location },
                { label: "Année", value: item.year },
                { label: "Catégorie", value: item.category },
                ...(item.client ? [{ label: "Client", value: item.client }] : []),
              ].map((meta) => (
                <div key={meta.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                    {meta.label}
                  </p>
                  <p className="mt-1 text-charcoal">{meta.value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                  Tags
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-cream-300 px-2 py-0.5 text-xs text-charcoal-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            {/* Description */}
            <div className="lg:col-span-2">
              <p className="label-eyebrow mb-4">Le projet</p>
              <h2 className="heading-section mb-6">{item.title}</h2>
              <p className="text-lg leading-relaxed text-charcoal-muted">
                {item.description}
              </p>
              {item.caseStudy && (
                <div className="mt-10 border-t border-cream-300 pt-10">
                  <p className="text-sm font-semibold uppercase tracking-wider text-charcoal-muted">
                    Étude de cas complète disponible sur demande
                  </p>
                  <Link href="/contact" className="btn-primary mt-4">
                    Demander le case study
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related work */}
      {related.length > 0 && (
        <section className="bg-cream-200 py-24">
          <div className="container-site">
            <h2 className="heading-section mb-12">Projets similaires</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((w) => (
                <Link key={w.id} href={`/work/${w.id}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream-300">
                    <Image
                      src={w.coverImage}
                      alt={w.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="pt-4">
                    <p className="label-eyebrow mb-1">{w.category}</p>
                    <h3 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors">
                      {w.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA
        eyebrow="Votre tour"
        title="Créons votre prochain espace"
        primaryCta={{ label: "Nous contacter", href: "/contact" }}
        secondaryCta={{ label: "Toutes les réalisations", href: "/work" }}
      />
    </>
  );
}
