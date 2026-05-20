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

function ServiceCardItem({
  offer,
  zIndex,
  pixelOffset,
  fadeIn = false,
}: {
  offer: (typeof offers)[0];
  zIndex: number;
  pixelOffset: number;
  fadeIn?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [scrollRange, setScrollRange] = useState<[number, number]>([99999, 199999]);
  const [fadeRange, setFadeRange] = useState<[number, number]>([99999, 109999]);
  const { scrollY } = useScroll();

  useEffect(() => {
    const calc = () => {
      if (!ref.current) return;
      const top = ref.current.offsetTop;
      const vh = window.innerHeight;
      setScrollRange([top, top + vh]);
      setFadeRange([top, top + vh * 0.6]);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const yRange: [string, string] = ["0px", `${-pixelOffset}px`];
  const contentY = useTransform(scrollY, scrollRange, yRange);
  const descY    = useTransform(scrollY, scrollRange, yRange);
  const sectionOpacity = useTransform(scrollY, fadeRange, fadeIn ? [0, 1] : [1, 1]);

  return (
    <motion.section
      ref={ref}
      data-navbar-theme="dark"
      className="sticky top-0 h-screen overflow-hidden"
      style={{ zIndex, opacity: sectionOpacity }}
    >
      {/* Image de fond */}
      <Image
        src={offer.image}
        alt={offer.name}
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-[#1C2626]/55" />

      {/* Titre + bouton — centré, remonte jusqu'en haut au scroll */}
      <div className="absolute inset-0 z-10 flex items-center">
        <motion.div
          style={{ y: contentY }}
          className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
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
        </motion.div>
      </div>

      {/* Description — ancrée en bas à droite, remonte au scroll */}
      <motion.div
        style={{ y: descY }}
        className="absolute bottom-0 inset-x-0 z-10 pb-[100px]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <p className="max-w-[348px] text-[16px] font-normal leading-relaxed text-[#F3F2ED]">
            {offer.description}
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default function ServiceCards() {
  const [pixelOffset, setPixelOffset] = useState(400);

  useEffect(() => {
    const calc = () => setPixelOffset(window.innerHeight * 0.42);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <>
      {offers.map((offer, i) => (
        <ServiceCardItem
          key={offer.id}
          offer={offer}
          zIndex={(i + 1) * 10}
          pixelOffset={pixelOffset}
          fadeIn={i === 0}
        />
      ))}
    </>
  );
}
