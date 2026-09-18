"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Pill from "@/components/ui/Pill";

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
  // Les 2 colonnes de la grille échangent leurs largeurs en continu (effet de
  // redistribution progressive, sans seuil) — cf. col1/col2 de la référence.
  const col1Width = useTransform(scrollYProgress, [0, 1], ["27%", "73%"]);
  const col2Width = useTransform(scrollYProgress, [0, 1], ["73%", "27%"]);
  // Même logique en miroir sur la hauteur des rows (firstRow/lastRow de la
  // référence) — sur le même scrollYProgress que les colonnes, donc même
  // trigger/scrub, automatiquement synchronisé. La 1re row de chaque colonne
  // (haute au repos, 64%) rétrécit vers la hauteur "basse" (36%) ; la 2e row
  // (basse au repos, 36%) grandit vers la hauteur "haute" (64%).
  const firstRowHeight = useTransform(scrollYProgress, [0, 1], ["64%", "36%"]);
  const lastRowHeight = useTransform(scrollYProgress, [0, 1], ["36%", "64%"]);

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

  // État initial (avant tout scroll) : vidéo large en lecture, étroite en pause.
  useEffect(() => {
    wideVideoRef.current?.play();
    narrowVideoRef.current?.pause();
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
      }
    } else {
      enteredRef.current = false;
    }

    // Franchissement du seuil des 50%, une seule fois par passage.
    if (v > 0.5 && !isAboveThresholdRef.current) {
      isAboveThresholdRef.current = true;
      wideVideoRef.current?.pause();
      narrowVideoRef.current?.play();
    } else if (v <= 0.5 && isAboveThresholdRef.current) {
      isAboveThresholdRef.current = false;
      wideVideoRef.current?.play();
      narrowVideoRef.current?.pause();
    }
  });

  return (
    <section className="bg-cream relative">
      {/* Bloc de 3x la hauteur du viewport : distance de scroll disponible
          pour l'effet (cf. explication donnée en conversation). */}
      <div ref={wrapperRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center about-sticky-padding">
          <div className="w-full grid grid-cols-1 min-[835px]:grid-cols-[2px_1fr_auto] gap-0 items-center">
            {/* Colonne 1 — barre de progression verticale (desktop uniquement) */}
            <div className="hidden min-[835px]:block relative w-px h-[280px] bg-charcoal/15 self-center">
              <motion.div
                className="absolute top-0 left-0 w-full bg-charcoal"
                style={{ height: barHeight }}
              />
            </div>

            {/* Colonne 2 — pill + titre (fixe) + texte (bascule à 50%) */}
            <div className="flex flex-col justify-center min-[835px]:pr-[9.3125vw] min-[835px]:ml-[55px]">
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

            {/* Colonne 3 — grille d'images, largeurs qui morphent en continu */}
            <div className="flex h-[320px] min-[835px]:h-[500px] min-[835px]:w-[55.1875vw]">
              {/* Colonne étroite — espace vide en haut (firstRow), image en bas (lastRow) */}
              <motion.div
                className="relative h-full flex flex-col overflow-hidden"
                style={{ width: col1Width }}
              >
                <motion.div style={{ height: firstRowHeight }} />
                <motion.div className="relative" style={{ height: lastRowHeight }}>
                  <video
                    ref={narrowVideoRef}
                    src="/videos/video 2.mp4"
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </motion.div>
              </motion.div>
              {/* Colonne large — image en haut (firstRow), espace vide en bas (lastRow) :
                  décalage en quinconce avec la colonne étroite ci-dessus. */}
              <motion.div
                className="relative h-full flex flex-col overflow-hidden"
                style={{ width: col2Width }}
              >
                <motion.div className="relative" style={{ height: firstRowHeight }}>
                  <video
                    ref={wideVideoRef}
                    src="/videos/video 1.mp4"
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </motion.div>
                <motion.div style={{ height: lastRowHeight }} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
