"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { type CSSProperties } from "react";
import { headerStrings } from "@/lib/strings";

const LABEL_STYLE: CSSProperties = {
  lineHeight: "100%",
  letterSpacing: "0.02em",
};

// Inverse un SVG foncé (charcoal) en cream — même filtre que Header/FullscreenMenu.
const ICON_FILTER = "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)";

// Bouton Contact — même style que l'ancienne pilule mais sans radius (angles droits).
// Survol volontairement en valeur littérale et non en `taupe-600` : cette nuance est
// pensée pour du texte cream (cf. Button.tsx), et donnerait ici un noir sur fond
// sombre illisible. Ce ton reste une nuance du taupe, lisible avec `text-charcoal`.
const contactClasses =
  "inline-flex items-center gap-0 bg-taupe px-[16px] py-[10px] text-[13px] font-medium uppercase text-charcoal transition-colors duration-200 hover:bg-[#A7A296]";

interface Props {
  visible: boolean;
  dark: boolean;
  onOpenMenu: () => void;
  onOpenContact: () => void;
}

export default function MiniNavbar({ visible, dark, onOpenMenu, onOpenContact }: Props) {
  // Traits du menu : cream sur section sombre, charcoal sur section claire.
  const lineColor = dark ? "#F3F2ED" : "#1C2626";

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-navbar"
      initial={false}
      animate={{ y: visible ? "0%" : "-100%" }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between px-[20px] min-[840px]:px-[32px] py-[16px]">
        {/* Gauche — monogramme */}
        <Image
          src="/images/logos/monograme.svg"
          alt={headerStrings.logoAlt}
          width={44}
          height={28}
          priority
          style={{ filter: dark ? ICON_FILTER : "none" }}
        />

        {/* Droite — Contact (à la place de l'ancien Menu) + icône menu (2 traits) */}
        <div className="flex items-center gap-[16px]">
          <button type="button" onClick={onOpenContact} className={contactClasses} style={LABEL_STYLE}>
            {headerStrings.contact}
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={headerStrings.menu}
            className="inline-flex flex-col justify-center gap-[7px] cursor-pointer bg-transparent border-0 p-0"
          >
            <span className="block h-[1.5px] w-[28px]" style={{ backgroundColor: lineColor }} />
            <span className="block h-[1.5px] w-[28px]" style={{ backgroundColor: lineColor }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
