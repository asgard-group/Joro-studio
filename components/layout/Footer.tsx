"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Style commun à tous les libellés du footer (cf. maquette Figma)
const LABEL = "text-[14px] font-normal uppercase tracking-[1.4px] text-[#FAF6ED]";

// Sans `href` : rendu en bouton (ex. "Contact", qui ouvre le panneau plutôt que
// de naviguer). Avec `href` : rendu en lien ; `onClick` reste utilisable pour
// intercepter la navigation par défaut (ex. le scroll ajusté vers #nos-realisations).
type FooterItem = {
  label: string;
  href?: string;
  external?: boolean;
  onClick?: (e: ReactMouseEvent) => void;
};

// Coordonnées : le téléphone est un placeholder (maquette), l'e-mail est celui de la page
// « Politique de confidentialité ».
const contactLinks: FooterItem[] = [
  { label: "+33 6 00 00 00 00 00", href: "tel:+33600000000" },
  { label: "contact@joro-studio.fr", href: "mailto:contact@joro-studio.fr", external: true },
];

const socialLinks: FooterItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/joro_studio/", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/joro-studio", external: true },
  { label: "Pinterest", href: "https://fr.pinterest.com/joro_studio/", external: true },
];

const legalLinks: FooterItem[] = [
  { label: "Mentions légales", href: "/privacy" },
  { label: "Cookies", href: "/privacy#cookies" },
  { label: "Politique de confidentialité", href: "/privacy" },
];

// Rendu d'un libellé — externe = nouvel onglet, interne = Link Next.js,
// sans href = bouton (action, ex. ouvrir le panneau de contact).
function ItemLabel({ item }: { item: FooterItem }) {
  if (!item.href) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={`${LABEL} block text-left transition-opacity hover:opacity-60`}
      >
        {item.label}
      </button>
    );
  }
  if (item.href.startsWith("tel:") || item.href.startsWith("mailto:")) {
    return (
      <a href={item.href} className={`${LABEL} transition-opacity hover:opacity-60`}>
        {item.label}
      </a>
    );
  }
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${LABEL} transition-opacity hover:opacity-60`}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={item.onClick} className={`${LABEL} block transition-opacity hover:opacity-60`}>
      {item.label}
    </Link>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // Scroll direct jusqu'à la 1ère réalisation déjà révélée (au lieu de tomber au début
  // de l'enchaînement sticky des offres, à cause du -mt-[250vh] qui décale l'ancre
  // #nos-realisations) — même logique que FullscreenMenu.tsx.
  function handleRealisationsClick(e: ReactMouseEvent) {
    if (pathname !== "/") return; // page différente : laisser la navigation par défaut

    e.preventDefault();
    const target = document.getElementById("nos-realisations");
    if (!target) return;

    const targetY = target.getBoundingClientRect().top + window.scrollY + window.innerHeight;
    window.history.pushState(null, "", "/#nos-realisations");
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  const quickLinks: FooterItem[] = [
    { label: "Notre studio", href: "/#notre-studio" },
    { label: "Nos réalisations", href: "/#nos-realisations", onClick: handleRealisationsClick },
    { label: "Nos offres", href: "/#nos-offres" },
  ];

  return (
    <footer className="relative bg-[#1C2626] text-[#FAF6ED] -mt-px">
      {/* Ligne de séparation CTA / footer — même ligne que sous la navbar du hero (crème à 50 %, 1px). */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ backgroundColor: "rgba(243, 242, 237, 0.5)" }} />

      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className="hidden flex-col gap-[100px] pb-6 pt-[32px] px-[32px] md:flex">
        <div className="flex items-start gap-[32px]">
          <FooterColumn title="Liens rapides" items={quickLinks} />
          <FooterColumn title="Suivez-nous" items={socialLinks} />
          <FooterColumn title="Contactez-nous" items={contactLinks} />
          <LanguageSwitch />
        </div>

        <div className="flex flex-row items-end justify-between">
          <FooterLogo className="h-[101px]" />
          <div className="flex flex-row items-start gap-8">
            {legalLinks.map((link) => (
              <ItemLabel key={link.label} item={link} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile (< 768px) : accordéons, sans sélecteur de langue ─────── */}
      <div className="flex flex-col gap-[64px] px-6 pb-6 pt-[32px] md:hidden">
        <div className="flex flex-col self-stretch">
          <FooterAccordion title="Liens rapides" items={quickLinks} />
          <FooterAccordion title="Suivez-nous" items={socialLinks} />
          <FooterAccordion title="Contactez-nous" items={contactLinks} />
          <FooterAccordion title="Infos légales" items={legalLinks} />
        </div>
        <FooterLogo className="w-full" />
      </div>

    </footer>
  );
}

// ── Sélecteur de langue (FR actif en gras, EN) ───────────────
function LanguageSwitch({ className = "" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center gap-1 ${className}`}>
      <span className={`${LABEL} font-bold`}>FR</span>
      <span className={`${LABEL} font-medium`}>/</span>
      <span className={`${LABEL} font-medium`}>EN</span>
    </div>
  );
}

// ── Colonne desktop ──────────────────────────────────────────
function FooterColumn({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div className="flex flex-1 flex-col items-start gap-[18px]">
      <h3 className={`${LABEL} font-medium`}>{title}</h3>
      <div className="flex flex-col items-start gap-2">
        {items.map((item) => (
          <ItemLabel key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Ligne repliable mobile ───────────────────────────────────
function FooterAccordion({
  title,
  items,
}: {
  title: string;
  items: FooterItem[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="self-stretch" style={{ borderBottom: "0.4px solid #999999" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4"
      >
        <span className={LABEL}>{title}</span>
        {/* « + » (devient « − » à l'ouverture) */}
        <span className="relative block h-[14px] w-[14px] shrink-0" aria-hidden="true">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-200 ${open ? "scale-y-0" : ""}`} />
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 pb-5 pl-[24px]">
          {items.map((item) => (
            <ItemLabel key={item.label} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Logo (crème sur fond sombre via filtre d'inversion) ──────
function FooterLogo({ className = "" }: { className?: string }) {
  return (
    // Ratio complet (1390 × 330) : la baseline (« amo · architecture · travaux »)
    // reste visible, aucun rognage.
    <Link
      href="/"
      className={`block overflow-hidden aspect-[1390/330] ${className}`}
      aria-label="JÖRO Studio — retour à l'accueil"
    >
      <Image
        src="/images/logos/joro-studio-amo-architecture-travaux.png"
        alt="JÖRO Studio — amo · architecture · travaux"
        width={1390}
        height={330}
        className="h-auto w-full"
        style={{ filter: "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.98)" }}
      />
    </Link>
  );
}
