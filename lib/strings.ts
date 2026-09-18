/**
 * Chaînes textuelles centralisées du site.
 *
 * Toute string visible par l'utilisateur OU lue par un lecteur d'écran
 * (alt, aria-label, etc.) doit transiter par ce fichier.
 *
 * Cette structure prépare le terrain pour i18n :
 * - Le jour où l'on installe next-intl, on remplacera l'export par une fonction `t()`
 *   qui pioche dans des dictionnaires `messages/fr.json` / `messages/en.json`.
 * - Aucune chaîne hardcodée ne doit subsister dans les composants.
 */

export const headerStrings = {
  // Logo (centre du header)
  logoAlt: "JÖRO Studio — Architecture & Travaux",
  logoAriaLabel: "JÖRO Studio — retour à l'accueil",

  // Bouton menu (droite, à côté du sélecteur de langue)
  menu: "Menu",

  // Bouton contact (gauche)
  contact: "Contact",

  // Sections pinnées (droite, à la place de l'ancien sélecteur de langue) —
  // liens directs vers les ancres de la homepage, séparés par un point.
  pinnedNav: {
    studio: "Studio",
    services: "Services",
    projets: "Projets",
  },

  // Menu plein-écran
  menuOverlay: {
    closeAriaLabel: "Fermer le menu",
    navAriaLabel: "Menu principal",
    contactCta: "Nous contacter",
  },

  // Panneau de contact (formulaire plein écran, ouvert depuis le bouton Contact)
  contactPanel: {
    closeAriaLabel: "Fermer le formulaire de contact",
    dialogAriaLabel: "Formulaire de contact",
  },
} as const;

// Section Hero — appel à l'action de scroll en bas de section (générique,
// réutilisé quelle que soit la page qui monte le composant Hero).
export const heroStrings = {
  scrollCta: "Glisser pour découvrir",
} as const;

// Hero de la page d'accueil — titre et texte descriptif spécifiques à la home.
export const homeHeroStrings = {
  title: {
    line1: "Créer",
    line2: "les espaces",
    // Scindée en 2 parties : sur une seule ligne à partir de 470px ("hybrides
    // de demain"), sur 2 lignes en dessous ("hybrides" / "de demain").
    line3a: "hybrides",
    line3b: "de demain",
  },
  // Même texte complet, mais avec des sauts de ligne manuels différents par
  // breakpoint (maquette Figma) — desktop (≥835px) sur 4 lignes, tablette
  // (470-834px) sur 3 lignes, mobile (<470px) version raccourcie sur 3 lignes.
  descriptionDesktop: {
    line1: "Jöro Studio accompagne particuliers et professionnels",
    line2: "dans la transformation de leurs espaces, alliant assistance",
    line3: "à maîtrise d'ouvrage, architecture et conseil pour des lieux",
    line4: "plus durables et inspirants.",
  },
  descriptionTablet: {
    line1: "Jöro Studio accompagne particuliers et professionnels dans la",
    line2: "transformation de leurs espaces, alliant assistance à maîtrise d'ouvrage,",
    line3: "architecture et conseil pour des lieux plus durables et inspirants.",
  },
  descriptionMobile: {
    line1: "Jöro Studio accompagne particuliers et",
    line2: "professionnels dans la transformation de",
    line3: "leurs espaces.",
  },
} as const;

// Section CTA (bas de la home) — 2 blocs : prise de rendez-vous et newsletter.
export const ctaStrings = {
  appointment: {
    titleLine1: "Rencontrez notre équipe",
    titleLine2: "dès maintenant",
    button: "Prendre rendez-vous",
  },
  newsletter: {
    titleLine1: "Tenez vous aux courants",
    titleLine2: "des derniers projets",
    emailLabel: "E-mail",
    emailPlaceholder: "E-mail",
    button: "Rejoindre",
  },
} as const;
