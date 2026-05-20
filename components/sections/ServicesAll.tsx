"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const offers = [
  {
    id: "design-build",
    name: "DESIGN & BUILD",
    image: "/images/design & build.png",
    href: "/services#design-build",
    description:
      "Nous transformons les espaces en lieux de vie authentiques, conjuguant qualité haut de gamme, design contemporain et responsabilité écologique.",
  },
  {
    id: "amo",
    name: "AMO",
    image: "/images/AMO.png",
    href: "/services#amo",
    description:
      "Assistance à maîtrise d'ouvrage : nous vous accompagnons à chaque étape de votre projet, de la définition du programme jusqu'à la livraison.",
  },
  {
    id: "marketing-suite",
    name: "MARKETING SUITE",
    image: "/images/marketing suite.png",
    href: "/services#marketing-suite",
    description:
      "Des espaces de démonstration et de commercialisation pensés pour valoriser vos actifs immobiliers et séduire vos futurs acquéreurs.",
  },
  {
    id: "conseil-workplace",
    name: "CONSEIL WORKPLACE\n& STRATÉGIE IMMOBILIÈRE",
    image: "/images/conseil & stratégie.png",
    href: "/services#conseil-workplace",
    description:
      "Nous vous aidons à définir votre stratégie immobilière, optimiser vos espaces de travail et anticiper les nouveaux usages urbains.",
  },
];

// Carte avec fondu (uniquement DESIGN & BUILD)
function FadeInCard({ offer, zIndex, containerTop }: { offer: (typeof offers)[0]; zIndex: number; containerTop: number }) {
  const ref = useRef<HTMLElement>(null);
  const [fadeRange, setFadeRange] = useState<[number, number]>([99999, 109999]);
  const [scaleRange, setScaleRange] = useState<[number, number]>([99999, 109999]);
  const { scrollY } = useScroll();

  useEffect(() => {
    const calc = () => {
      if (!ref.current) return;
      const absoluteTop = containerTop + ref.current.offsetTop;
      const vh = window.innerHeight;
      setFadeRange([absoluteTop, absoluteTop + vh * 0.6]);
      setScaleRange([absoluteTop, absoluteTop + vh * 1.5]);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [containerTop]);

  const opacity = useTransform(scrollY, fadeRange, [0, 1]);
  const scale = useTransform(scrollY, scaleRange, [1, 1.08]);

  return (
    <motion.section
      ref={ref}
      data-navbar-theme="dark"
      className="sticky top-0 h-screen overflow-hidden"
      style={{ zIndex, opacity }}
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image src={offer.image} alt={offer.name} fill className="object-cover" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 bg-[#1C2626]/55" />

      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-[48px] md:text-[53px] lg:text-[56px] min-[1440px]:text-[64px] font-semibold uppercase leading-none tracking-tight text-[#F3F2ED] whitespace-pre-line">
              {offer.name}
            </h2>
            <Link href={offer.href} className="group flex flex-col gap-2 w-fit">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#F3F2ED]">
                Découvrir l'offre
              </span>
              <span className="block h-px bg-[#F3F2ED]/60 transition-all group-hover:bg-[#F3F2ED]" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 pb-[100px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex">
          <p className="ml-auto max-w-[260px] sm:max-w-[348px] text-[16px] font-normal leading-relaxed text-[#F3F2ED]">
            {offer.description}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

// Carte standard sticky (empilement sans animation)
function StackCard({ offer, zIndex, containerTop }: { offer: (typeof offers)[0]; zIndex: number; containerTop: number }) {
  const ref = useRef<HTMLElement>(null);
  const [scaleRange, setScaleRange] = useState<[number, number]>([99999, 109999]);
  const { scrollY } = useScroll();

  useEffect(() => {
    const calc = () => {
      if (!ref.current) return;
      const absoluteTop = containerTop + ref.current.offsetTop;
      const vh = window.innerHeight;
      // Zoom démarre dès que la carte entre en bas de l'écran
      setScaleRange([absoluteTop - vh, absoluteTop + vh * 0.5]);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [containerTop]);

  const scale = useTransform(scrollY, scaleRange, [1, 1.08]);

  return (
    <section
      ref={ref}
      data-navbar-theme="dark"
      className="sticky top-0 h-screen overflow-hidden"
      style={{ zIndex }}
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image src={offer.image} alt={offer.name} fill className="object-cover" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 bg-[#1C2626]/55" />

      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-[48px] md:text-[53px] lg:text-[56px] min-[1440px]:text-[64px] font-semibold uppercase leading-none tracking-tight text-[#F3F2ED] whitespace-pre-line">
              {offer.name}
            </h2>
            <Link href={offer.href} className="group flex flex-col gap-2 w-fit">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#F3F2ED]">
                Découvrir l'offre
              </span>
              <span className="block h-px bg-[#F3F2ED]/60 transition-all group-hover:bg-[#F3F2ED]" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 pb-[100px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex">
          <p className="ml-auto max-w-[260px] sm:max-w-[348px] text-[16px] font-normal leading-relaxed text-[#F3F2ED]">
            {offer.description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ServicesAll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [ranges, setRanges] = useState({
    yStart: 99999, yEnd: 199999,
    ctaStart: 99999, ctaEnd: 109999,
    contentFadeStart: 109999, contentFadeEnd: 149999,
  });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const top = containerRef.current.offsetTop;
      const vh = window.innerHeight;
      const introRange = vh * 2;
      setRanges({
        yStart: top,
        yEnd: top + introRange,
        ctaStart: top + introRange * 0.08,
        ctaEnd: top + introRange * 0.22,
        contentFadeStart: top + introRange * 0.25,
        contentFadeEnd: top + introRange * 0.60,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const contentY = useTransform(scrollY, [ranges.yStart, ranges.yEnd], ["0%", "-80%"]);
  const contentOpacity = useTransform(scrollY, [ranges.contentFadeStart, ranges.contentFadeEnd], [1, 0]);
  const ctaOpacity = useTransform(scrollY, [ranges.ctaStart, ranges.ctaEnd], [1, 0]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "700vh" }}>

      {/* Fond intro — reste collé derrière toutes les cartes */}
      <div
        className="sticky top-0 h-screen bg-[#1C2626] flex flex-col overflow-hidden"
        data-navbar-theme="dark"
        style={{ zIndex: 0 }}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <motion.div style={{ y: contentY, opacity: contentOpacity }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#F3F2ED]/50 mb-3 md:mb-5">
              Nos offres
            </p>
            <h2 className="text-[30px] md:text-[46px] font-semibold leading-tight text-[#F3F2ED] max-w-2xl">
              Des espaces conçus<br />avec du savoir-faire
            </h2>
          </motion.div>
        </div>
        <motion.div className="flex flex-col items-center pb-0" style={{ opacity: ctaOpacity }}>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#F3F2ED]/50">
            Glisser pour découvrir
          </span>
          <div className="h-5" />
          <div className="h-10 w-px bg-[#F3F2ED]/30" />
        </motion.div>
      </div>

      {/* DESIGN & BUILD — fade in par-dessus l'intro */}
      <FadeInCard offer={offers[0]} zIndex={10} containerTop={ranges.yStart} />

      {/* AMO, MARKETING SUITE, CONSEIL — empilement sticky classique */}
      {offers.slice(1).map((offer, i) => (
        <StackCard key={offer.id} offer={offer} zIndex={(i + 2) * 10} containerTop={ranges.yStart} />
      ))}
    </div>
  );
}
