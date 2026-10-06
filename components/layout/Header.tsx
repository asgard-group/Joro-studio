"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { headerStrings } from "@/lib/strings";
import FullscreenMenu from "@/components/layout/FullscreenMenu";
import MiniNavbar from "@/components/layout/MiniNavbar";
import ContactPanel from "@/components/layout/ContactPanel";
import { useContactPanel } from "@/components/providers/ContactPanelProvider";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const iconFilter = (dark: boolean) =>
  dark
    ? "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)"
    : "brightness(0) invert(1) sepia(1) hue-rotate(155deg) saturate(400%) brightness(0.14)";

interface NavContentProps {
  dark: boolean;
  onOpenMenu: () => void;
}

function NavContent({ dark, onOpenMenu }: NavContentProps) {
  return (
    <div className="px-[calc(40*var(--u))]">
      {/* 3 colonnes : inscription à gauche, logo centré, menu à droite. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start py-[calc(24*var(--u))]">
        {/* Gauche — inscription (à la place du logo). Les 3 éléments sont alignés sur
            la ligne typographique "JÖRO STUDIO" (mot-logo : lignes 98→227 sur les
            227 de la boîte, centre à 71,6 % de la hauteur = 27,2px pour 38px), pas
            sur le centre de la boîte entière, que la virgule/macron au-dessus du O
            tire vers le haut : marge haute = 27,2 − (hauteur de l'élément / 2). */}
        <span
          className="justify-self-start text-[length:calc(11*var(--u))] font-medium leading-none uppercase tracking-[0.08em]"
          style={{ color: dark ? "#F3F2ED" : "#1C2626", marginTop: "calc(21.7 * var(--u))" }}
        >
          {headerStrings.tagline}
        </span>

        {/* Centre — logo complet (recadré : masque le sous-titre "amo ·
            architecture · travaux" intégré à l'image, en n'affichant que le
            haut du mot-logo). Hauteur 38 — la largeur suit l'aspect-ratio. */}
        <Link href="/" aria-label={headerStrings.logoAriaLabel} className="justify-self-center">
          {/* Recadrage vertical du logo (fichier 1390×330) : la virgule/accent
              au-dessus du O (y=5-70) et le mot-logo "JOROSTUDIO" (y=98-227)
              doivent rester visibles (mesuré sur le fichier source), seul le
              sous-titre "amo · architecture · travaux" en dessous (y=280-325)
              est exclu. Ratio 1390/227 + object-top (crop à partir de y=0,
              donc aucun rognage en haut — la virgule est entièrement dans le
              cadre) : le crop bas à y=227 coupe juste avant le sous-titre. */}
          <div
            className="relative overflow-hidden aspect-[1390/227]"
            style={{ height: "calc(38 * var(--u))" }}
          >
            <Image
              src="/images/logos/joro-studio-amo-architecture-travaux.png"
              alt={headerStrings.logoAlt}
              fill
              priority
              sizes="235px"
              className="object-cover object-top"
              style={{ filter: iconFilter(dark) }}
            />
          </div>
        </Link>

        {/* Droite — menu seul (navbar complète, affichée uniquement à partir de
            1280px, cf. MiniNavbar pour mobile/tablette). */}
        <div className="justify-self-end inline-flex items-center" style={{ marginTop: "calc(18.2 * var(--u))" }}>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={headerStrings.menu}
            className="inline-flex flex-col justify-center gap-[calc(6*var(--u))] cursor-pointer bg-transparent border-0 p-0"
            style={{ width: "calc(24 * var(--u))" }}
          >
            <span className="block h-[calc(2*var(--u))] w-full" style={{ backgroundColor: dark ? "#F3F2ED" : "#1C2626" }} />
            <span className="block h-[calc(2*var(--u))] w-full" style={{ backgroundColor: dark ? "#F3F2ED" : "#1C2626" }} />
            <span className="block h-[calc(2*var(--u))] w-full" style={{ backgroundColor: dark ? "#F3F2ED" : "#1C2626" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen: contactOpen, close: closeContact } = useContactPanel();
  const [onHero, setOnHero] = useState(true);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // En dessous de 1280px (mobile + tablette, spec du 2026-09-29), la navbar
  // principale (logo complet + nav + Contact) est masquée : la MiniNavbar en
  // tient lieu en permanence, plutôt que de n'apparaître qu'au scroll.
  const isDesktopNav = useIsDesktop(1280);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      setOnHero(currentY < 10);
      // Révélée bien après la navbar principale (pas dès qu'elle disparaît) pour éviter un enchaînement trop rapide.
      const revealThreshold = (headerRef.current?.offsetHeight ?? 0) + window.innerHeight * 0.6;
      setScrolledPastHeader(currentY >= revealThreshold);

      const midNavbar = 40;
      const sections = document.querySelectorAll("[data-navbar-theme]");
      let theme = "light";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= midNavbar && rect.bottom >= midNavbar) {
          theme = section.getAttribute("data-navbar-theme") ?? "light";
        }
      });
      setIsDark(theme === "dark");
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || contactOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, contactOpen]);

  return (
    <>
      {/* Navbar principale — ancrée en haut de la section du header, défile normalement avec la page.
          Masquée en dessous de 1280px : la MiniNavbar en tient lieu (voir ci-dessous). */}
      <header ref={headerRef} className="hidden min-[1280px]:block absolute inset-x-0 top-0 z-navbar">
        <NavContent
          dark={isDark}
          onOpenMenu={() => setMenuOpen(true)}
        />
      </header>

      {/* Navbar compacte — prend le relais une fois la navbar principale sortie de l'écran
          (desktop) ; permanente en dessous de 1280px, où elle fait office de navbar principale
          (monogramme + menu seulement, pas de lien Contact ici, cf. MiniNavbar.tsx). */}
      <MiniNavbar
        visible={!isDesktopNav || scrolledPastHeader}
        dark={isDark}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Full-screen split menu */}
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onHero={onHero} />

      {/* Panneau de contact — même mécanique que le menu, toujours ouvert depuis la
          droite (bouton Contact désormais ancré à droite partout : navbar principale,
          MiniNavbar, Footer, CTA). */}
      <ContactPanel isOpen={contactOpen} onClose={closeContact} />
    </>
  );
}
