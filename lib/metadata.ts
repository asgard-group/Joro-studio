import type { Metadata } from "next";

const siteConfig = {
  name: "JÖRO Studio",
  // URL de production fixe (canonical, og:url, og:image, sitemap) : ne dépend plus d'une variable d'environnement,
  // pour qu'un déploiement de test (*.netlify.app) ne se retrouve pas dans le référencement.
  url: "https://joro-studio.fr",
  description:
    "JÖRO Studio conçoit et réalise des espaces hybrides haut de gamme — bureaux, hôtellerie, résidentiel — avec un engagement fort pour le design contemporain et la responsabilité écologique.",
};

export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — Architecture & Design d'intérieur durable`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [{ url: `${siteConfig.url}/images/og-default.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: { canonical: siteConfig.url },
    ...overrides,
  };
}

export { siteConfig };
