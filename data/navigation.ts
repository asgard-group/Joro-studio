import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Offres",
    href: "/services",
    children: [
      { label: "JÖRO Office", href: "/services#office" },
      { label: "JÖRO Meeting", href: "/services#meeting" },
      { label: "JÖRO Living", href: "/services#living" },
      { label: "JÖRO Studio", href: "/services#studio" },
    ],
  },
  { label: "Portfolio", href: "/work" },
  { label: "À propos", href: "/about" },
];

export const footerLinks = {
  offres: [
    { label: "JÖRO Office", href: "/services#office" },
    { label: "JÖRO Meeting", href: "/services#meeting" },
    { label: "JÖRO Living", href: "/services#living" },
    { label: "JÖRO Studio", href: "/services#studio" },
  ],
  studio: [
    { label: "À propos", href: "/about" },
    { label: "Réalisations", href: "/work" },
    { label: "Blog & Insights", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "/privacy" },
    { label: "CGU", href: "/terms" },
    { label: "Politique RGPD", href: "/privacy#rgpd" },
  ],
};
