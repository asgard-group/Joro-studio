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

  // Bouton hamburger (gauche)
  menu: "Menu",

  // Bouton contact (droite)
  contact: "Contact",

  // Sélecteur de langue (droite)
  currentLanguage: "FR",
  alternateLanguage: "EN",
  languageSwitcherAriaLabel: "Sélectionner la langue",

  // Menu plein-écran
  menuOverlay: {
    closeAriaLabel: "Fermer le menu",
    navAriaLabel: "Menu principal",
    contactCta: "Nous contacter",
  },
} as const;
