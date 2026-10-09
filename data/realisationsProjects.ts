export interface RealisationProject {
  id: string;
  title: string;
  description: string;
  tagLeft: string;
  tagRight: string;
  accentColor: string;
  image: string;
}

export const realisationsProjects: RealisationProject[] = [
  {
    id: "joro-house",
    title: "Jöro House",
    description:
      "Situé dans le 9e à Paris, à deux pas de l'iconique Opéra Garnier, quatre nouveaux appartements design ont vu le jour rue Taitbout. Cet ancien plateau de bureaux a été métamorphosé en logements élégants et fonctionnels, alliant design contemporain et prestations haut de gamme.",
    tagLeft: "Tiers-Lieux",
    tagRight: "Bureaux, Events & Coffee-Shop",
    accentColor: "#96461F",
    image: "/images/joro house.png",
  },
  {
    id: "tournelles",
    title: "Tournelles",
    description:
      "Au 52 rue des Tournelles, Joro Studio réinterprète un ancien volume industriel en un lieu événementiel contemporain. La verrière monumentale, les structures métalliques d'origine et les matériaux chaleureux composent un espace lumineux, épuré et entièrement modulable. Pensé pour accueillir conférences, lancements, expositions ou réceptions, le lieu offre une expérience à la fois élégante et polyvalente.",
    tagLeft: "Lieu Événementiel",
    tagRight: "Espace Modulable",
    accentColor: "#A97F4F",
    image: "/images/tournelle.png",
  },
  {
    id: "taitbout",
    title: "Taitbout",
    description:
      "La surface, initialement aménagée en plateau de bureaux, a été transformée en quatre appartements : trois studios de 35 m² et un trois-pièces de 68 m². Des agencements sur-mesure optimisent chaque espace pour offrir des lieux de vie fonctionnels et confortables. Le mobilier, soigneusement sélectionné, reflète une démarche responsable et répond aux attentes d'une clientèle attentive à la qualité.",
    tagLeft: "Habitat",
    tagRight: "Appartements Meublés",
    accentColor: "#7A7D54",
    image: "/images/taitbout.png",
  },
  {
    id: "rougemont",
    title: "Rougemont",
    description:
      "Au 8 rue de Rougemont, Jöro Studio signe un espace de bureaux contemporain, lumineux et accueillant. L'aménagement associe transparence,",
    tagLeft: "Espaces de Travail",
    tagRight: "Bureaux",
    accentColor: "#C1A46F",
    image: "/images/rougemont.png",
  },
  {
    id: "oberkampf-2",
    title: "Oberkampf",
    description:
      "Situé au coeur de la Cité du Figuier, ce projet a été pensé pour offrir un espace de travail flexible et convivial, tout en respectant les principes de durabilité. Les bureaux, conçus par Jöro Studio, allient matériaux bruts et design fonctionnel, créant un environnement à la fois moderne et inspirant. L'accent a été mis sur l'indépendance des espaces, tout en garantissant une atmosphère chaleureuse et collaborative.",
    tagLeft: "Espaces de Travail",
    tagRight: "Bureaux",
    accentColor: "#954F07",
    image: "/images/OBERKAMPF.png",
  },
];
