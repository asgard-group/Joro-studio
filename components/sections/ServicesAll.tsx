"use client";

import { useRef, useState, useEffect } from "react";
import ServiceBottom from "@/components/sections/ServiceBottom";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";

// false = pas de split screen (l'intro fond directement sur DESIGN & BUILD).
const SPLIT_ENABLED = true;

// ─── ServicesAll ─────────────────────────────────────────────────
export default function ServicesAll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  // Taille du rectangle de départ de l'intro (plus petit en mobile).
  const isDesktop = useIsDesktop();

  const [ranges, setRanges] = useState({
    expandStart: 99999, expandEnd: 109999,
    // Début du fondu du titre = déclencheur de la séquence automatique (fondu +
    // zoom + split), qui se joue ensuite toute seule.
    fadeOutStart: 119999,
    fadeOffAt: 119999,
  });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      // getBoundingClientRect + scrollY plutôt que offsetTop : indépendant de
      // l'offsetParent et recalculé après le chargement des médias, sinon les
      // seuils se décalent quand la mise en page bouge encore.
      const top = containerRef.current.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      setRanges({
        // Le rectangle charcoal s'agrandit jusqu'à remplir l'écran
        expandStart: top + vh * 0.05,
        expandEnd: top + vh * 0.6,
        // Déclenche la séquence automatique (fondu + zoom + split)
        fadeOutStart: top + vh * 0.62,
        // Seuil de retour (hystérésis) : un peu plus haut, pour que la séquence ne
        // oscille pas si on s'arrête pile autour du seuil de déclenchement
        fadeOffAt: top + vh * 0.5,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("load", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("load", calc);
    };
  }, []);

  // Vidéo lue seulement quand la section est à l'écran (pas de décodage inutile pendant le reste du scroll).
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Rectangle charcoal → plein écran, piloté par le scroll. Le clip-path découpe
  // la couche sombre (fond charcoal + texte cream) : valeurs de départ = taille
  // du rectangle de la maquette (≈346×620 sur 1920×970 en desktop).
  const expand = useTransform(scrollY, [ranges.expandStart, ranges.expandEnd], [0, 1]);
  const clipFrom = isDesktop
    ? "inset(15.3% 41% 20.8% 41% round 24px)"
    : "inset(27% 24% 27% 24% round 16px)";
  const clipPath = useTransform(expand, [0, 1], [clipFrom, "inset(0% 0% 0% 0% round 0px)"]);

  // Séquence automatique : dès que le scroll atteint le début du fondu du titre
  // (fadeOutStart), le fondu, le zoom et le split se jouent ensemble, tout seuls
  // (animation temporelle, indépendante de la vitesse de scroll). Si on remonte
  // au-dessus du seuil, la séquence se rejoue à l'envers.
  const sequence = useMotionValue(0);
  const [sequenceOn, setSequenceOn] = useState(false);
  const sequenceReady = useRef(false);
  const sequenceBusy = useRef(false);
  const prevBodyOverflow = useRef<string | null>(null);
  const rangesRef = useRef(ranges);
  rangesRef.current = ranges;
  // Gel du scroll pendant la séquence : `overflow: hidden` sur le body fige la page
  // d'un bloc, inertie de la molette/trackpad comprise. (Avant, on ramenait la page à sa
  // position à chaque événement de scroll : l'inertie continuait en dessous et la page
  // faisait un bond au déblocage.) Même mécanisme que le menu plein écran (Header.tsx).
  const lockScroll = () => {
    if (prevBodyOverflow.current === null) {
      prevBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
  };
  const unlockScroll = () => {
    if (prevBodyOverflow.current !== null) {
      document.body.style.overflow = prevBodyOverflow.current;
      prevBodyOverflow.current = null;
    }
  };
  // Hystérésis : déclenche au-dessus de fadeOutStart, ne rejoue à l'envers qu'en
  // dessous de fadeOffAt. Tant que la séquence joue (dans un sens comme dans
  // l'autre), le scroll est ignoré : elle va jusqu'au bout, puis on se recale sur
  // la position réelle (cf. onComplete ci-dessous).
  const syncSequence = () => {
    const y = scrollY.get();
    const r = rangesRef.current;
    if (y >= r.fadeOutStart) setSequenceOn(true);
    else if (y < r.fadeOffAt) setSequenceOn(false);
  };
  useMotionValueEvent(scrollY, "change", () => {
    if (!sequenceBusy.current) syncSequence();
  });
  // Seuils (re)calculés : on se cale sur la position réelle (rechargement ou saut
  // d'ancre plus bas dans la section → état final direct, sans rejouer la séquence).
  useEffect(() => {
    if (ranges.fadeOutStart < 119999) {
      const on = scrollY.get() >= ranges.fadeOutStart;
      setSequenceOn(on);
      if (!sequenceReady.current) {
        sequence.set(on ? 1 : 0);
        sequenceReady.current = true;
      }
    }
  }, [ranges.fadeOutStart, scrollY, sequence]);
  useEffect(() => {
    const target = sequenceOn ? 1 : 0;
    // Déjà dans l'état voulu (chargement de la page, recalage) : rien à jouer, rien à verrouiller.
    if (Math.abs(sequence.get() - target) < 0.001) {
      sequenceBusy.current = false;
      return;
    }
    // Scroll très rapide : si la page est déjà loin au-delà du seuil quand la
    // séquence démarre (inertie, molette lancée), on ne verrouille pas en plein
    // milieu de nulle part — on saute directement à l'état final, sans animation.
    const y = scrollY.get();
    const vh = window.innerHeight;
    const { fadeOutStart: onAt, fadeOffAt: offAt } = rangesRef.current;
    const tooFar = sequenceOn ? y - onAt > vh * 0.5 : offAt - y > vh * 0.5;
    if (tooFar) {
      sequence.set(target);
      sequenceBusy.current = false;
      return;
    }
    sequenceBusy.current = true;
    // La page est figée là où elle se trouve (si le scroll a déjà trop dépassé le
    // seuil, on la ramène au plus à 0,3 vh de celui-ci, avant de la figer).
    const lockedY = sequenceOn ? Math.min(y, onAt + vh * 0.3) : Math.max(y, offAt - vh * 0.3);
    if (Math.abs(y - lockedY) > 1) window.scrollTo({ top: lockedY, behavior: "instant" });
    lockScroll();
    const controls = animate(sequence, target, {
      duration: 0.9,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => {
        sequenceBusy.current = false;
        unlockScroll();
        syncSequence();
      },
    });
    return () => {
      controls.stop();
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- syncSequence lit des refs/valeurs stables
  }, [sequenceOn, sequence, scrollY]);

  // Pas de scroll tant que la séquence joue : molette, tactile et touches de
  // navigation sont bloquées (non passifs pour pouvoir faire preventDefault).
  useEffect(() => {
    const block = (e: Event) => {
      if (sequenceBusy.current) e.preventDefault();
    };
    const blockKey = (e: KeyboardEvent) => {
      if (!sequenceBusy.current) return;
      if ([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKey);
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKey);
    };
  }, []);

  // Fondu du titre (première moitié de la séquence)
  const contentOpacity = useTransform(sequence, [0, 0.5], [1, 0]);

  // Zoom avant sur le titre : démarre avec l'agrandissement du rectangle charcoal
  // (piloté par le scroll), puis se poursuit avec la séquence.
  const scrollZoom = useTransform(scrollY, [ranges.expandStart, ranges.fadeOutStart], [1, 1.12]);
  const titleScale = useTransform([scrollZoom, sequence], ([z, q]) => (z as number) + 0.13 * (q as number));

  // Masque de l'intro pendant le split : seule la partie encore recouverte par les
  // panneaux reste visible (leurs bords internes sont à 50 % ∓ progress × 50 %),
  // le titre est donc « croppé » par les panneaux et ne passe jamais sur la vidéo.
  const splitProgress = sequence;
  const introMask = useTransform(splitProgress, (v) => {
    const a = 50 - v * 50;
    const b = 50 + v * 50;
    return `linear-gradient(to right, #000 0%, #000 ${a}%, transparent ${a}%, transparent ${b}%, #000 ${b}%, #000 100%)`;
  });

  // Split des panneaux
  const leftX = useTransform(splitProgress, (v) => `${-v * 100}%`);
  const rightX = useTransform(splitProgress, (v) => `${v * 100}%`);

  return (
    // 380vh : la séquence d'intro se joue toute seule dès 0,62 vh et DESIGN & BUILD est
    // révélé vers 0,8 vh. Le bloc AMO (page.tsx, -mt-[100vh]) recouvre cette section à
    // partir de (hauteur − 200vh) de scroll : à 380vh, c'est 1,8 vh, soit ~1 vh de lecture
    // pour DESIGN & BUILD avant l'arrivée d'AMO. (À 280vh, AMO arrivait dès 0,8 vh et
    // recouvrait DESIGN & BUILD avant même qu'on puisse le lire.)
    // Même enchaînement à toutes les tailles d'écran (plus de carrousel en mobile).
    <div ref={containerRef} className="relative" style={{ height: "380vh" }}>
      <div id="design-build" style={{ position: "absolute", top: "calc(1 * 100vh)" }} />
      <div
        data-navbar-theme="dark"
        className="sticky top-0 h-screen overflow-hidden bg-charcoal"
        style={{ zIndex: 35 }}
      >
        {/* Vidéo + split Design & Build */}
        <div className="contents">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
            src="/videos/vecteezy_unrecognizable-female-carpenter-or-furniture-designer_71265347.webm"
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 z-0" style={{ backgroundColor: "rgba(35, 6, 6, 0.2)", mixBlendMode: "soft-light" }} />

          {/* Contenu DESIGN & BUILD — révélé par le split (z-5) */}
          <ServiceBottom
            activeId="design-build"
            title="Design & Build"
            description="Chaque espace est pensé dans ses moindres détails pour conjuguer esthétique et performance durable. Une vision cohérente, du premier trait jusqu'à la remise des clés."
            ctaLabel="Lancer un projet"
            zClass="z-[5]"
          />
        </div>

        {/* Panneaux charcoal (toujours opaques) — glissent au split (z-20), sur toutes tailles
            d'écran. `will-change: transform` force la promotion en couche composite : sans lui,
            ces deux grands aplats sont repeints à chaque frame du scroll. */}
        {SPLIT_ENABLED && (
          <>
            <motion.div
              className="absolute top-0 left-0 h-full bg-charcoal z-20"
              style={{ width: "50%", x: leftX, willChange: "transform" }}
            />
            <motion.div
              className="absolute top-0 right-0 h-full bg-charcoal z-20"
              style={{ width: "50%", x: rightX, willChange: "transform" }}
            />
          </>
        )}

        {/* Intro (charcoal + texte cream) — fade out global (z-30) */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ opacity: contentOpacity, maskImage: introMask, WebkitMaskImage: introMask }}
        >
          <IntroSlide clipPath={clipPath} titleScale={titleScale} />
        </motion.div>
      </div>
      {/*
        Marqueur "light" pour la navbar pendant la phase crème (intro en cours d'agrandissement).
        Placé après le sticky div → il override "dark" quand les deux sont sous la navbar.
        Height = expandEnd = 60vh : une fois scrollé au-delà, seul "dark" s'applique.
      */}
      <div
        data-navbar-theme="light"
        aria-hidden
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ height: "60vh" }}
      />
    </div>
  );
}

// ─── IntroSlide ──────────────────────────────────────────────────
// Deux couches superposées avec le même titre : beige + texte charcoal en
// dessous ; charcoal + texte cream au-dessus, découpée par le clip-path (le
// rectangle qui grandit). Là où le rectangle recouvre le texte, celui-ci est donc
// cream ; une fois le rectangle plein écran, tout est charcoal / cream.
function IntroTitle({ className, scale }: { className: string; scale: MotionValue<number> }) {
  return (
    <motion.div style={{ scale }} className="absolute inset-0 flex items-center justify-center text-center px-6">
      <h2 className={`font-medium tracking-[-0.02em] leading-[1.15] text-[8.2vw] min-[768px]:text-[6vw] ${className}`}>
        Quatre expertises,
        <br />
        un seul interlocuteur
      </h2>
    </motion.div>
  );
}

function IntroSlide({ clipPath, titleScale }: { clipPath: MotionValue<string>; titleScale: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 bg-cream">
      <IntroTitle className="text-charcoal" scale={titleScale} />
      <motion.div className="absolute inset-0 bg-charcoal" style={{ clipPath }}>
        <IntroTitle className="text-cream" scale={titleScale} />
      </motion.div>
    </div>
  );
}
