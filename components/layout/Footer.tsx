"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

// Style commun à tous les libellés du footer (cf. maquette Figma)
const LABEL = "text-[14px] font-normal uppercase tracking-[1.4px] text-[#FAF6ED]";

type FooterItem = { label: string; href: string; external?: boolean; comingSoon?: boolean };

const studioLinks: FooterItem[] = [
  { label: "Studio", href: "/about" },
  { label: "Réalisations", href: "/work" },
  { label: "Témoignages", href: "/#temoignages" },
  // Pas de page /contact : on garde la convention du header et du menu plein
  // écran, qui affichent « à venir » au survol plutôt que de mener à une 404.
  { label: "Contact", href: "/contact", comingSoon: true },
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
  if (item.comingSoon) {
    return <ComingSoonLink className={`${LABEL} inline-block`}>{item.label}</ComingSoonLink>;
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
    <Link href={item.href} className={`${LABEL} block transition-opacity hover:opacity-60`}>
      {item.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1C2626] text-[#FAF6ED] -mt-px">

      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className="hidden flex-row items-start justify-between gap-16 p-6 pb-32 md:flex">
        <NewsletterForm />
        <FooterColumn title="Liens rapides" items={studioLinks} />
        <FooterColumn title="Suivez-nous" items={socialLinks} />

        {/* Sélecteur de langue */}
        <div className="flex shrink-0 items-center gap-1">
          <span className={`${LABEL} font-bold`}>FR</span>
          <span className={`${LABEL} font-medium`}>/</span>
          <span className={`${LABEL} font-medium`}>EN</span>
        </div>
      </div>

      {/* ── Mobile / tablette (formulaire puis accordéons) ──────── */}
      <div className="flex flex-col gap-16 p-6 pb-24 md:hidden">
        <NewsletterForm />
        <div className="flex flex-col self-stretch">
          <FooterAccordion title="Liens rapides" items={studioLinks} />
          <FooterAccordion title="Suivez-nous" items={socialLinks} />
          <FooterAccordion title="Infos légales" items={legalLinks} />
        </div>
      </div>

      {/* ── Bloc bas pleine largeur — logo puis infos légales ────
          Le logo est à fond perdu (aucun padding latéral) ; les liens légaux
          n'apparaissent qu'en desktop, le mobile les ayant déjà en accordéon. */}
      <div className="flex flex-col">
        <FooterLogo className="w-full" />
        <div className="hidden flex-row items-center justify-between p-6 md:flex">
          {legalLinks.map((link) => (
            <ItemLabel key={link.label} item={link} />
          ))}
        </div>
      </div>

    </footer>
  );
}

// ── Formulaire newsletter ────────────────────────────────────
function NewsletterForm() {
  return (
    <form
      // Aucun endpoint n'est encore branché : on empêche le rechargement de page
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-[420px] flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-[26px] uppercase leading-[1.15]">
          Rejoignez l&rsquo;univers<br />JÖRO Studio
        </h3>
        <p className="text-[14px] leading-relaxed text-[#FAF6ED]/80">
          Abonnez-vous pour rejoindre notre communauté<br />
          et rester informé de l&rsquo;actualité du studio.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-row gap-6">
          <FooterInput name="prenom" placeholder="Prénom *" autoComplete="given-name" />
          <FooterInput name="nom" placeholder="Nom *" autoComplete="family-name" />
        </div>
        <FooterInput name="email" type="email" placeholder="Email *" autoComplete="email" />
      </div>

      <label className="flex cursor-pointer flex-row items-start gap-3">
        <input
          type="checkbox"
          name="consentement"
          required
          className="mt-[2px] h-4 w-4 shrink-0 cursor-pointer appearance-none border border-[#FAF6ED] checked:bg-[#FAF6ED]"
        />
        <span className="text-[13px] leading-snug text-[#FAF6ED]/80">
          J&rsquo;accepte que mes informations soient collectées conformément à la politique de
          confidentialité.
        </span>
      </label>

      <button
        type="submit"
        className={`${LABEL} self-end border-b border-[#FAF6ED] pb-1 transition-opacity hover:opacity-60 md:self-start`}
      >
        Envoyer la demande
      </button>
    </form>
  );
}

// Champ souligné (bordure basse uniquement), placeholder en capitales
function FooterInput({
  name,
  placeholder,
  type = "text",
  autoComplete,
}: {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      required
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-label={placeholder}
      className="w-full min-w-0 border-b border-[#FAF6ED]/50 bg-transparent pb-2 text-[14px] tracking-[1.4px] text-[#FAF6ED] placeholder:uppercase placeholder:text-[#FAF6ED]/60 focus:border-[#FAF6ED] focus:outline-none"
    />
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
    // Le ratio rogne le bas de l'image en desktop : le fichier fait 1390 × 330, le
    // mot-logo s'arrête à y=227 et la baseline commence à y=280 — on coupe à 250,
    // au milieu du blanc. En mobile, ratio complet : la baseline reste visible.
    <Link
      href="/"
      className={`block overflow-hidden aspect-[1390/330] md:aspect-[1390/250] ${className}`}
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
