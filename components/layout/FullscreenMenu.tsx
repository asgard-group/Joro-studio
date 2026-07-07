"use client";

import Link from "next/link";
import Image from "next/image";

interface MenuLink {
  label: string;
  href: string;
}

const menuLinks: MenuLink[] = [
  { label: "NOTRE STUDIO",    href: "/#notre-studio" },
  { label: "NOS OFFRES",      href: "/#nos-offres" },
  { label: "NOS RÉALISATIONS",href: "/#nos-realisations" },
  { label: "CONTACT",         href: "/contact" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenMenu({ isOpen, onClose }: Props) {


  return (
    <>
      <div className={`joro-menu__backdrop${isOpen ? " is-visible" : ""}`} aria-hidden="true" />
      <div className={`joro-menu${isOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu principal">
        {/* Top bar — même structure exacte que la navbar du site */}
        <div className="px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px] relative z-10 flex-shrink-0">
          <div className="grid grid-cols-3 items-center py-[20px]">

            {/* Left — ✕ + label "Menu" */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le menu"
              className="justify-self-start w-full inline-flex items-center gap-[6px] bg-transparent border-0 p-0 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 min-[700px]:w-6 text-cream"
                style={{ filter: "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)" }}
              >
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>

            {/* Center — vide */}
            <div className="justify-self-center" />

            {/* Right — Fr▼ */}
            <div className="justify-self-end w-full inline-flex items-center justify-end">
              <div className="hidden min-[700px]:inline-flex relative items-center">
                <button
                  type="button"
                  className="inline-flex items-center cursor-pointer"
                  style={{ gap: "0px" }}
                >
                  <span
                    className="text-[16px] font-medium text-cream"
                    style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                  >
                    Fr
                  </span>
                  <span className="inline-flex items-center justify-center" style={{ width: "16px", height: "24px" }}>
                    <Image
                      src="/images/icon/arrow-drop-down-line.svg"
                      alt=""
                      width={16}
                      height={24}
                      style={{
                        width: "16px",
                        height: "24px",
                        filter: "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)",
                      }}
                    />
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Logo bas droite */}
        <Link href="/" onClick={onClose} aria-label="JÖRO Studio — retour à l'accueil" className="joro-menu__logo-br">
          <Image
            src="/images/logos/joro-studio-ẢCHITECTURE-TRAVAUX@300x 2.png"
            alt="JÖRO Studio — Architecture & Travaux"
            width={320}
            height={97}
            style={{ maxWidth: "none", height: "70px", width: "auto" }}
          />
        </Link>

        {/* Body */}
        <div className="joro-menu__body">
          {/* Left — nav + social */}
          <div className="joro-menu__left">
            <nav aria-label="Menu principal">
              <ul className="joro-menu__nav">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onClose}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social icons — mêmes SVGs que le footer */}
            <div className="joro-menu__social">
              <a href="https://www.instagram.com/joro_studio/" target="_blank" rel="noopener noreferrer" aria-label="JÖRO Studio sur Instagram">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/joro-studio" target="_blank" rel="noopener noreferrer" aria-label="JÖRO Studio sur LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://fr.pinterest.com/joro_studio/" target="_blank" rel="noopener noreferrer" aria-label="JÖRO Studio sur Pinterest">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
