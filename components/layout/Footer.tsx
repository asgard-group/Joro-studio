"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/data/navigation";

// Style commun à tous les libellés du footer (cf. maquette Figma)
const LABEL = "text-[14px] font-normal uppercase tracking-[1.4px] text-[#FAF6ED]";

type FooterItem = { label: string; href: string; external?: boolean };

const offresLinks: FooterItem[] = footerLinks.offres;

const studioLinks: FooterItem[] = [
  { label: "Notre histoire", href: "/about" },
  { label: "Nos réalisations", href: "/work" },
  { label: "Témoignages", href: "/#temoignages" },
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

// Rendu d'un libellé — toutes les pages ciblées existent, donc navigation réelle
// (externe = nouvel onglet, interne = Link Next.js)
function ItemLabel({ item }: { item: FooterItem }) {
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
    <Link href={item.href} className={`${LABEL} block transition-opacity hover:opacity-60`}>
      {item.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1C2626] text-[#FAF6ED] -mt-px">

      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className="hidden flex-col gap-32 p-6 md:flex">
        <div className="flex flex-row items-start justify-between gap-8">
          <FooterColumn title="Nos offres" items={offresLinks} />
          <FooterColumn title="Notre studio" items={studioLinks} />
          <FooterColumn title="Suivez-nous" items={socialLinks} />

          {/* Sélecteur de langue */}
          <div className="flex items-center gap-1">
            <span className={`${LABEL} font-bold`}>FR</span>
            <span className={`${LABEL} font-medium`}>/</span>
            <span className={`${LABEL} font-medium`}>EN</span>
          </div>
        </div>

        <div className="flex flex-row items-end justify-between">
          <FooterLogo className="w-[416px]" />
          <div className="flex flex-row items-center gap-8">
            {legalLinks.map((link) => (
              <ItemLabel key={link.label} item={link} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile (accordéon) ──────────────────────────────────── */}
      <div className="flex flex-col gap-32 p-6 md:hidden">
        <div className="flex flex-col self-stretch">
          <FooterAccordion title="Nos offres" items={offresLinks} />
          <FooterAccordion title="Notre studio" items={studioLinks} />
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
    <div className="flex flex-1 flex-col gap-[18px]">
      <h3 className={LABEL}>{title}</h3>
      <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-3 pb-5">
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
    <Link href="/" className={`inline-block ${className}`} aria-label="JÖRO Studio — retour à l'accueil">
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
