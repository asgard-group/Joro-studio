import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales & Politique de confidentialité — JÖRO Studio",
  description: "Mentions légales, politique de confidentialité et informations RGPD de JÖRO Studio.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
});

export default function PrivacyPage() {
  return (
    <article className="py-24 pt-36">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-display mb-4">Mentions légales</h1>
          <p className="mb-16 text-charcoal-muted">Dernière mise à jour : janvier 2025</p>

          <section className="prose-content flex flex-col gap-12">
            <div id="mentions-legales">
              <h2 className="font-serif text-2xl text-charcoal mb-4">1. Éditeur du site</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Le site <strong>jorostudio.fr</strong> est édité par la société{" "}
                <strong>JÖRO Studio SAS</strong>, immatriculée au Registre du Commerce
                et des Sociétés de Paris.
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal-muted">
                <li><strong>Siège social :</strong> Paris, France</li>
                <li><strong>Directeur de publication :</strong> Romain Ruby</li>
                <li><strong>Email :</strong> contact@jorostudio.fr</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">2. Hébergement</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Le site est hébergé par <strong>Netlify, Inc.</strong>, 512 2nd Street, Suite 200,
                San Francisco, CA 94107, États-Unis.
              </p>
            </div>

            <div id="rgpd">
              <h2 className="font-serif text-2xl text-charcoal mb-4">3. Protection des données personnelles (RGPD)</h2>
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
                  <a href="mailto:contact@jorostudio.fr" className="text-terracotta underline">
                    contact@jorostudio.fr
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">4. Cookies</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Ce site utilise uniquement des cookies techniques nécessaires à son bon
                fonctionnement. Aucun cookie publicitaire ou de tracking tiers n'est déposé sans
                votre consentement explicite. Vous pouvez configurer votre navigateur pour refuser
                les cookies, sans que cela n'affecte la navigation principale.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">5. Propriété intellectuelle</h2>
              <p className="leading-relaxed text-charcoal-muted">
                L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) est
                la propriété exclusive de JÖRO Studio ou fait l'objet d'une autorisation
                d'utilisation. Toute reproduction, même partielle, est interdite sans accord
                préalable écrit.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">6. Limitation de responsabilité</h2>
              <p className="leading-relaxed text-charcoal-muted">
                JÖRO Studio s'efforce de maintenir les informations publiées sur ce site à jour et
                exactes, mais ne peut garantir leur exhaustivité. La société ne saurait être tenue
                responsable des erreurs, omissions ou résultats obtenus par mauvaise utilisation des
                informations publiées.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">7. Droit applicable</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Les présentes mentions légales sont soumises au droit français. Tout litige relatif
                à l'utilisation du site relève de la compétence exclusive des tribunaux français.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
