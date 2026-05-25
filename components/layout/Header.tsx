"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { navItems } from "@/data/navigation";

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  // fixedHidden: controls the fixed navbar (true = off-screen)
  const [fixedHidden, setFixedHidden] = useState(true);
  const lastYRef = React.useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroHeight = window.innerHeight;

      if (currentY <= heroHeight) {
        // Dans le hero : fixed navbar toujours cachée
        setFixedHidden(true);
      } else if (currentY > lastYRef.current + 5) {
        // Scroll vers le bas après le hero : cacher
        setFixedHidden(true);
      } else if (currentY < lastYRef.current - 5) {
        // Scroll vers le haut après le hero : révéler
        setFixedHidden(false);
      }
      lastYRef.current = currentY;

      // Couleur adaptative pour la fixed navbar
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

    handleScroll();
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

  // Shared nav content — reused in both static and fixed headers
  const NavContent = ({ dark }: { dark: boolean }) => (
    <div className="px-4 sm:px-6 md:px-10 lg:px-[60px]">
      <div className="grid grid-cols-3 items-center py-3 sm:py-4 md:py-6 lg:py-[20px]">
        {/* Left — hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          className="justify-self-start p-1"
        >
          <Image
            src="/images/icon/menu-outline.svg"
            alt=""
            width={28}
            height={28}
            className="w-5 h-5 md:w-6 md:h-6"
            style={{ filter: dark ? 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)' : 'brightness(0) invert(1) sepia(1) hue-rotate(155deg) saturate(400%) brightness(0.14)' }}
          />
        </button>

        {/* Center — logo */}
        <Link
          href="/"
          className="justify-self-center"
          aria-label="JÖRO Studio — retour à l'accueil"
        >
          <Image
            src="/images/logos/joro-studio-ẢCHITECTURE-TRAVAUX@300x 2.png"
            alt="JÖRO Studio — Architecture & Travaux"
            width={320}
            height={97}
            priority
            className="object-contain w-auto h-[35px] md:h-[53px]"
            style={{ maxWidth: "none", filter: dark ? 'none' : 'brightness(0) invert(1) sepia(1) hue-rotate(155deg) saturate(400%) brightness(0.14)' }}
          />
        </Link>

        {/* Right — search */}
        <button aria-label="Rechercher" className="justify-self-end p-1">
          <Image
            src="/images/icon/search-line.svg"
            alt=""
            width={28}
            height={28}
            className="w-5 h-5 md:w-6 md:h-6"
            style={{ filter: dark ? 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)' : 'brightness(0) invert(1) sepia(1) hue-rotate(155deg) saturate(400%) brightness(0.14)' }}
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Static header — absolute overlay on the hero, scrolls with the page */}
      <header className="absolute inset-x-0 top-0 z-[70]">
        <NavContent dark={true} />
      </header>

      {/* 2. Fixed navbar — appears on scroll-up past hero, with backdrop blur */}
      <div
        className={`fixed inset-x-0 top-0 z-[70] backdrop-blur-md transition-transform duration-300 ${
          fixedHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <NavContent dark={isDark} />
      </div>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[80] bg-charcoal transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
          className="absolute right-5 top-5 p-2 text-cream sm:right-6 sm:top-6 lg:right-10 lg:top-8"
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-8 sm:h-8">
            <line x1="6" y1="6" x2="26" y2="26" />
            <line x1="26" y1="6" x2="6" y2="26" />
          </svg>
        </button>

        <div className="container-site flex h-full flex-col justify-center">
          <nav aria-label="Menu principal">
            <ul className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-3xl text-cream transition-colors hover:text-terracotta sm:text-4xl lg:text-5xl"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 lg:mt-12">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
              >
                Nous contacter
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
