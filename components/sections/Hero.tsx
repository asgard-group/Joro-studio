import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image?: string;
  overlay?: boolean;
  centered?: boolean;
}

export default function Hero({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  cta,
  ctaSecondary,
  image,
  overlay = true,
  centered = false,
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background */}
      {image ? (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {overlay && (
            <div className="absolute inset-0 bg-charcoal/50" />
          )}
        </div>
      ) : (
        <div className="absolute inset-0 bg-cream" />
      )}

      {/* Content */}
      <div
        className={`relative z-10 flex min-h-[90vh] items-end ${
          centered ? "justify-center text-center" : ""
        }`}
      >
        <div className="container-site pb-20 pt-32">
          <div className={`max-w-3xl ${centered ? "mx-auto" : ""}`}>
            {eyebrow && (
              <p
                className={`label-eyebrow mb-6 ${
                  image ? "text-cream/70" : ""
                }`}
              >
                {eyebrow}
              </p>
            )}
            <h1
              className={`heading-display mb-6 ${
                image ? "text-cream" : "text-charcoal"
              }`}
            >
              {title}
              {titleHighlight && (
                <>
                  {" "}
                  <em className="not-italic text-terracotta">
                    {titleHighlight}
                  </em>
                </>
              )}
            </h1>
            {subtitle && (
              <p
                className={`max-w-xl text-lg leading-relaxed ${
                  image ? "text-cream/80" : "text-charcoal-muted"
                } ${centered ? "mx-auto" : ""}`}
              >
                {subtitle}
              </p>
            )}
            {(cta || ctaSecondary) && (
              <div
                className={`mt-10 flex flex-wrap gap-4 ${
                  centered ? "justify-center" : ""
                }`}
              >
                {cta && (
                  <Link href={cta.href} className="btn-primary">
                    {cta.label}
                  </Link>
                )}
                {ctaSecondary && (
                  <Link
                    href={ctaSecondary.href}
                    className={`btn-outline ${
                      image ? "border-cream text-cream hover:bg-cream hover:text-charcoal" : ""
                    }`}
                  >
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
