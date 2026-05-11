import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — JÖRO Studio",
};

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-cream text-center">
      <p className="label-eyebrow mb-4">Erreur 404</p>
      <h1 className="heading-display mb-6">Page introuvable</h1>
      <p className="mb-10 max-w-md text-charcoal-muted">
        La page que vous cherchez n'existe pas ou a été déplacée. Revenez à
        l'accueil ou explorez nos réalisations.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link href="/" className="btn-primary">
          Retour à l'accueil
        </Link>
        <Link href="/work" className="btn-outline">
          Nos réalisations
        </Link>
      </div>
    </section>
  );
}
