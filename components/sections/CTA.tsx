"use client";

import Link from "next/link";
import { event } from "@/lib/gtag";

interface CTAProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  dark?: boolean;
}

export default function CTA({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  dark = true,
}: CTAProps) {
  return (
    <section
      className={`py-24 ${
        dark ? "bg-charcoal text-cream" : "bg-cream-200 text-charcoal"
      }`}
    >
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p
              className={`label-eyebrow mb-4 ${
                dark ? "text-terracotta-200" : ""
              }`}
            >
              {eyebrow}
            </p>
          )}
          <h2 className="heading-section mb-6">{title}</h2>
          {description && (
            <p
              className={`mb-10 text-lg leading-relaxed ${
                dark ? "text-cream/70" : "text-charcoal-muted"
              }`}
            >
              {description}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={primaryCta.href}
              className="btn-primary"
              onClick={() => event("cta_click", { label: primaryCta.label })}
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={`btn-outline ${
                  dark
                    ? "border-cream text-cream hover:bg-cream hover:text-charcoal"
                    : ""
                }`}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
