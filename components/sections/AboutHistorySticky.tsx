"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Pill from "@/components/ui/Pill";

// Frames fixes affichées à la place des vidéos tant qu'elles n'ont pas fini de charger.
const VIDEO_1_POSTER = "/images/posters/video-1-poster.webp";
const VIDEO_2_POSTER = "/images/posters/video-2-poster.webp";

// TODO (test) : texte du 2e slide en lorem ipsum en attendant le vrai contenu.
const SLIDE_1_TEXT =
  "JÖRO Studio est né d'un constat : pourquoi l'élégance, l'innovation et le respect de l'environnement ne pourraient-ils pas coexister ? Chacun de nos projets est une réponse concrète à ce défi : concevoir des espaces hybrides, inspirants et durables, et devenir leaders de la conception d'espaces dédiés aux nouveaux usages urbains, bureaux, événementiel, hôtellerie…";
const SLIDE_2_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

// Même animation de révélation mot par mot (masque + glissement depuis le bas)
// que le titre "LEUR EXPÉRIENCE" de Testimonials.tsx — reprise ici localement
// (pas d'import partagé entre sections, cf. incident ServicesAll/AnimatedLetters).
const TITLE_EASE = [0.16, 1, 0.3, 1] as const;

// Test de mise en page — "sticky scroll slider" inspiré d'une référence externe
// (voir conversation) : bloc de 3x la hauteur du viewport, wrapper sticky à
// l'intérieur, barre de progression + grille d'images qui morphent en continu
// avec le scroll, et bascule du texte (titre inchangé, seul le paragraphe
// change) à 50% de progression. Reconstruit avec Framer Motion (déjà utilisé
// ailleurs sur le site) plutôt que la mécanique scroll-listener/rAF brute de
// la référence.
export default function AboutHistorySticky() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const barHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // Photo "top-right" (video 1, wideVideoRef) et photo "bottom-left" (video 2,
  // narrowVideoRef) gardent chacune leur emplacement tout du long : seule leur
  // TAILLE s'inverse en continu (grande ↔ petite), jamais leur position dans
  // le duo — cf. capture de référence. La somme des 2 hauteurs (25+17.5vw)
  // reste constante quel que soit t, donc le bloc entier peut être centré une
  // fois pour toutes sans recalcul (cf. wrapper plus bas).
  const topWidth = useTransform(scrollYProgress, [0, 1], ["40vw", "15vw"]);
  const topHeight = useTransform(scrollYProgress, [0, 1], ["25vw", "17.5vw"]);
  const bottomWidth = useTransform(scrollYProgress, [0, 1], ["15vw", "40vw"]);
  const bottomHeight = useTransform(scrollYProgress, [0, 1], ["17.5vw", "25vw"]);

  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);

  // Lecture croisée des 2 vidéos — narrowVideo = colonne étroite (video 2),
  // wideVideo = colonne large (video 1). Piloté depuis le même
  // useMotionValueEvent que la bascule de texte (pas de listener séparé),
  // avec 2 refs-garde-fou pour ne déclencher chaque action qu'une seule fois
  // au moment du franchissement (pas en continu à chaque frame de scroll) :
  // - enteredRef : détecte l'entrée dans la zone sticky (onEnter/onEnterBack
  //   de la référence). scrollYProgress est clampé à [0,1] et un MotionValue
  //   ne déclenche "change" que si sa valeur bouge réellement, donc ce
  //   callback ne tourne déjà QUE pendant qu'on traverse activement le bloc.
  // - isAboveThresholdRef : détecte le franchissement du seuil des 50%.
  const narrowVideoRef = useRef<HTMLVideoElement>(null);
  const wideVideoRef = useRef<HTMLVideoElement>(null);
  const enteredRef = useRef(false);
  const isAboveThresholdRef = useRef(false);

  // Slider mobile (voir bloc dédié plus bas) — mêmes 2 vidéos, mais rejouées
  // dans une structure superposée (crossfade + zoom) au lieu de la grille en
  // quinconce desktop. item1Hidden / item2Visible sont volontairement 2 états
  // indépendants (pas un simple 0|1) pour pouvoir décaler la sortie (immédiate)
  // et l'entrée (+300ms) l'une de l'autre, cf. mobileTransitionTimeoutRef.
  const mobileWideVideoRef = useRef<HTMLVideoElement>(null);
  const mobileNarrowVideoRef = useRef<HTMLVideoElement>(null);
  const [item1Hidden, setItem1Hidden] = useState(false);
  const [item2Visible, setItem2Visible] = useState(false);
  const mobileTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hauteur du bloc slider mobile, recalculée au chargement + au resize (pas de
  // valeur fixe) : hauteur de la fenêtre moins la hauteur du bloc texte
  // au-dessus, moins l'espace du header (haut+bas) — cf. MiniNavbar (mesurée
  // via son id plutôt qu'une constante en dur, pour rester juste si son
  // contenu change plus tard).
  const mobileTextRef = useRef<HTMLDivElement>(null);
  const [mobileMediaHeight, setMobileMediaHeight] = useState<number | null>(null);

  useEffect(() => {
    const textEl = mobileTextRef.current;
    if (!textEl) return;

    const recalc = () => {
      const headerH = document.getElementById("mini-navbar")?.getBoundingClientRect().height ?? 60;
      const textH = textEl.getBoundingClientRect().height;
      setMobileMediaHeight(window.innerHeight - textH - headerH * 2);
    };

    recalc();
    const resizeObserver = new ResizeObserver(recalc);
    resizeObserver.observe(textEl);
    window.addEventListener("resize", recalc);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, []);

  // État initial (avant tout scroll) : vidéo large en lecture, étroite en pause
  // — sur les 2 jeux de vidéos (desktop + mobile), synchronisés ensemble.
  useEffect(() => {
    wideVideoRef.current?.play();
    narrowVideoRef.current?.pause();
    mobileWideVideoRef.current?.play();
    mobileNarrowVideoRef.current?.pause();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveSlide(v > 0.5 ? 1 : 0);

    // Entrée dans la zone sticky (peu importe la direction) → reset à l'état
    // initial. onLeave n'a volontairement aucune contrepartie ici : sortir
    // du bloc (v revient à 0 ou 1) ne déclenche rien sur les vidéos.
    if (v > 0 && v < 1) {
      if (!enteredRef.current) {
        enteredRef.current = true;
        wideVideoRef.current?.play();
        narrowVideoRef.current?.pause();
        mobileWideVideoRef.current?.play();
        mobileNarrowVideoRef.current?.pause();
        if (mobileTransitionTimeoutRef.current) clearTimeout(mobileTransitionTimeoutRef.current);
        setItem1Hidden(false);
        setItem2Visible(false);
      }
    } else {
      enteredRef.current = false;
    }

    // Franchissement du seuil des 50%, une seule fois par passage.
    if (v > 0.5 && !isAboveThresholdRef.current) {
      isAboveThresholdRef.current = true;
      wideVideoRef.current?.pause();
      narrowVideoRef.current?.play();

      // Slider mobile : sortie de l'item 1 immédiate, entrée de l'item 2
      // décalée de 300ms — effet de croisement (l'un s'efface avant que
      // l'autre n'apparaisse), plutôt qu'un simple fondu croisé simultané.
      if (mobileTransitionTimeoutRef.current) clearTimeout(mobileTransitionTimeoutRef.current);
      setItem1Hidden(true);
      mobileTransitionTimeoutRef.current = setTimeout(() => {
        setItem2Visible(true);
        mobileNarrowVideoRef.current?.play();
      }, 300);
      mobileWideVideoRef.current?.pause();
    } else if (v <= 0.5 && isAboveThresholdRef.current) {
      isAboveThresholdRef.current = false;
      wideVideoRef.current?.play();
      narrowVideoRef.current?.pause();

      if (mobileTransitionTimeoutRef.current) clearTimeout(mobileTransitionTimeoutRef.current);
      setItem2Visible(false);
      mobileTransitionTimeoutRef.current = setTimeout(() => {
        setItem1Hidden(false);
        mobileWideVideoRef.current?.play();
      }, 300);
      mobileNarrowVideoRef.current?.pause();
    }
  });

  return (
    <section className="bg-cream relative">
      {/* Bloc de 3x la hauteur du viewport : distance de scroll disponible
          pour l'effet (cf. explication donnée en conversation). */}
      <div ref={wrapperRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Duo de photos — desktop uniquement, calque indépendant de la grille
              ci-dessous (pas affecté par about-sticky-padding/section-title-pl) :
              positionné en vw directement par rapport à l'écran, comme demandé
              (3.5vw du bord droit, bloc centré verticalement). */}
          <div
            className="hidden min-[835px]:block absolute top-1/2 -translate-y-1/2"
            style={{ right: "3.5vw", width: "40vw", height: "42.5vw" }}
          >
            {/* Top-droite — video 1 (grande au repos, petite après le seuil) */}
            <motion.div
              className="absolute top-0 right-0 overflow-hidden"
              style={{ width: topWidth, height: topHeight }}
            >
              <video
                ref={wideVideoRef}
                src="/videos/video 1.mp4"
                poster={VIDEO_1_POSTER}
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
            {/* Bas-gauche — video 2 (petite au repos, grande après le seuil) : le
                coin bas-gauche de la photo du haut touche le coin haut-droit de
                celle-ci — top/right recalent directement sur topHeight/topWidth,
                jamais de valeur séparée à resynchroniser. */}
            <motion.div
              className="absolute overflow-hidden"
              style={{ width: bottomWidth, height: bottomHeight, top: topHeight, right: topWidth }}
            >
              <video
                ref={narrowVideoRef}
                src="/videos/video 2.mp4"
                poster={VIDEO_2_POSTER}
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
          </div>

          <div className="h-full flex items-center about-sticky-padding section-title-pl">
          <div className="w-full grid grid-cols-1 min-[835px]:grid-cols-[2px_44.8125fr_55.1875fr] gap-[40px] min-[835px]:gap-0 items-center">
            {/* Colonne 1 — barre de progression verticale (desktop uniquement) */}
            <div className="hidden min-[835px]:block relative w-px h-[280px] bg-charcoal/15 self-center">
              <motion.div
                className="absolute top-0 left-0 w-full bg-charcoal"
                style={{ height: barHeight }}
              />
            </div>

            {/* Colonne 2 — pill + titre (fixe) + texte (bascule à 50%) */}
            <div ref={mobileTextRef} className="flex flex-col justify-center min-[835px]:pr-[9.3125vw] min-[835px]:ml-[55px]">
              <Pill className="mb-4 self-start">NOTRE STUDIO</Pill>
              {/* Taille du titre provisoire (reprise de l'ancienne AboutHistory) —
                  en attente des valeurs desktop/tablette/mobile.
                  Révélation mot par mot (masque + glissement depuis le bas), rejouée
                  à chaque franchissement du seuil des 50% — même déclencheur
                  (activeSlide) que la bascule du paragraphe juste en dessous, donc
                  les 2 animations se déclenchent strictement en même temps. */}
              <h2
                className="font-semibold tracking-tight uppercase text-charcoal text-[clamp(26px,6.7532vw_+_0.6753px,52px)] min-[835px]:text-[58px] whitespace-nowrap mb-[2.5rem]"
                style={{ lineHeight: "1.05" }}
              >
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    key={`imaginer-${activeSlide}`}
                    className="inline-block whitespace-nowrap"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: TITLE_EASE, delay: 0 * 0.08 }}
                  >
                    Imaginer&nbsp;
                  </motion.span>
                </span>
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    key={`les-${activeSlide}`}
                    className="inline-block whitespace-nowrap"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: TITLE_EASE, delay: 1 * 0.08 }}
                  >
                    les
                  </motion.span>
                </span>
                <br />
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    key={`espaces-${activeSlide}`}
                    className="inline-block whitespace-nowrap"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: TITLE_EASE, delay: 2 * 0.08 }}
                  >
                    {" "}espaces&nbsp;
                  </motion.span>
                </span>
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    key={`de-${activeSlide}`}
                    className="inline-block whitespace-nowrap"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: TITLE_EASE, delay: 3 * 0.08 }}
                  >
                    de&nbsp;
                  </motion.span>
                </span>
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    key={`vie-${activeSlide}`}
                    className="inline-block whitespace-nowrap"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: TITLE_EASE, delay: 4 * 0.08 }}
                  >
                    vie
                  </motion.span>
                </span>
              </h2>
              <div className="relative min-h-[140px] min-[835px]:min-h-[100px]">
                <motion.p
                  className="texte text-charcoal absolute inset-0"
                  animate={
                    activeSlide === 0
                      ? { opacity: 1, y: 0, scale: 1, skewX: 0 }
                      : { opacity: 0, y: -24, scale: 0.95, skewX: -10 }
                  }
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {SLIDE_1_TEXT}
                </motion.p>
                <motion.p
                  className="texte text-charcoal absolute inset-0"
                  animate={
                    activeSlide === 1
                      ? { opacity: 1, y: 0, scale: 1, skewX: 0 }
                      : { opacity: 0, y: 24, scale: 0.95, skewX: 10 }
                  }
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {SLIDE_2_TEXT}
                </motion.p>
              </div>
            </div>

            {/* Colonne 3 — vide : réservée uniquement pour garder les mêmes
                proportions de grille (et donc la même largeur/hauteur de ligne
                pour les colonnes 1 et 2) qu'avant. Les photos elles-mêmes vivent
                maintenant dans le calque indépendant tout en haut du fichier. */}
            <div className="hidden min-[835px]:block min-[835px]:h-[500px]" aria-hidden="true" />

            {/* Slider mobile — remplace la grille en quinconce ci-dessus sous 835px :
                2 vidéos superposées en absolute, crossfade + léger zoom (scale 1→1.2)
                au lieu du morphing par colonnes. Même seuil des 50% que le texte et
                les vidéos desktop (item1Hidden / item2Visible, avec la même
                temporisation d'entrée +300ms, cf. useMotionValueEvent plus haut).
                Hauteur calculée dynamiquement (mobileMediaHeight) plutôt que fixe. */}
            <div
              className="order-first relative overflow-hidden mt-[40px] min-[835px]:hidden min-[835px]:mt-0"
              style={{ height: mobileMediaHeight ?? 320 }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: item1Hidden ? 0 : 1,
                  transform: item1Hidden ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.6s 0.15s cubic-bezier(.34,1.56,.64,1), opacity 0.45s ease-in-out",
                }}
              >
                <video
                  ref={mobileWideVideoRef}
                  src="/videos/video 1.mp4"
                  poster={VIDEO_1_POSTER}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: item2Visible ? 1 : 0,
                  transform: item2Visible ? "scale(1)" : "scale(1.2)",
                  transition: "transform 0.6s 0.15s cubic-bezier(.34,1.56,.64,1), opacity 0.45s ease-in-out",
                }}
              >
                <video
                  ref={mobileNarrowVideoRef}
                  src="/videos/video 2.mp4"
                  poster={VIDEO_2_POSTER}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
