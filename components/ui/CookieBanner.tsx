"use client";

import { useConsent } from "@/components/providers/ConsentProvider";

export default function CookieBanner() {
  const { consent, hydrated, grant, deny } = useConsent();

  if (!hydrated || consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-charcoal/10 bg-cream shadow-lg">
      <div className="container-site flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-charcoal-muted">
          Nous utilisons des cookies d&apos;analyse pour comprendre comment vous
          naviguez sur le site.{" "}
          <a href="/privacy" className="underline hover:text-taupe">
            En savoir plus
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={deny}
            className="btn-outline border-charcoal/30 text-sm text-charcoal hover:bg-charcoal hover:text-cream"
          >
            Refuser
          </button>
          <button onClick={grant} className="btn-primary text-sm">
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
