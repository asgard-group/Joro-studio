"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent as ReactMouseEvent } from "react";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

interface MenuLink {
  label: string;
  href: string;
  image: string;
}

const menuLinks: MenuLink[] = [
  { label: "STUDIO",          href: "/#notre-studio",       image: "/images/2024-01-Retines-Pigalle-_23A2312-web 2.webp" },
  { label: "OFFRES",          href: "/#nos-offres",         image: "/images/work/3.webp" },
  { label: "RÉALISATIONS",    href: "/#nos-realisations",   image: "/images/work/1.webp" },
  { label: "TÉMOIGNAGES",     href: "/#temoignages",        image: "/images/work/2.webp" },
  { label: "CONTACT",         href: "/contact",             image: "/images/2024-10-Retines-Asgard-parquet-Pigalle-DSC04495.webp" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onHero: boolean;
}

export default function FullscreenMenu({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  // La dernière image survolée (`current`) se balaie par-dessus, l'avant-dernière (`previous`)
  // reste pleinement ouverte juste derrière → jamais de fond sombre pendant le balayage.
  // Le balayage se rejoue à chaque survol : l'animation CSS redémarre dès qu'une image (re)devient
  // `current` (nouvel élément qui reçoit data-state="current").
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(0);

  function activate(index: number) {
    if (index === current) return; // déjà au premier plan
    setPrevious(current);
    setCurrent(index);
  }

  // Scroll direct jusqu'à la 1ère réalisation déjà révélée (au lieu de tomber au début
  // de l'enchaînement sticky des offres, à cause du -mt-[250vh] qui décale l'ancre #nos-realisations)
  function handleRealisationsClick(e: ReactMouseEvent) {
    if (pathname !== "/") return; // page différente : laisser la navigation par défaut vers /#nos-realisations

    e.preventDefault();
    onClose();

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const target = document.getElementById(isDesktop ? "nos-realisations" : "nos-realisations-mobile");
    if (!target) return;

    const targetY = target.getBoundingClientRect().top + window.scrollY + window.innerHeight;
    window.history.pushState(null, "", "/#nos-realisations");
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  return (
    <>
      <div className={`joro-menu__backdrop${isOpen ? " is-visible" : ""}`} aria-hidden="true" />
      <div className={`joro-menu${isOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu principal">
        {/* Top bar — survole le panneau gauche et la photo, en overlay */}
        <div className="absolute inset-x-0 top-0 z-20 px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px]">
          <div className="flex items-center pt-[40px] pb-[20px]">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le menu"
              className="inline-flex items-center gap-[6px] bg-transparent border-0 p-0 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-[30px] h-[30px] text-cream"
                style={{ filter: "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)" }}
              >
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="joro-menu__body">
          {/* Left — nav + social */}
          <div className="joro-menu__left">
            <nav aria-label="Menu principal">
              <ul className="joro-menu__nav">
                {menuLinks.map((link, index) => (
                  <li
                    key={link.href}
                    onMouseEnter={() => activate(index)}
                    onFocus={() => activate(index)}
                  >
                    {link.href === "/contact" ? (
                      <ComingSoonLink className="joro-menu__nav-link" block>
                        {link.label}
                      </ComingSoonLink>
                    ) : link.href === "/#nos-realisations" ? (
                      <Link href={link.href} onClick={handleRealisationsClick} className="joro-menu__nav-link">
                        {link.label}
                      </Link>
                    ) : (
                      <Link href={link.href} onClick={onClose} className="joro-menu__nav-link">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Droite — photo qui change selon le lien survolé à gauche, effet de balayage (clip-path) */}
          <div className="joro-menu__preview" aria-hidden="true">
            {menuLinks.map((link, index) => {
              const state =
                index === current && current !== previous
                  ? "current" // se balaie par-dessus
                  : index === current || index === previous
                    ? "prev" // reste ouverte derrière
                    : "hidden"; // repliée, hors champ
              const zIndex = state === "current" ? 3 : state === "prev" ? 2 : 1;
              return (
                <div
                  key={link.href}
                  className="joro-menu__preview-item"
                  data-state={state}
                  style={{ zIndex }}
                >
                  <Image
                    src={link.image}
                    alt=""
                    fill
                    className="joro-menu__preview-img"
                    sizes="50vw"
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}
