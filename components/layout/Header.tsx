"use client";

import Link from "next/link";
import Image from "next/image";
import React, { type CSSProperties, useState, useEffect, useRef, useId } from "react";
import { navItems } from "@/data/navigation";
import ComingSoonLink from "@/components/ui/ComingSoonLink";
import { headerStrings } from "@/lib/strings";

// — Styles & couleurs partagés du header —
// fontSize n'est PAS inclus pour permettre l'override responsive via Tailwind
// (les inline styles ont une spécificité supérieure aux classes utilitaires).
const LABEL_STYLE: CSSProperties = {
  lineHeight: "100%",
  letterSpacing: "0.02em",
};

const labelClasses = (dark: boolean) =>
  `font-medium ${dark ? "text-cream" : "text-charcoal"}`;

const iconFilter = (dark: boolean) =>
  dark
    ? "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)"
    : "brightness(0) invert(1) sepia(1) hue-rotate(155deg) saturate(400%) brightness(0.14)";

interface NavContentProps {
  dark: boolean;
  // State du dropdown remonté au parent — partagé entre les 2 instances de NavContent
  langOpen: boolean;
  setLangOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  langTriggerId: string;
}

function NavContent({ dark, langOpen, setLangOpen, langTriggerId }: NavContentProps) {
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLangOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [langOpen, setLangOpen]);

  return (
    <div className="px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px]">
      <div className="grid grid-cols-3 items-center py-[20px]">
        {/* Left — hamburger + label */}
        <ComingSoonLink className="justify-self-start inline-flex items-center gap-[8px] min-[700px]:gap-[10px]">
          <Image
            src="/images/icon/menu.svg"
            alt=""
            width={24}
            height={9}
            className="w-5 min-[700px]:w-6 h-auto"
            style={{ filter: iconFilter(dark) }}
          />
          <span
            className={`text-[12px] min-[700px]:text-[16px] ${labelClasses(dark)}`}
            style={LABEL_STYLE}
          >
            {headerStrings.menu}
          </span>
        </ComingSoonLink>

        {/* Center — logo */}
        <Link
          href="/"
          className="justify-self-center"
          aria-label={headerStrings.logoAriaLabel}
        >
          <Image
            src="/images/logos/joro-studio-ẢCHITECTURE-TRAVAUX@300x 2.png"
            alt={headerStrings.logoAlt}
            width={320}
            height={97}
            priority
            className="object-contain w-auto h-[34px] min-[700px]:h-[53px]"
            style={{ maxWidth: "none", filter: dark ? "none" : iconFilter(false) }}
          />
        </Link>

        {/* Right — contact + language switcher */}
        <div className="justify-self-end inline-flex items-center" style={{ gap: '20px' }}>
          <ComingSoonLink>
            <span
              className={`text-[12px] min-[700px]:text-[16px] ${labelClasses(dark)}`}
              style={LABEL_STYLE}
            >
              {headerStrings.contact}
            </span>
          </ComingSoonLink>
          <div
            ref={langRef}
            className="hidden min-[700px]:inline-flex relative items-center"
          >
            <button
              type="button"
              id={langTriggerId}
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={headerStrings.languageSwitcherAriaLabel}
              className="inline-flex items-center cursor-pointer"
              style={{ gap: '0px' }}
            >
              <span className={`text-[16px] ${labelClasses(dark)}`} style={LABEL_STYLE}>
                {headerStrings.currentLanguage}
              </span>
              <span className="inline-flex items-center justify-center" style={{ width: '16px', height: '24px' }}>
                <Image
                  src="/images/icon/arrow-drop-down-line.svg"
                  alt=""
                  width={16}
                  height={24}
                  style={{
                    width: '16px',
                    height: '24px',
                    transform: langOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 150ms ease',
                    filter: iconFilter(dark),
                  }}
                />
              </span>
            </button>

            {langOpen && (
              <ul
                role="listbox"
                aria-labelledby={langTriggerId}
                className="absolute left-0 top-full flex flex-col items-start"
                style={{ gap: '12px' }}
              >
                <li role="option" aria-selected="false">
                  <button
                    type="button"
                    onClick={() => { setLangOpen(false); /* TODO: switch to English */ }}
                    className={`text-[16px] cursor-pointer ${labelClasses(dark)}`}
                    style={LABEL_STYLE}
                  >
                    {headerStrings.alternateLanguage}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  // fixedHidden=true → la navbar fixe (post-hero) est slidée hors viewport.
  // onHero=true → on est sur le hero ; la navbar fixe est masquée, la navbar absolue est visible.
  const [fixedHidden, setFixedHidden] = useState(true);
  const [onHero, setOnHero] = useState(true);
  // State du dropdown langue partagé entre les 2 instances de NavContent
  const [langOpen, setLangOpen] = useState(false);
  const langTriggerId = useId();
  const lastYRef = React.useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const heroHeight = window.innerHeight;
      const overHero = currentY <= heroHeight;

      setOnHero(overHero);

      // Sur le hero : navbar fixe masquée (la navbar absolue prend le relais et scrolle avec la page).
      // Après le hero : la navbar fixe se révèle quand on scrolle vers le haut, se cache quand on descend.
      if (overHero) {
        setFixedHidden(true);
      } else if (currentY > lastYRef.current + 5) {
        setFixedHidden(true);
      } else if (currentY < lastYRef.current - 5) {
        setFixedHidden(false);
      }
      lastYRef.current = currentY;

      // Détection du thème de la section sous la navbar
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

    // rAF throttle : un seul update par frame, jamais plus
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
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/*
        Architecture à 2 navbars (préservée volontairement pour l'effet "navbar scrolle avec le hero") :
        - Navbar #1 absolue : sur le hero, scrolle naturellement avec la page
        - Navbar #2 fixe : apparaît au scroll-up après le hero, avec backdrop-blur
        Le state du dropdown langue (langOpen, langTriggerId) est partagé via props pour éviter la désync.
        aria-hidden cache la navbar inactive aux lecteurs d'écran pour éviter les doublons d'annonces.
      */}

      {/* Navbar #1 — absolue, sur le hero, scrolle avec la page */}
      <header
        className="absolute inset-x-0 top-0 z-navbar"
        aria-hidden={!onHero}
      >
        <NavContent
          dark={true}
          langOpen={onHero ? langOpen : false}
          setLangOpen={setLangOpen}
          langTriggerId={`${langTriggerId}-hero`}
        />
      </header>

      {/* Navbar #2 — fixe, glisse depuis le haut après le hero */}
      <div
        className={`fixed inset-x-0 top-0 z-navbar backdrop-blur-md transition-transform duration-300 ${
          fixedHidden ? "-translate-y-full" : "translate-y-0"
        }`}
        aria-hidden={onHero}
      >
        <NavContent
          dark={isDark}
          langOpen={onHero ? false : langOpen}
          setLangOpen={setLangOpen}
          langTriggerId={`${langTriggerId}-sticky`}
        />
      </div>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-modal bg-charcoal transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          aria-label={headerStrings.menuOverlay.closeAriaLabel}
          className="absolute right-5 top-5 p-2 text-cream sm:right-6 sm:top-6 lg:right-10 lg:top-8"
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-8 sm:h-8">
            <line x1="6" y1="6" x2="26" y2="26" />
            <line x1="26" y1="6" x2="6" y2="26" />
          </svg>
        </button>

        <div className="container-site flex h-full flex-col justify-center">
          <nav aria-label={headerStrings.menuOverlay.navAriaLabel}>
            <ul className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href === "/" ? (
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-serif text-3xl text-cream transition-colors hover:text-taupe sm:text-4xl lg:text-5xl"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <ComingSoonLink className="font-serif text-3xl text-cream/40 sm:text-4xl lg:text-5xl">
                      {item.label}
                    </ComingSoonLink>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-10 lg:mt-12">
              <ComingSoonLink className="btn-primary inline-block">
                {headerStrings.menuOverlay.contactCta}
              </ComingSoonLink>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
