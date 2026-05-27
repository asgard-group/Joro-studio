import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Portfolio", href: "/work" },
  { label: "À propos", href: "/about" },
];

export const footerLinks = {
  offres: [
    { label: "Design & Build", href: "/services#design-build" },
    { label: "AMO", href: "/services#amo" },
    { label: "Marketing Suite", href: "/services#marketing-suite" },
    { label: "Conseil & Stratégie Immobilière", href: "/services#conseil-workplace" },
  ],
  studio: [
    { label: "Notre histoire", href: "/about" },
    { label: "Nos réalisations", href: "/work" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Politique de cookies", href: "/privacy#cookies" },
    { label: "Mentions légales", href: "/privacy" },
  ],
};
