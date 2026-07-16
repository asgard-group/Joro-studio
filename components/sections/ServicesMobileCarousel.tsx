"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

interface Slide {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  video?: string;
  image?: string;
  flipX?: boolean;
}

const slides: Slide[] = [
  {
    id: "design-build",
    title: "DESIGN & BUILD",
    description: "Chaque espace est pensé dans ses moindres détails pour conjuguer esthétique et performance durable. Une vision cohérente, du premier trait jusqu'à la remise des clés.",
    ctaLabel: "Lancer un projet",
    video: "/videos/vecteezy_unrecognizable-female-carpenter-or-furniture-designer_71265347.webm",
    flipX: true,
  },
  {
    id: "amo",
    title: "AMO",
    description: "Assistance à la maîtrise d'ouvrage : conseil en faisabilité, diagnostic RSE et accompagnement à la certification, nous vous guidons à chaque étape stratégique de votre projet.",
    ctaLabel: "Être accompagné",
    video: "/videos/Composition 1.webm",
  },
  {
    id: "marketing-suite",
    title: "MARKETING SUITE",
    description: "Des supports visuels et des espaces de présentation pensés pour valoriser vos actifs immobiliers pour que votre projet trouve son acquéreur avant même d'être livré.",
    ctaLabel: "Valoriser mon actif",
    image: "/images/test.webp",
  },
  {
    id: "conseil-workplace",
    title: "CONSEIL WORKPLACE & STRATÉGIE IMMOBILIÈRE",
    description: "Nous vous aidons à définir une stratégie immobilière alignée sur vos ambitions. Une approche conseil qui conjugue vision long terme, culture d'entreprise et exigence de qualité.",
    ctaLabel: "Affiner ma stratégie",
    video: "/videos/vecteezy_4k-animation-angled-view-of-modern-building-with-clear-blue_40552327.webm",
  },
];

export default function ServicesMobileCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      const index = Math.round(track!.scrollLeft / track!.clientWidth);
      setActiveIndex(Math.min(slides.length - 1, Math.max(0, index)));
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="md:hidden absolute inset-0">
      <div
        ref={trackRef}
        className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-full"
        style={{ scrollbarWidth: "none" }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full flex-shrink-0 snap-start h-full overflow-hidden"
          >
            {/* Fond — vidéo ou image */}
            {slide.video ? (
              <video
                className={`absolute inset-0 w-full h-full object-cover${slide.flipX ? " scale-x-[-1]" : ""}`}
                src={slide.video}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : slide.image ? (
              <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="100vw" />
            ) : null}

            {/* Filtre dégradé — transparent en haut, opaque en bas */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(28,26,24,0) 0%, rgba(28,26,24,0.85) 100%)" }}
            />

            {/* Contenu — aligné en bas à gauche */}
            <div className="absolute inset-x-0 bottom-0 px-[20px] pb-[40px]">
              <h2
                className="font-semibold uppercase leading-none tracking-tight text-cream mb-[16px]"
                style={{ fontSize: "clamp(26px, 8vw, 40px)", lineHeight: 1.1 }}
              >
                {slide.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-cream mb-[20px]">
                {slide.description}
              </p>
              <ComingSoonLink className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream border-b border-cream/50 pb-1">
                {slide.ctaLabel}
              </ComingSoonLink>
            </div>
          </div>
        ))}
      </div>

      {/* Indicateur de progression */}
      <div className="absolute bottom-[16px] inset-x-[20px] h-[2px] bg-cream/25 rounded-full overflow-hidden">
        <div
          className="h-full bg-cream rounded-full transition-transform duration-300 ease-out"
          style={{
            width: `${100 / slides.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
