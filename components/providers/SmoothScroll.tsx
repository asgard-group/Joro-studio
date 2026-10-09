"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Au rechargement, on repart toujours du haut de la page (hero) et non de la position précédente.
    // Sans ancre dans l'URL uniquement : /#nos-offres garde son comportement.
    history.scrollRestoration = "manual";
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      window.addEventListener("load", () => window.scrollTo(0, 0), { once: true });
    }

    const lenis = new Lenis({
      lerp: 0.1,          // interpolation douce (0.1 = naturel, closer to 1 = instantané)
      smoothWheel: true,  // lissage molette
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
