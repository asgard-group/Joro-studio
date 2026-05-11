import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "reemploi-mobilier-bureaux",
    title: "Le réemploi dans les bureaux : contrainte ou opportunité de design ?",
    excerpt:
      "À l'heure où la RE2020 redessine les standards de la construction, le réemploi s'impose comme un levier stratégique pour les actifs tertiaires. Décryptage d'une tendance qui devient exigence.",
    date: "2025-04-15",
    readingTime: "6 min",
    category: "Durabilité",
    coverImage: "/images/blog/reemploi.jpg",
    author: { name: "Romain Ruby" },
  },
  {
    id: "2",
    slug: "espaces-hybrides-2025",
    title: "Espaces hybrides : ce que veulent vraiment les entreprises en 2025",
    excerpt:
      "Flex office, salles de visioconférence, zones de concentration : après trois ans de tâtonnements post-Covid, les organisations ont enfin une vision claire de leurs besoins. Analyse et recommandations.",
    date: "2025-03-08",
    readingTime: "8 min",
    category: "Tendances",
    coverImage: "/images/blog/hybride.jpg",
    author: { name: "Romain Ruby" },
  },
  {
    id: "3",
    slug: "asset-manager-valeur-aménagement",
    title: "Comment un aménagement premium valorise votre actif immobilier",
    excerpt:
      "Un plateau bien conçu, c'est un taux d'occupation maintenu, un loyer défendable et un locataire qui renouvelle. Pour les asset managers, l'aménagement n'est plus une dépense — c'est un investissement.",
    date: "2025-02-20",
    readingTime: "5 min",
    category: "Investissement",
    coverImage: "/images/blog/asset.jpg",
    author: { name: "Romain Ruby" },
  },
  {
    id: "4",
    slug: "materiaux-biosources-tertiaire",
    title: "Matériaux biosourcés en tertiaire : guide pratique pour prescripteurs",
    excerpt:
      "Chanvre, liège, laine de bois, béton de chanvre... Les matériaux biosourcés s'invitent dans les chantiers tertiaires premium. Ce qu'ils apportent, leurs limites, et comment les intégrer sans compromis sur la durabilité.",
    date: "2025-01-14",
    readingTime: "7 min",
    category: "Matériaux",
    coverImage: "/images/blog/biosources.jpg",
    author: { name: "Romain Ruby" },
  },
];
