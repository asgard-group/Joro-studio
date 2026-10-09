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

  // Inscription à gauche de la navbar desktop (≥1280px)
  tagline: "ARCHITECTURE • AMO • TRAVAUX",

  // Bouton menu (droite, à côté du sélecteur de langue)
  menu: "Menu",

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

// Hero de la page d'accueil — texte d'accroche (à la place de l'ancien titre) et bouton.
export const homeHeroStrings = {
  // Espaces insécables (\u00A0) : si « espaces » / « demain » passe à la ligne, « les » / « de » le suivent.
  headingLines: ["Concevoir les\u00A0espaces", "hybrides de\u00A0demain"],
  lead: "Jöro Studio accompagne particuliers et professionnels dans la transformation de leurs espaces, alliant assistance à maîtrise\u00A0d\u2019ouvrage, architecture et conseil pour des lieux plus durables et inspirants. Du premier croquis à la remise des clés.",
  discover: "Nos projets",
  scroll: "Défiler",
} as const;

// Section "Notre studio" (À propos, bas du hero) — titre, paragraphe, label.
export const aboutStudioStrings = {
  title: "Notre studio",
  text: "Basé à Paris, notre studio réunit architecture, design et maîtrise d\u2019ouvrage. De la conception à la réalisation, nous créons des espaces dans le domaine de l\u2019hôtellerie, bureaux, événementiel et espaces hybrides. Notre ambition : façonner les usages de demain à travers une architecture contemporaine et intemporelle.",
  imageAlt: "Étagères et objets décoratifs dans un espace réalisé par JÖRO Studio",
  label: "À propos",
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
