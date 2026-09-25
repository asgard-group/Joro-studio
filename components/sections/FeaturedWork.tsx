"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue, type MotionStyle } from "framer-motion";
import Pill from "@/components/ui/Pill";
import { realisationsProjects, type RealisationProject } from "@/data/realisationsProjects";

const INTRO_TITLE = "Nos projets à Paris";
const INTRO_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const INTRO_VH = 250;
const CAROUSEL_SEGMENT_VH = 130;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// TODO (test) : intro scroll-scrubbée vers la 1ère réalisation, suivie du
// carrousel vertical continu des réalisations suivantes (mise en page/couleurs/
// textes déjà validés, photos encore en attente — cf. data/realisationsProjects.ts).
export default function FeaturedWork() {
  return <RealisationsSection projects={realisationsProjects} />;
}

// Titre + photo + sous-titres (gauche) / description (droite) — pas de hauteur
// fixe arbitraire : ce bloc vit dans un conteneur `absolute inset-0` calé sur
// toute la hauteur du panneau sticky (h-screen), donc largement assez de place
// pour la photo à sa taille naturelle (aspect-[906/560] pleine largeur de
// colonne) sans jamais rogner le titre ni le texte, quel que soit l'écran.
// `photoStyle` : transforms optionnels appliqués UNIQUEMENT à la photo (utilisé
// par l'intro pour la faire monter/grandir). `contentOpacity` : fondu optionnel
// appliqué au titre + sous-titres + description (utilisé par l'intro pour les
// faire apparaître ensemble, une fois la photo arrivée) — `undefined` en mode
// carrousel, où tout est déjà pleinement opaque en permanence.
function ProjectContent({
  project,
  photoStyle,
  contentOpacity,
}: {
  project: RealisationProject;
  photoStyle?: MotionStyle;
  contentOpacity?: MotionValue<number>;
}) {
  const opacity = contentOpacity ?? 1;
  return (
    <div className="grid h-full grid-cols-1 items-center gap-y-[40px] px-6 min-[1200px]:grid-cols-[1fr_340px] min-[1200px]:gap-x-[40px] min-[1200px]:pl-[280px] min-[1200px]:pr-[80px]">
      <div className="flex flex-col items-center">
        <motion.h2
          style={{ opacity, color: project.accentColor }}
          className="mb-[40px] text-center font-semibold uppercase leading-none tracking-tight text-[48px] min-[1200px]:text-[72px]"
        >
          {project.title}
        </motion.h2>
        <motion.div style={photoStyle} className="relative aspect-[906/560] w-full overflow-hidden">
          <Image src={project.image} alt={project.title} fill className="object-cover" sizes="(min-width: 1200px) 48vw, 90vw" />
        </motion.div>
        <motion.div
          style={{ opacity }}
          className="mt-[24px] flex w-full items-center justify-between text-[13px] font-semibold uppercase tracking-wider text-charcoal"
        >
          <span>{project.tagLeft}</span>
          <span>{project.tagRight}</span>
        </motion.div>
      </div>

      <motion.div style={{ opacity }} className="flex items-center min-[1200px]:h-full">
        <p className="texte text-charcoal/80">{project.description}</p>
      </motion.div>
    </div>
  );
}

// Décale une diapositive verticalement en fonction de son index et de la
// progression continue du carrousel : 0 quand elle est active, ±100vh sinon
// (largement suffisant pour sortir du panneau sticky, quel que soit le
// breakpoint). `carouselP` va de 0 (réalisation 0) à `transitions` (dernière) —
// pas un entier borné : la progression est continue, jamais de saut discret,
// et titre + photo + sous-titres + description quittent/arrivent ensemble,
// en un seul bloc (ProjectContent), jamais coupés indépendamment les uns des
// autres.
function useSlideY(carouselP: MotionValue<number>, index: number) {
  return useTransform(carouselP, (virtualIndex) => `${(index - virtualIndex) * 100}vh`);
}

function ProjectSlide({ project, index, carouselP }: { project: RealisationProject; index: number; carouselP: MotionValue<number> }) {
  const y = useSlideY(carouselP, index);
  return (
    <motion.div style={{ y }} className="absolute inset-0">
      <ProjectContent project={project} />
    </motion.div>
  );
}

