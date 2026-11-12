import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Politique de confidentialité & cookies",
  description: "Politique de confidentialité, informations RGPD et cookies de JÖRO Studio.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
});

export default function PrivacyPage() {
  return (
    <article className="py-24 pt-36">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-display mb-4">Politique de confidentialité</h1>
          <p className="mb-16 text-charcoal-muted">
            Les informations légales de l'éditeur et de l'hébergeur figurent dans les{" "}
            <a href="/mentions-legales" className="text-taupe underline">mentions légales</a>.
          </p>

          <section className="prose-content flex flex-col gap-12">
            <div id="rgpd">
              <h2 className="font-serif text-2xl text-charcoal mb-4">1. Protection des données personnelles (RGPD)</h2>
              <div className="flex flex-col gap-4 text-charcoal-muted leading-relaxed">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la
                  loi Informatique et Libertés, vous disposez des droits suivants concernant vos
                  données personnelles : droit d'accès, de rectification, de suppression,
                  d'opposition et de portabilité.
                </p>
                <p>
                  Les données collectées via le formulaire de contact sont utilisées exclusivement
                  pour traiter votre demande et ne sont pas transmises à des tiers sans votre
                  consentement explicite.
                </p>
                <p>
                  Pour exercer vos droits ou pour toute question relative à vos données
                  personnelles, contactez-nous à :{" "}
                  <a href="mailto:hello@joro-studio.fr" className="text-taupe underline">
                    hello@joro-studio.fr
                  </a>
                </p>
              </div>
            </div>

            <div id="cookies">
              <h2 className="font-serif text-2xl text-charcoal mb-4">2. Cookies</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Ce site utilise uniquement des cookies techniques nécessaires à son bon
                fonctionnement. Aucun cookie publicitaire ou de tracking tiers n'est déposé sans
                votre consentement explicite. Vous pouvez configurer votre navigateur pour refuser
                les cookies, sans que cela n'affecte la navigation principale.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
