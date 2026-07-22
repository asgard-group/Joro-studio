"use client";

import Link from "next/link";
import Image from "next/image";
import { type CSSProperties, useState, useEffect, useRef, useId } from "react";
import { headerStrings } from "@/lib/strings";
import FullscreenMenu from "@/components/layout/FullscreenMenu";
import MiniNavbar from "@/components/layout/MiniNavbar";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

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

interface NavContentProps {
  dark: boolean;
  langOpen: boolean;
  setLangOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  langTriggerId: string;
  onOpenMenu: () => void;
}

function NavContent({ dark, langOpen, setLangOpen, langTriggerId, onOpenMenu }: NavContentProps) {
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
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={headerStrings.menu}
          className="justify-self-start w-full inline-flex items-center bg-transparent border-0 p-0 cursor-pointer transition-opacity duration-200 hover:opacity-60"
        >
          <span
            className={`nav-label text-[13px] ${labelClasses(dark)}`}
            style={LABEL_STYLE}
          >
            {headerStrings.menu}
          </span>
        </button>

        {/* Center — logo */}
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
          <Image
            src="/images/logos/joro-studio-amo-architecture-travaux.png"
            alt={headerStrings.logoAlt}
            width={1390}
            height={330}
            priority
            className="logo-mobile-img"
            style={{
              width: "auto",
              height: "53px",
              maxWidth: "none",
              filter: iconFilter(dark),
            }}
          />
        </Link>

        {/* Right — contact + language switcher */}
        <div className="justify-self-end w-full inline-flex items-center justify-end" style={{ gap: '20px' }}>
          <ComingSoonLink
            className={`nav-label text-[13px] transition-opacity duration-200 hover:opacity-60 ${labelClasses(dark)}`}
            style={LABEL_STYLE}
          >
            {headerStrings.contact}
          </ComingSoonLink>
          <div
            ref={langRef}
            className="hidden min-[540px]:inline-flex relative items-center"
          >
            <button
              type="button"
              id={langTriggerId}
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={headerStrings.languageSwitcherAriaLabel}
              className="inline-flex items-center cursor-pointer transition-opacity duration-200 hover:opacity-60"
              style={{ gap: '0px' }}
            >
              <span className={`text-[13px] ${labelClasses(dark)}`} style={LABEL_STYLE}>
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
                    onClick={() => { setLangOpen(false); }}
                    className={`text-[13px] cursor-pointer ${labelClasses(dark)}`}
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
  const [onHero, setOnHero] = useState(true);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langTriggerId = useId();
  const headerRef = useRef<HTMLElement>(null);

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
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Navbar principale — ancrée en haut de la section du header, défile normalement avec la page */}
      <header ref={headerRef} className="absolute inset-x-0 top-0 z-navbar">
        <NavContent
          dark={isDark}
          langOpen={langOpen}
          setLangOpen={setLangOpen}
          langTriggerId={langTriggerId}
          onOpenMenu={() => setMenuOpen(true)}
        />
      </header>

      {/* Navbar compacte — prend le relais une fois la navbar principale sortie de l'écran */}
      <MiniNavbar visible={scrolledPastHeader} dark={isDark} onOpenMenu={() => setMenuOpen(true)} />

      {/* Full-screen split menu */}
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onHero={onHero} />
    </>
  );
}