// Intro (texte "Nos projets à Paris") + carrousel des réalisations, dans un
// seul bloc sticky continu (2 `sticky` séparés laisseraient voir 2 panneaux
// superposés à la jonction).
//
// Phase intro (0 → introFraction) : l'intro reste fixe (aucune anim dessus),
// pendant que SEULE la photo de la réalisation 0 monte et grandit par-dessus
// jusqu'à sa taille/position finale ; une fois arrivée, le label, le titre, les
// sous-titres et le texte descriptif apparaissent TOUS ENSEMBLE, avec la même
// animation (fondu) — le titre ne doit pas arriver avec la photo, sous peine de
// se superposer visuellement au texte de l'intro encore affiché.
//
// Phase carrousel (introFraction → 1) : label toujours affiché et fixe (hors
// du flux, position absolue indépendante) ; le reste (titre, photo, sous-titres,
// texte descriptif) forme UN SEUL bloc (ProjectContent) qui remonte en continu
// avec le scroll, comme un carrousel vertical classique (l'ancien contenu sort
// entièrement par le haut, le nouveau arrive entièrement par le bas) — jamais
// rogné, chaque diapositive vit dans un cadre aussi haut que le panneau sticky
// lui-même (cf. ProjectSlide).
function RealisationsSection({ projects }: { projects: RealisationProject[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });

  const transitions = projects.length - 1;
  const totalVh = INTRO_VH + transitions * CAROUSEL_SEGMENT_VH;
  const introFraction = INTRO_VH / totalVh;

  const introP = useTransform(p, (v) => Math.min(1, Math.max(0, v / introFraction)));
  // Position continue dans le carrousel : 0 (réalisation 0) → transitions (dernière).
  const carouselP = useTransform(p, (v) => {
    const cv = Math.min(1, Math.max(0, (v - introFraction) / (1 - introFraction)));
    return cv * transitions;
  });

  const [mode, setMode] = useState<"intro" | "carousel">("intro");
  useMotionValueEvent(p, "change", (v) => {
    setMode(v < introFraction ? "intro" : "carousel");
  });

  // L'intro (son propre pill + titre + paragraphe) disparaît d'un coup sec —
  // pas de fondu, elle "reste fixe" jusque-là — exactement quand la photo est
  // arrivée à sa taille finale (même seuil que heroY/heroScale ci-dessous),
  // PAS seulement à la toute fin de la phase intro : sinon elle resterait
  // affichée pendant que les sous-titres/texte du projet (déjà bien visibles)
  // se superposent à son propre paragraphe.
  const [showIntroOverlay, setShowIntroOverlay] = useState(true);
  useMotionValueEvent(introP, "change", (v) => {
    setShowIntroOverlay(v < 0.7);
  });

  // Photo de la réalisation 0 : monte (translateY) et grandit (scale) jusqu'à
  // sa taille finale sur le 1er tiers de la phase intro, CENTRÉE à l'écran ;
  // sur le dernier tiers, elle se décale ensuite vers sa position finale
  // (x → 0) en même temps que le reste du contenu apparaît (même timing que
  // supportingOpacity ci-dessous).
  //
  // Le décalage à compenser (DESKTOP_CENTER_OFFSET_PX) est une CONSTANTE, pas
  // une valeur mesurée dans le DOM : par construction du CONTENT_GRID
  // (min-[1200px]:pl-[280px] + gap-x-[40px] + colonne description 340px +
  // min-[1200px]:pr-[80px]), la colonne "1fr" de la photo est toujours décalée
  // de (pr + gap + descCol − pl) / 2 = (80 + 40 + 340 − 280) / 2 = 90px à
  // gauche du centre réel de l'écran, quelle que soit la largeur de viewport
  // (les termes en largeur de viewport s'annulent dans le calcul). Une 1ère
  // version mesurait ça via ref + ResizeObserver sur l'élément de la colonne,
  // mais cet élément est démonté/remonté à chaque bascule intro ↔ carrousel
  // (cf. mode plus bas), ce qui pouvait laisser la mesure obsolète en
  // scrollant vers le haut (retour en arrière dans la phase intro) — d'où des
  // décalages aberrants. Un nombre fixe n'a pas ce problème.
  const DESKTOP_CENTER_OFFSET_PX = 90;

  const heroY = useTransform(introP, [0, 0.7], reducedMotion ? [0, 0] : [200, 0]);
  const heroScale = useTransform(introP, [0, 0.7], reducedMotion ? [1, 1] : [0.5, 1]);
  const heroX = useTransform(introP, (v) => {
    if (reducedMotion || typeof window === "undefined" || window.innerWidth < 1200) return "0px";
    const t = Math.min(1, Math.max(0, (v - 0.7) / (1 - 0.7)));
    return `${DESKTOP_CENTER_OFFSET_PX * (1 - t)}px`;
  });
  // Label + titre + sous-titres + texte : fondu groupé sur le dernier tiers.
  // Sature à 1 dès que la phase intro se termine (introP reste à 1 ensuite) :
  // reste donc affiché tout du long de la phase carrousel, sans branchement
  // supplémentaire.
  const supportingOpacity = useTransform(introP, [0.7, 1], [0, 1]);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${totalVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-cream">
        {/* Label — position absolue indépendante, jamais dans le flux : ne
            bouge jamais, ni au fondu d'entrée (seule son opacité change) ni
            pendant tout le carrousel ensuite. */}
        <motion.div
          style={{ opacity: supportingOpacity }}
          className="pointer-events-none absolute left-6 top-6 z-20 min-[1200px]:left-[80px] min-[1200px]:top-1/2 min-[1200px]:-translate-y-1/2"
        >
          <Pill variant="light" dotSide="both">
            RÉALISATIONS
          </Pill>
        </motion.div>

        {mode === "intro" && showIntroOverlay && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="mb-[24px] font-semibold uppercase text-charcoal text-[36px] sm:text-[52px] lg:text-[64px] leading-none tracking-tight">
              {INTRO_TITLE}
            </h2>
            <p className="mx-auto max-w-[640px] texte text-charcoal/80">{INTRO_TEXT}</p>
          </div>
        )}

        {mode === "intro" ? (
          <div className="absolute inset-0">
            <ProjectContent
              project={projects[0]}
              photoStyle={{ x: heroX, y: heroY, scale: heroScale }}
              contentOpacity={supportingOpacity}
            />
          </div>
        ) : (
          <div className="absolute inset-0">
            {projects.map((project, index) => (
              <ProjectSlide key={project.id} project={project} index={index} carouselP={carouselP} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
