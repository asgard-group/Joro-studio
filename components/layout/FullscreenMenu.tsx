"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import ComingSoonLink from "@/components/ui/ComingSoonLink";
import { useContactPanel } from "@/components/providers/ContactPanelProvider";

interface MenuLink {
  label: string;
  href: string;
  image: string;
}

const menuLinks: MenuLink[] = [
  { label: "ACCUEIL",         href: "/",                    image: "/images/accueil.webp" },
  { label: "À PROPOS",         href: "/#notre-studio",       image: "/images/a-propos.webp" },
  { label: "NOS SERVICES",   href: "/#nos-offres",         image: "/images/taitbout.webp" },
  { label: "RÉALISATIONS",    href: "/#nos-realisations",   image: "/images/realisations.webp" },
  { label: "CONTACT",         href: "/contact",             image: "/images/contact.webp" },
];

const socialLinks = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/joro_studio/" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/company/joro-studio" },
  { label: "PINTEREST", href: "https://fr.pinterest.com/joro_studio/" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onHero: boolean;
}

export default function FullscreenMenu({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const { open: openContact } = useContactPanel();
  // Enchaînement des photos (d'après « menu-split-animation.html ») : chaque survol crée une NOUVELLE
  // couche qui balaie de bas en haut (rognage 100 % → 0 en 1 s) avec un dézoom 1,1 → 1 (1,1 s). Un
  // balayage en cours n'est jamais interrompu (pas de saut) ; les couches du dessous ne sont retirées
  // qu'une fois la nouvelle entièrement dévoilée (onAnimationEnd). La 1re couche apparaît sans balayage.
  const [layers, setLayers] = useState<{ key: number; index: number; instant: boolean }[]>([
    { key: 0, index: 0, instant: true },
  ]);
  const nextKey = useRef(1);
  const current = layers[layers.length - 1].index; // photo affichée (la plus récente)

  function activate(index: number) {
    if (index === current) return; // déjà au premier plan
    const key = nextKey.current++;
    setLayers((l) => [...l, { key, index, instant: false }]);
  }

  // Une couche est entièrement dévoilée : on retire toutes celles qu'elle recouvre.
  function layerRevealed(key: number) {
    setLayers((l) => {
      const i = l.findIndex((x) => x.key === key);
      return i > 0 ? l.slice(i) : l;
    });
  }

  // Scroll direct jusqu'à la 1ère réalisation déjà révélée (au lieu de tomber au début
  // de l'enchaînement sticky des offres, à cause du -mt-[250vh] qui décale l'ancre #nos-realisations)
  function handleRealisationsClick(e: ReactMouseEvent) {
    if (pathname !== "/") return; // page différente : laisser la navigation par défaut vers /#nos-realisations

    e.preventDefault();
    onClose();

    const target = document.getElementById("nos-realisations");
    if (!target) return;

    const targetY = target.getBoundingClientRect().top + window.scrollY + window.innerHeight;
    window.history.pushState(null, "", "/#nos-realisations");
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  return (
    <>
      <div className={`joro-menu__backdrop${isOpen ? " is-visible" : ""}`} aria-hidden="true" />
      {/* Le bouton Menu est maintenant à droite de la navbar (à côté du sélecteur de
          langue) : le panneau s'ouvre donc depuis la droite — on réutilise la classe
          d'animation `.joro-contact` (balayage droite → gauche), qui n'a rien à voir
          avec le panneau de contact lui-même, seulement avec son sens d'ouverture. */}
      <div className={`joro-contact joro-menu-panel${isOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu principal">
        {/* Top bar — bouton de fermeture uniquement (le sélecteur FR/EN vit dans le
            panneau de droite, cf. .joro-menu__left, pour rester sur le fond sombre
            et ne jamais chevaucher la photo à gauche). */}
        {/* Marges identiques à celles du hero et de la navbar : 16 / 32 / 40 px (seuils 835 / 1280 px), haut 24 px, contenu centré dans 1920 px. */}
        <div className="absolute inset-x-0 top-0 z-20 mx-auto max-w-[1920px] px-[16px] min-[835px]:px-[32px] min-[1280px]:px-[40px]">
          <div className="flex items-center justify-end pt-[24px] pb-[20px]">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le menu"
              className="bg-transparent border-0 p-0 cursor-pointer text-[13px] font-semibold uppercase tracking-[0.08em] text-cream transition-opacity hover:opacity-60"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Body — ordre inversé par rapport à avant : le panneau s'ouvrant
            désormais depuis la droite, la photo (côté de l'ouverture) passe à
            gauche et les liens de navigation à droite. */}
        <div className="joro-menu__body">
          {/* Gauche — photo qui change selon le lien survolé à droite, effet de balayage (clip-path) */}
          <div className="joro-menu__preview" aria-hidden="true">
            {/* « stack » : glisse de +5 % à 0 à l'ouverture, avec un léger retard (0,2 s). */}
            <div className="joro-menu__preview-stack">
              {layers.map((layer) => (
                <div
                  key={layer.key}
                  className={`joro-menu__preview-item${layer.instant ? "" : " is-entering"}`}
                  style={{ zIndex: layer.key + 1 }}
                  onAnimationEnd={(e) => {
                    if (e.target === e.currentTarget) layerRevealed(layer.key);
                  }}
                >
                  <div className="joro-menu__preview-zoom">
                    <Image
                      src={menuLinks[layer.index].image}
                      alt=""
                      fill
                      className="joro-menu__preview-img"
                      sizes="50vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Droite — FR/EN + nav + social */}
          <div className="joro-menu__left">
            {/* pt-0 sous 768px : .joro-menu__left a déjà 32px de padding-top à ce
                breakpoint (cf. globals.css) — cumulé au pt-[40px] ça décalait FR/EN
                sous la ligne du bouton Fermer au lieu de s'aligner avec lui. */}
            <div className="pt-[24px]">
              <ComingSoonLink className="text-[13px] font-semibold uppercase tracking-[0.08em] text-cream">
                FR&nbsp;/&nbsp;EN
              </ComingSoonLink>
            </div>
            <nav aria-label="Menu principal">
              <ul className="joro-menu__nav">
                {menuLinks.map((link, index) => (
                  <li
                    key={link.href}
                    onMouseEnter={() => activate(index)}
                    onFocus={() => activate(index)}
                  >
                    {link.href === "/contact" ? (
                      // Ouvre le panneau de contact PAR-DESSUS le menu, qui reste ouvert en
                      // dessous (même panneau que le Footer et le CTA, monté par Header.tsx
                      // après le menu, avec le même z-index : il passe donc au premier plan).
                      <button
                        type="button"
                        onClick={() => openContact({ keepPhoto: menuLinks[current]?.label === "CONTACT" })}
                        className="joro-menu__nav-link bg-transparent border-0 p-0 text-left cursor-pointer"
                      >
                        {link.label}
                      </button>
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

            {/* Réseaux sociaux — mêmes liens que le footer */}
            <ul className="flex flex-col gap-[10px] pb-[40px]">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-medium uppercase tracking-[0.14em] text-cream/70 transition-colors hover:text-cream"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </>
  );
}
