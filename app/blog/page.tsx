import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = buildMetadata({
  title: "Blog & Insights — JÖRO Studio",
  description:
    "Tendances, analyses et retours d'expérience sur l'architecture intérieure tertiaire, les matériaux durables et les nouveaux usages des espaces.",
  alternates: { canonical: "/blog" },
});

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      {/* Header */}
      <section className="bg-cream pb-16 pt-36">
        <div className="container-site">
          <p className="label-eyebrow mb-6">Insights & Tendances</p>
          <h1 className="heading-display max-w-2xl">
            Le <em className="not-italic text-terracotta">Studio Dispatch</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-muted">
            Nos analyses sur les espaces de travail, la durabilité en architecture
            et les nouveaux usages urbains. Un regard professionnel, sans jargon.
          </p>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="pb-16">
          <div className="container-site">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid gap-8 overflow-hidden lg:grid-cols-2">
                <div className="relative aspect-[16/9] overflow-hidden bg-cream-300 lg:aspect-auto lg:min-h-[400px]">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center py-8 lg:pl-8">
                  <div className="flex items-center gap-4 text-xs text-charcoal-muted">
                    <span className="label-eyebrow">{featured.category}</span>
                    <span>{formatDate(featured.date)}</span>
                    <span>{featured.readingTime} de lecture</span>
                  </div>
                  <h2 className="heading-section mt-4 group-hover:text-terracotta transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-charcoal-muted">
                    {featured.excerpt}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-terracotta">
                    Lire l'article
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Post grid */}
      <section className="bg-cream-200 py-16">
        <div className="container-site">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-cream"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-cream-300">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-3 text-xs text-charcoal-muted">
                    <span className="label-eyebrow">{post.category}</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="font-serif text-lg leading-snug text-charcoal group-hover:text-terracotta transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-auto text-sm leading-relaxed text-charcoal-muted line-clamp-2">
                    {post.excerpt}
                  </p>
                  <time
                    dateTime={post.date}
                    className="mt-2 text-xs text-charcoal-muted"
                  >
                    {formatDate(post.date)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24">
        <div className="container-site">
          <div className="mx-auto max-w-xl text-center">
            <p className="label-eyebrow mb-4">Newsletter</p>
            <h2 className="heading-section mb-4">Studio Dispatch</h2>
            <p className="mb-8 text-charcoal-muted">
              Un email mensuel : une tendance, un projet, un regard. Sans
              surcharge. Rejoignez les professionnels de l'immobilier qui lisent
              JÖRO.
            </p>
            <form className="flex gap-3" noValidate>
              <input
                type="email"
                placeholder="Votre adresse email"
                required
                aria-label="Adresse email pour la newsletter"
                className="flex-1 border border-cream-300 bg-cream px-4 py-3 text-sm text-charcoal placeholder-charcoal-muted/50 focus:border-terracotta focus:outline-none"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                S'inscrire
              </button>
            </form>
            <p className="mt-3 text-xs text-charcoal-muted">
              Désinscription possible à tout moment. Pas de spam.
            </p>
          </div>
        </div>
      </section>

      <CTA
        eyebrow="Un projet en tête ?"
        title="Transformons vos espaces ensemble"
        primaryCta={{ label: "Prendre contact", href: "/contact" }}
        secondaryCta={{ label: "Nos réalisations", href: "/work" }}
      />
    </>
  );
}
