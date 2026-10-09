"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";

// Transition entre les services (AMO → Marketing Suite → Conseil) : une seule vue collée en haut
// (sticky) où chaque service se dévoile par le bas (clip-path) par-dessus le précédent, avec un
// léger parallaxe de l'image. Reprise de la maquette « Atelier Vauclair — Projets plein écran ».
//
// Géométrie : le conteneur démarre 200vh avant la fin de ServicesAll (là où AMO commençait à
// entrer) et dure 500vh = 1 écran par dévoilement (AMO, Marketing, Conseil) + 1 écran de pause
// sur le dernier. La vue est collée dès le début du conteneur ; avant son début, tous les
// panneaux sont entièrement rognés (rien n'est visible).

const SCREENS = 4; // écrans de défilement pendant que la vue est collée (500vh − 100vh)

// Une vidéo n'est lue que si son panneau est à l'écran : visible (ou sur le point de l'être) et pas encore
// entièrement recouvert par le suivant. Évite de décoder 3 vidéos 1080p en même temps pendant le scroll.
function usePanelPlaying(progress: MotionValue<number>, index: number, last: boolean, stageVisible: boolean) {
  const inRange = (p: number) => {
    const s = p * SCREENS;
    return s > index - 0.3 && (last || s < index + 1.05);
  };
  const [range, setRange] = useState(false);
  useEffect(() => setRange(inRange(progress.get())), []); // eslint-disable-line react-hooks/exhaustive-deps
  useMotionValueEvent(progress, "change", (p) => {
    const next = inRange(p);
    setRange((cur) => (cur === next ? cur : next));
  });
  return stageVisible && range;
}

function Panel({ index, last, progress, parallax, stageVisible, children }: { index: number; last: boolean; progress: MotionValue<number>; parallax: boolean; stageVisible: boolean; children: ReactNode }) {
  const play = usePanelPlaying(progress, index, last, stageVisible);
  // s = nombre d'écrans défilés depuis le début de la scène (0 → SCREENS)
  const clipPath = useTransform(progress, (p) => {
    const reveal = Math.min(1, Math.max(0, p * SCREENS - index));
    return `inset(${(1 - reveal) * 100}% 0 0 0)`;
  });
  // Parallaxe : l'image entre décalée vers le bas, puis remonte quand le suivant la recouvre.
  // En % de la hauteur du fond (124 % de l'écran, marges de 12 %) : reste dans les marges.
  const bgY = useTransform(progress, (p) => {
    if (!parallax) return "0%"; // pas de parallaxe en mobile (< 768px)
    const s = p * SCREENS;
    const reveal = Math.min(1, Math.max(0, s - index));
    const cover = Math.min(1, Math.max(0, s - index - 1));
    return `${(1 - reveal) * 9 - cover * 6}%`;
  });
  const child = isValidElement(children) ? cloneElement(children as ReactElement<{ bgY?: MotionValue<string>; play?: boolean }>, { bgY, play }) : children;
  return (
    <motion.div className="absolute inset-0 bg-[#111]" style={{ clipPath, zIndex: index + 1 }}>
      {child}
    </motion.div>
  );
}

export default function ServiceStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const items = Children.toArray(children);
  const parallax = useIsDesktop(768);
  const [stageVisible, setStageVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStageVisible(e.isIntersecting), { rootMargin: "50% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-[500vh] -mt-[200vh]">
      {/* Ancres (les menus des services y font défiler) : au moment où le service est entièrement dévoilé. */}
      <div id="amo" style={{ position: "absolute", top: "100vh" }} />
      <div id="marketing-suite" style={{ position: "absolute", top: "200vh" }} />
      <div id="conseil-workplace" style={{ position: "absolute", top: "300vh" }} />

      <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 40 }}>
        {items.map((child, i) => (
          <Panel key={i} index={i} last={i === items.length - 1} progress={scrollYProgress} parallax={parallax} stageVisible={stageVisible}>
            {child}
          </Panel>
        ))}
      </div>
    </div>
  );
}
