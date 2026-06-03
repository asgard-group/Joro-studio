import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import ContactForm from "./ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact — JÖRO Studio",
  description:
    "Contactez JÖRO Studio pour discuter de votre projet d'aménagement ou de rénovation. Notre équipe vous répond sous 48h.",
  alternates: { canonical: "/contact" },
});

const contactInfo = [
  {
    label: "Email",
    value: "contact@jorostudio.fr",
    href: "mailto:contact@jorostudio.fr",
  },
  {
    label: "Localisation",
    value: "Paris, France",
    href: null,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/company/joro-studio",
    href: "https://www.linkedin.com/company/joro-studio",
  },
];

const projectTypes = [
  "Bureaux & Open space",
  "Salle de réunion",
  "Résidence / Appartement",
  "Hôtel & Hospitality",
  "Showroom & Retail",
  "Autre",
];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-charcoal pb-20 pt-36 text-cream">
        <div className="container-site">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="label-eyebrow mb-6 text-taupe-200">Contact</p>
              <h1 className="heading-display mb-6">
                Parlons de votre{" "}
                <em className="not-italic text-taupe">projet</em>
              </h1>
              <p className="text-lg leading-relaxed text-cream/70">
                Que vous ayez un projet précis ou une simple question, notre
                équipe est disponible pour vous répondre sous 48h ouvrées.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-8">
              {contactInfo.map((info) => (
                <div key={info.label} className="border-l-2 border-taupe pl-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cream/40">
                    {info.label}
                  </p>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith("http") ? "_blank" : undefined}
                      rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-1 block text-cream transition-colors hover:text-taupe-200"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-cream">{info.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-24">
        <div className="container-site">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="heading-section mb-4">Nous envoyer un message</h2>
              <p className="mb-8 text-charcoal-muted">
                Décrivez votre projet, vos contraintes et votre calendrier. Plus
                votre message est précis, plus notre réponse sera utile.
              </p>

              {/* Project types */}
              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                  Typologies de projets que nous accompagnons
                </p>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((type) => (
                    <span
                      key={type}
                      className="border border-cream-300 px-3 py-1 text-xs text-charcoal-muted"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
