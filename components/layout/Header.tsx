"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { type CSSProperties, type MouseEvent as ReactMouseEvent, useState, useEffect, useRef } from "react";
import { headerStrings } from "@/lib/strings";
import FullscreenMenu from "@/components/layout/FullscreenMenu";
import MiniNavbar from "@/components/layout/MiniNavbar";
import ContactPanel from "@/components/layout/ContactPanel";
import { useContactPanel } from "@/components/providers/ContactPanelProvider";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const LABEL_STYLE: CSSProperties = {
  lineHeight: "100%",
  letterSpacing: "0.02em",
};

const labelClasses = (dark: boolean) =>
  `font-medium uppercase ${dark ? "text-cream" : "text-charcoal"}`;

const iconFilter = (dark: boolean) =>
  dark
    ? "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)"
    : "brightness(0) invert(1) sepia(1) hue-rotate(155deg) saturate(400%) brightness(0.14)";

// Sections pinnées affichées directement dans la navbar (à droite), à la
// place de l'ancien sélecteur de langue.
const pinnedSections = [
  { key: "studio", label: headerStrings.pinnedNav.studio, href: "/#notre-studio" },
  { key: "services", label: headerStrings.pinnedNav.services, href: "/#nos-offres" },
  { key: "projets", label: headerStrings.pinnedNav.projets, href: "/#nos-realisations" },
] as const;

interface NavContentProps {
  dark: boolean;
  onOpenMenu: () => void;
  onOpenContact: () => void;
}

function NavContent({ dark, onOpenMenu, onOpenContact }: NavContentProps) {
  const pathname = usePathname();

  // Même compensation que FullscreenMenu/Footer : l'ancre #nos-realisations
  // est décalée par le -mt-[250vh] appliqué à FeaturedWork.
  function handleProjetsClick(e: ReactMouseEvent) {
    if (pathname !== "/") return;
    e.preventDefault();

    const target = document.getElementById("nos-realisations");
    if (!target) return;

    const targetY = target.getBoundingClientRect().top + window.scrollY + window.innerHeight;
    window.history.pushState(null, "", "/#nos-realisations");
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  return (
    <div className="px-[20px] min-[840px]:px-[32px]">
      <div className="grid grid-cols-3 items-center py-[20px]">
        {/* Left — contact */}
        <button
          type="button"
          onClick={onOpenContact}
          aria-label={headerStrings.contact}
          className="justify-self-start w-full inline-flex items-center bg-transparent border-0 p-0 cursor-pointer transition-opacity duration-200 hover:opacity-60"
        >
          <span
            className={`nav-label text-[13px] ${labelClasses(dark)}`}
            style={LABEL_STYLE}
          >
            {headerStrings.contact}
          </span>
        </button>

        {/* Center — logo (recadré : masque le sous-titre "amo · architecture ·
            travaux" intégré à l'image, en n'affichant que le haut du mot-logo) */}
        <Link
          href="/"
          className="justify-self-center"
          aria-label={headerStrings.logoAriaLabel}
        >
          <style>{`
            @media (max-width: 539px) {
              .logo-mobile-img { width: 125px !important; height: auto !important; }
              .nav-label { font-size: 12px !important; }
            }
          `}</style>
          {/* Recadrage vertical du logo (fichier 1390×330) : le mot-logo s'arrête
              vers y=227, la baseline (sous-titre) commence à y=280 — on coupe à
              y=250, au milieu du blanc, via un ratio 1390/250 + object-position
              top, plutôt que d'afficher l'image entière (1390/330). */}
          <div
            className="logo-mobile-img relative overflow-hidden aspect-[1390/250]"
            style={{ height: "40.15px" }}
          >
            <Image
              src="/images/logos/joro-studio-amo-architecture-travaux.png"
              alt={headerStrings.logoAlt}
              fill
              priority
              sizes="224px"
              className="object-cover object-top"
              style={{ filter: iconFilter(dark) }}
            />
          </div>
        </Link>

        {/* Right — sections pinnées (liens directs, à la place de l'ancien sélecteur de langue) ;
            en dessous de 840px, plus assez de place pour les 3 libellés : on retombe sur une icône
            burger (même dessin que MiniNavbar) qui ouvre le même menu plein écran. */}
        <div className="justify-self-end w-full flex items-center justify-end">
          <div className="hidden min-[840px]:inline-flex items-center gap-3">
            {pinnedSections.map((section, index) => (
              <div key={section.key} className="inline-flex items-center gap-3">
                {index > 0 && (
                  <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: "#BAB6AA" }} aria-hidden="true" />
                )}
                <Link
                  href={section.href}
                  onClick={section.key === "projets" ? handleProjetsClick : undefined}
                  className={`nav-label text-[13px] transition-opacity duration-200 hover:opacity-60 ${labelClasses(dark)}`}
                  style={LABEL_STYLE}
                >
                  {section.label}
                </Link>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={headerStrings.menu}
            className="inline-flex min-[840px]:hidden flex-col justify-center gap-[7px] cursor-pointer bg-transparent border-0 p-0"
          >
            <span className="block h-[1.5px] w-[28px]" style={{ backgroundColor: dark ? "#F3F2ED" : "#1C2626" }} />
            <span className="block h-[1.5px] w-[28px]" style={{ backgroundColor: dark ? "#F3F2ED" : "#1C2626" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen: contactOpen, open: openContact, close: closeContact } = useContactPanel();
  const [onHero, setOnHero] = useState(true);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // En dessous de 840px, la navbar principale (3 colonnes) est masquée : la
  // MiniNavbar en tient lieu en permanence, plutôt que de n'apparaître qu'au scroll.
  const isDesktopNav = useIsDesktop(840);

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
          Masquée en dessous de 840px : la MiniNavbar en tient lieu (voir ci-dessous). */}
      <header ref={headerRef} className="hidden min-[840px]:block absolute inset-x-0 top-0 z-navbar">
        <NavContent
          dark={isDark}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenContact={openContact}
        />
      </header>

      {/* Navbar compacte — prend le relais une fois la navbar principale sortie de l'écran
          (desktop) ; permanente en dessous de 840px, où elle fait office de navbar principale. */}
      <MiniNavbar
        visible={!isDesktopNav || scrolledPastHeader}
        dark={isDark}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenContact={openContact}
      />

      {/* Full-screen split menu */}
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onHero={onHero} />

      {/* Panneau de contact — même mécanique que le menu, ouverture en miroir (depuis la droite).
          État partagé via ContactPanelProvider : le lien "Contact" du Footer l'ouvre aussi. */}
      <ContactPanel isOpen={contactOpen} onClose={closeContact} />
    </>
  );
}
