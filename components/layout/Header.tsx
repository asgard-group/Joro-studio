"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { navItems } from "@/data/navigation";
import Navigation from "./Navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-site">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            aria-label="JÖRO Studio — retour à l'accueil"
          >
            <Image
              src={scrolled ? "/images/logos/logo-dark.svg" : "/images/logos/logo-white.svg"}
              alt="JÖRO Studio"
              width={140}
              height={39}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <Navigation items={navItems} scrolled={scrolled} />

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className={`hidden lg:inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                scrolled
                  ? "bg-terracotta text-cream hover:bg-terracotta-600"
                  : "border border-cream text-cream hover:bg-cream hover:text-charcoal"
              }`}
            >
              Nous contacter
            </Link>
            <button
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col gap-1.5 p-1 lg:hidden"
            >
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  scrolled || mobileOpen ? "bg-charcoal" : "bg-cream"
                } ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  scrolled || mobileOpen ? "bg-charcoal" : "bg-cream"
                } ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  scrolled || mobileOpen ? "bg-charcoal" : "bg-cream"
                } ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-cream-300 bg-cream lg:hidden">
          <nav className="container-site py-6" aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-lg font-medium text-charcoal hover:text-terracotta"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="ml-4 mt-1 flex flex-col gap-1 border-l border-cream-300 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-sm text-charcoal-muted hover:text-terracotta"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Nous contacter
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
