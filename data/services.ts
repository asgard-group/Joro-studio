import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "office",
    name: "JÖRO Office",
    tagline: "Bureaux opérés haut de gamme",
    description:
      "Des espaces de travail entièrement opérés, pensés pour les entreprises qui refusent de choisir entre excellence et agilité. JÖRO Office conçoit, aménage et exploite vos bureaux clé en main — du mobilier aux services — pour que vous puissiez vous concentrer sur l'essentiel.",
    features: [
      "Aménagement sur mesure",
      "Gestion opérationnelle intégrée",
      "Services et conciergerie",
      "Flexibilité contractuelle",
      "Design signature JÖRO",
    ],
    href: "/services#office",
  },
  {
    id: "meeting",
    name: "JÖRO Meeting",
    tagline: "Salles de réunion & espaces événementiels",
    description:
      "Des lieux d'exception pour vos réunions stratégiques, séminaires et événements clients. Chaque espace JÖRO Meeting est conçu pour favoriser la concentration, l'inspiration et l'impression — au service de vos enjeux business.",
    features: [
      "Location à la demi-journée ou journée",
      "Équipement audiovisuel premium",
      "Catering et service sur place",
      "Capacités de 4 à 50 personnes",
      "Réservation en ligne",
    ],
    href: "/services#meeting",
  },
  {
    id: "living",
    name: "JÖRO Living",
    tagline: "Résidences & hospitalité lifestyle",
    description:
      "L'art de vivre selon JÖRO. Des appartements et résidences haut de gamme conçus pour les séjours professionnels prolongés, les relocalisations et les cadres en mobilité. Tout le confort du chez-soi, avec l'excellence d'un hôtel boutique.",
    features: [
      "Studios et appartements meublés premium",
      "Flexibilité de durée (1 semaine à 12 mois)",
      "Services hôteliers à la carte",
      "Connectivité fibre garantie",
      "Support 24/7",
    ],
    href: "/services#living",
  },
  {
    id: "studio",
    name: "JÖRO Studio",
    tagline: "Architecture intérieure & rénovation",
    description:
      "Notre atelier de création. JÖRO Studio conçoit et réalise des projets d'architecture intérieure sur mesure pour des entreprises, des investisseurs et des asset managers. Du programme à la livraison, nous pilotons l'ensemble du projet avec un engagement fort pour la durabilité et l'excellence artisanale.",
    features: [
      "Conception architecturale et plans",
      "Direction artistique et design d'intérieur",
      "Coordination des corps de métier",
      "Approvisionnement responsable",
      "Suivi de chantier et livraison",
    ],
    href: "/services#studio",
  },
];
