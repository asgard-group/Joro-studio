import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

// Comme la page de confidentialité : non indexée.
export const metadata: Metadata = buildMetadata({
  title: "Mentions légales",
  description: "Mentions légales de JÖRO Studio : éditeur, directeur de publication, hébergeur.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: false },
});

export default function MentionsLegalesPage() {
  return (
    <article className="py-24 pt-36">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-display mb-4">Mentions légales</h1>
          <p className="mb-16 text-charcoal-muted">
            Informations légales relatives au site <strong>joro-studio.fr</strong>. Pour la gestion des données
            personnelles et des cookies, consultez la{" "}
            <a href="/privacy" className="text-taupe underline">politique de confidentialité</a>.
          </p>

          <section className="prose-content flex flex-col gap-12">
            <div id="editeur">
              <h2 className="font-serif text-2xl text-charcoal mb-4">1. Éditeur du site</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Le site <strong>joro-studio.fr</strong> est édité par la société <strong>JÖRO Studio SAS</strong>,
                immatriculée au Registre du Commerce et des Sociétés de Paris.
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal-muted">
                <li><strong>Dénomination sociale :</strong> JÖRO Studio SAS</li>
                <li><strong>Forme juridique :</strong> société par actions simplifiée (SAS) au capital de 15 000 €</li>
                <li><strong>SIREN :</strong> 910 748 276</li>
                <li><strong>Immatriculation :</strong> RCS Paris 910 748 276</li>
                <li><strong>Siège social :</strong> 15 bis rue Jean-Baptiste Pigalle, 75009 Paris, France</li>
                <li><strong>Directeur de publication :</strong> Romain Ruby, Président</li>
                <li>
                  <strong>Email :</strong>{" "}
                  <a href="mailto:hello@joro-studio.fr" className="text-taupe underline">hello@joro-studio.fr</a>
                </li>
                <li><strong>Téléphone :</strong> +33 (0)1 45 00 00 09</li>
              </ul>
            </div>

            <div id="hebergeur">
              <h2 className="font-serif text-2xl text-charcoal mb-4">2. Hébergeur</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Le site est hébergé par <strong>Netlify, Inc.</strong>, 512 2nd Street, Suite 200,
                San Francisco, CA 94107, États-Unis.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">3. Propriété intellectuelle</h2>
              <p className="leading-relaxed text-charcoal-muted">
                L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) est la propriété
                exclusive de JÖRO Studio ou fait l'objet d'une autorisation d'utilisation. Toute reproduction,
                même partielle, est interdite sans accord préalable écrit.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">4. Limitation de responsabilité</h2>
              <p className="leading-relaxed text-charcoal-muted">
                JÖRO Studio s'efforce de maintenir les informations publiées sur ce site à jour et exactes, mais
                ne peut garantir leur exhaustivité. La société ne saurait être tenue responsable des erreurs,
                omissions ou résultats obtenus par mauvaise utilisation des informations publiées.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">5. Droit applicable</h2>
              <p className="leading-relaxed text-charcoal-muted">
                Les présentes mentions légales sont soumises au droit français. Tout litige relatif à
                l'utilisation du site relève de la compétence exclusive des tribunaux français.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
