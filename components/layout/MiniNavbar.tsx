"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { headerStrings } from "@/lib/strings";

// Inverse un SVG foncé (charcoal) en cream — même filtre que Header/FullscreenMenu.
const ICON_FILTER = "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)";

interface Props {
  visible: boolean;
  dark: boolean;
  onOpenMenu: () => void;
}

export default function MiniNavbar({ visible, dark, onOpenMenu }: Props) {
  // Traits du menu : cream sur section sombre, charcoal sur section claire.
  const lineColor = dark ? "#F3F2ED" : "#1C2626";

  // Au chargement/rechargement, Header ne sait pas encore s'il est en mode desktop
  // (useIsDesktop part à false) : le HTML serveur et le 1er rendu affichent donc la
  // mini-navbar, qui se rétracte ensuite en glissant. Pour éviter ce flash :
  //  - tant que la page n'est pas hydratée (`data-ready` absent), le CSS la masque en
  //    desktop (cf. globals.css) ;
  //  - la transition est coupée (durée 0) pendant ce 1er cycle, pour que l'état réel
  //    s'applique sans glissement visible ; elle est activée à la frame suivante.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div
      id="mini-navbar"
      data-ready={ready ? "" : undefined}
      className="fixed inset-x-0 top-0 z-navbar"
      initial={false}
      animate={{ y: visible ? "0%" : "-100%" }}
      transition={{ duration: ready ? 0.5 : 0, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={!visible}
    >
      {/* Marges — 16/32 latérales (paliers 390/834), 16/24 haute (paliers
          390-834/1280) : cette navbar peut réapparaître au scroll même en
          desktop (≥1280px, cf. Header.tsx scrolledPastHeader), elle reprend
          alors les valeurs du palier 1280/1920 sur tous les axes. */}
      <div className="flex items-center justify-between px-[calc(16*var(--u))] min-[834px]:px-[calc(32*var(--u))] min-[1280px]:px-[calc(40*var(--u))] py-[calc(16*var(--u))] min-[1280px]:py-[calc(24*var(--u))]">
        {/* Gauche — monogramme, largeur 44 fixe à tous les paliers (contrairement
            au logo complet de Header.tsx, ne suit pas la largeur 1280/1920). */}
        <Image
          src="/images/logos/monograme.svg"
          alt={headerStrings.logoAlt}
          width={44}
          height={28}
          priority
          style={{ filter: dark ? ICON_FILTER : "none", width: "calc(44 * var(--u))", height: "auto" }}
        />

        {/* Droite — icône menu (3 traits) uniquement, plus de lien Contact ici. */}
        <div className="flex items-center gap-[calc(16*var(--u))]">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={headerStrings.menu}
            className="inline-flex flex-col justify-center gap-[calc(6*var(--u))] cursor-pointer bg-transparent border-0 p-0"
            style={{ width: "calc(24 * var(--u))" }}
          >
            <span className="block h-[calc(2*var(--u))] w-full" style={{ backgroundColor: lineColor }} />
            <span className="block h-[calc(2*var(--u))] w-full" style={{ backgroundColor: lineColor }} />
            <span className="block h-[calc(2*var(--u))] w-full" style={{ backgroundColor: lineColor }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
