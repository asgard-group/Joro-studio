"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContactPanel } from "@/components/providers/ContactPanelProvider";

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

const offresLinks: FooterItem[] = [
  { label: "Design & Build", href: "/#design-build" },
  { label: "AMO", href: "/#amo" },
  { label: "Marketing Suite", href: "/#marketing-suite" },
  { label: "Conseil & Stratégie Immobilière", href: "/#conseil-workplace" },
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
  const { open: openContact } = useContactPanel();

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
    { label: "Contact", onClick: openContact },
  ];

  return (
    <footer className="bg-[#1C2626] text-[#FAF6ED] -mt-px">

      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className="hidden flex-col gap-[60px] py-6 px-[32px] md:flex">
        <div className="flex flex-row items-start justify-between">
          <FooterColumn title="Nos offres" items={offresLinks} />
          <FooterColumn title="Liens rapides" items={quickLinks} />
          <FooterColumn title="Suivez-nous" items={socialLinks} />
          {/* Sélecteur de langue */}
          <div className="flex shrink-0 items-center gap-1">
            <span className={`${LABEL} font-bold`}>FR</span>
            <span className={`${LABEL} font-medium`}>/</span>
            <span className={`${LABEL} font-medium`}>EN</span>
          </div>
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

      {/* ── Mobile / tablette (accordéons) ──────────────────────── */}
      <div className="flex flex-col gap-[128px] p-6 md:hidden">
        <div className="flex flex-col self-stretch">
          <FooterAccordion title="Nos offres" items={offresLinks} />
          <FooterAccordion title="Liens rapides" items={quickLinks} />
          <FooterAccordion title="Suivez-nous" items={socialLinks} />
          <FooterAccordion title="Infos légales" items={legalLinks} />
        </div>
        <FooterLogo className="w-full" />
      </div>

    </footer>
  );
}

// ── Colonne desktop ──────────────────────────────────────────
function FooterColumn({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div className="flex flex-1 flex-col items-start gap-[18px]">
      <h3 className={LABEL}>{title}</h3>
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
        {/* Chevron arrow-drop-down — pivote à l'ouverture */}
        <Image
          src="/images/icon/arrow-drop-down-line.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={24}
          className="shrink-0"
          style={{
            width: 16,
            height: 24,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 200ms ease",
          }}
        />
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
