import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Conditions Générales d'Utilisation — JÖRO Studio",
  description: "Conditions générales d'utilisation du site joro-studio.fr.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: false },
});

export default function TermsPage() {
  return (
    <article className="py-24 pt-36">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-display mb-4">
            Conditions Générales d'Utilisation
          </h1>
          <p className="mb-16 text-charcoal-muted">Dernière mise à jour : janvier 2025</p>

          <section className="flex flex-col gap-12">
            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">1. Objet</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités
                d'accès et d'utilisation du site <strong>joro-studio.fr</strong> édité par JÖRO
                Studio SAS. L'utilisation du site vaut acceptation pleine et entière des présentes CGU.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">2. Accès au site</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Le site est accessible gratuitement à tout utilisateur disposant d'un accès à
                internet. JÖRO Studio se réserve le droit de suspendre ou d'interrompre l'accès
                au site pour des raisons de maintenance ou d'amélioration, sans préavis ni
                responsabilité.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">3. Contenu et utilisation</h2>
              <div className="flex flex-col gap-4 text-charcoal-muted leading-relaxed">
                <p>
                  L'utilisateur s'engage à utiliser le site conformément aux lois et règlements
                  en vigueur et aux présentes CGU. Il est notamment interdit de :
                </p>
                <ul className="ml-4 flex flex-col gap-2 list-disc text-sm">
                  <li>reproduire, copier ou exploiter le contenu du site sans autorisation ;</li>
                  <li>porter atteinte aux droits de propriété intellectuelle de JÖRO Studio ;</li>
                  <li>tenter d'accéder de manière non autorisée aux systèmes informatiques ;</li>
                  <li>diffuser des contenus illicites ou préjudiciables via les formulaires.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">4. Formulaire de contact</h2>
              <p className="leading-relaxed text-charcoal-muted">
                L'utilisation du formulaire de contact implique que l'utilisateur fournisse des
                informations exactes et à jour. JÖRO Studio traitera ces données conformément à
                sa politique de confidentialité. La soumission du formulaire ne constitue pas
                un engagement contractuel de la part de JÖRO Studio.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">5. Liens hypertextes</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Le site peut contenir des liens vers des sites tiers. JÖRO Studio n'exerce aucun
                contrôle sur ces sites et décline toute responsabilité quant à leur contenu. Ces
                liens sont fournis à titre informatif uniquement.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">6. Modification des CGU</h2>
              <p className="leading-relaxed text-charcoal-muted">
                JÖRO Studio se réserve le droit de modifier les présentes CGU à tout moment. Les
                utilisateurs sont invités à les consulter régulièrement. La date de dernière mise à
                jour est indiquée en haut de cette page.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">7. Droit applicable et juridiction compétente</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Les présentes CGU sont régies par le droit français. En cas de litige, les parties
                s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut,
                les tribunaux de Paris seront seuls compétents.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
