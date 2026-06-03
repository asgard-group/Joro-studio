"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Pill from "@/components/ui/Pill";

const CLIP_HIDDEN = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const CLIP_VISIBLE = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

// useLayoutEffect côté serveur → bascule sur useEffect pour éviter le warning SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AboutHistory() {
  // Wrapper = équivalent du "pin-spacer" GSAP : son hauteur supplémentaire crée
  // la zone de scroll pendant laquelle la section reste pinnée.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const photoRowRef = useRef<HTMLDivElement>(null);

  // Distance section.top → photoRow.bottom, mesurée dynamiquement.
  // Permet de calculer la sticky `top` pour que photos.bottom = viewport.bottom
  // au moment du pin, et ce sur TOUS les breakpoints (le contenu varie selon
  // la largeur : padding, nb de lignes du titre, aspect ratio des images).
  // Tant que la mesure n'a pas eu lieu (SSR / 1er rendu), top reste à 0.
  const [photoBottomOffset, setPhotoBottomOffset] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // Progress 0 : le haut du wrapper atteint le haut du viewport (= début du pin)
    // Progress 1 : le bas du wrapper atteint le bas du viewport (= fin du pin)
    offset: ["start start", "end end"],
  });

  // Clip-path animé sur la portion 0.25 → 1 du pin :
  //  0 → 0.25 : pair 1 reste visible (hold) le temps que le user voie bien les photos initiales
  //  0.25 → 1 : reveal animation
  const clipPath = useTransform(scrollYProgress, [0.25, 1], [CLIP_HIDDEN, CLIP_VISIBLE]);

  // Mesure photoRow.bottom relative à section.top.
  // La différence entre les 2 bounding rects est invariante au scroll/pin
  // (les éléments sont dans le même flux de positionnement interne à la section).
  useIsoLayoutEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      const photoRow = photoRowRef.current;
      if (!section || !photoRow) return;
      const sectionRect = section.getBoundingClientRect();
      const photoRect = photoRow.getBoundingClientRect();
      setPhotoBottomOffset(photoRect.bottom - sectionRect.top);
    };
    measure();

    // Recalcule à chaque changement de layout (resize, font load, image load, breakpoint).
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    if (photoRowRef.current) ro.observe(photoRowRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Sticky top = viewport.height - offset(section.top → photoRow.bottom).
  // Si offset > vh, top est négatif : le haut de la section scrolle hors-écran,
  // mais photo.bottom reste collée au bas du viewport — comportement souhaité.
  const stickyTop =
    photoBottomOffset == null ? "0px" : `calc(100vh - ${photoBottomOffset}px)`;

  return (
    // Pin-spacer : wrapper avec hauteur étendue pour donner du scroll au pin
    <div ref={wrapperRef} className="relative" style={{ height: "250vh" }}>
      <section
        ref={sectionRef}
        className="sticky pt-[80px] min-[1020px]:pt-[200px] bg-cream overflow-hidden"
        style={{ top: stickyTop }}
      >
        {/* ROW TEXTES */}
        <div className="flex flex-col gap-[50px] min-[1020px]:flex-row min-[1020px]:gap-[30px]">
          {/* Texte gauche : pill + titre — container max 749px ≤1920px, 1129px au-dessus */}
          <div
            className="flex-1 min-[1440px]:flex-[1129_1_0%] min-[1020px]:max-w-[749px] min-[1921px]:max-w-[1129px] flex flex-col gap-[10px] pl-[20px] min-[840px]:pl-[40px] min-[1440px]:pl-[60px]"
          >
            <Pill className="self-start">NOTRE HISTOIRE</Pill>
            <h2
              className="font-semibold tracking-tight uppercase text-[36px] min-[1020px]:text-[64px] text-charcoal"
              style={{ lineHeight: "130%" }}
            >
              Une réflexion <br className="hidden min-[1020px]:inline min-[1601px]:hidden" />architecturale
            </h2>
          </div>
          {/* Texte droite : description */}
          <div className="flex-1 min-[1440px]:flex-[761_1_0%] min-[1440px]:min-w-[660px] min-[1020px]:pt-[36px] px-[20px] min-[840px]:px-[40px] min-[1020px]:pl-0 min-[1020px]:pr-[40px] min-[1440px]:pr-[60px]">
            <p
              className="font-medium text-[14px] leading-[24px] min-[1020px]:text-[16px] min-[1020px]:leading-[26px] text-charcoal"
            >
              Notre studio est né d&rsquo;un constat simple : il est aujourd&rsquo;hui difficile de concevoir des espaces qui allient innovation, élégance et respect de l&rsquo;environnement. Pour répondre à ce défi, nous avons créé JORO Studio, une approche nouvelle de l&rsquo;architecture et des travaux où chaque projet est pensé dans les moindres détails afin de conjuguer qualité haut de gamme, design contemporain et responsabilité écologique.
            </p>
          </div>
        </div>

        {/* ROW IMAGES — chaque côté a 2 images superposées, la 2ème se révèle via clip-path.
            Ref `photoRowRef` : sa position .bottom sert à caler la sticky top dynamique. */}
        <div
          ref={photoRowRef}
          className="mt-[50px] min-[1020px]:mt-[100px] flex flex-col gap-[30px] min-[1020px]:flex-row min-[1020px]:items-stretch"
        >
          {/* Côté gauche : superposition (anciennement à droite) — max-w 749 ≤1920, 1129 au-dessus (matche le texte gauche) */}
          <div className="flex-1 min-[1440px]:flex-[1129_1_0%] min-[1020px]:max-w-[749px] min-[1921px]:max-w-[1129px] relative aspect-[1020/560] min-[1020px]:aspect-auto min-[1020px]:h-[370px] min-[1440px]:h-auto min-[1440px]:aspect-[1129/592] overflow-hidden">
            {/* Image du dessous — visible dès le départ */}
            <Image
              src="/images/f11417fe33c2cc32ef0ecc7b3c1c059e.jpg"
              alt="JÖRO Studio — espace lounge"
              fill
              className="object-cover"
              sizes="(max-width: 1020px) 100vw, (max-width: 1440px) 50vw, 60vw"
            />
            {/* Image du dessus — révélée via clip-path animé au scroll */}
            <motion.div className="absolute inset-0" style={{ clipPath }}>
              <Image
                src="/images/DSC01645-HDR.jpg"
                alt="Salle de réunion — chaises orange"
                fill
                className="object-cover"
                sizes="(max-width: 1020px) 100vw, (max-width: 1440px) 50vw, 60vw"
              />
            </motion.div>
          </div>

          {/* Côté droit : superposition — caché sous 1020 (anciennement à gauche) */}
          <div className="max-[1019px]:hidden flex-1 min-[1440px]:flex-[761_1_0%] min-[1440px]:min-w-[660px] relative aspect-[761/592] min-[1020px]:aspect-auto overflow-hidden">
            {/* Image du dessous */}
            <Image
              src="/images/1.png"
              alt="JÖRO Office — salle de réunion taupe"
              fill
              className="object-cover"
              sizes="(max-width: 1440px) 50vw, 40vw"
            />
            {/* Image du dessus — révélée via clip-path animé au scroll */}
            <motion.div className="absolute inset-0" style={{ clipPath }}>
              <Image
                src="/images/Retines-Asgard-Banque-_23A2171-web.jpg"
                alt="CoinShares — espace lounge"
                fill
                className="object-cover"
                sizes="(max-width: 1440px) 50vw, 40vw"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
