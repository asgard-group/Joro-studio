"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { WorkItem } from "@/types";

interface Props {
  items: WorkItem[];
}

export default function FeaturedWork({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Pour chaque item : { left, right }
  const itemRefs = useRef<Array<{ left: HTMLDivElement | null; right: HTMLDivElement | null }>>(
    items.map(() => ({ left: null, right: null }))
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);

      items.forEach((_, i) => {
        const refs = itemRefs.current[i];
        if (!refs?.left || !refs?.right) return;

        // Chaque item se révèle pendant sa tranche de scroll [i*vh, (i+1)*vh]
        const itemScrolled = scrolled - i * vh;
        const p = Math.min(1, Math.max(0, itemScrolled / vh));

        const imgTop = 100 - p * 100;
        const contentBottom = p * 100;

        refs.left.style.clipPath = `polygon(0% ${imgTop.toFixed(3)}%, 100% ${imgTop.toFixed(3)}%, 100% 100%, 0% 100%)`;
        refs.right.style.clipPath = `polygon(0% 0%, 100% 0%, 100% ${contentBottom.toFixed(3)}%, 0% ${contentBottom.toFixed(3)}%)`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  // (N+1) * 100vh : N tranches de reveal + 1vh pour rester visible à la fin
  const totalHeight = `${(items.length + 1) * 100}vh`;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: totalHeight, zIndex: 69 }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className="grid grid-cols-1 min-[1200px]:grid-cols-2"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            zIndex: i + 1,
          }}
        >
          {/* Colonne gauche — photo plein cadre */}
          <div
            ref={(el) => { itemRefs.current[i].left = el; }}
            style={{
              position: "relative",
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              willChange: "clip-path",
              overflow: "hidden",
            }}
          >
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover"
              sizes="50vw"
            />

            {/* Carte projet — uniquement en dessous de 1200px, où la colonne droite
                est masquée : sans elle, le titre du projet ne serait affiché nulle part. */}
            <div className="absolute inset-0 flex items-center justify-center min-[1200px]:hidden">
              <ProjectCard item={item} className="w-[min(300px,80%)]" />
            </div>

            {/* Catégorie / typologie — en bas à gauche, posé sur la photo */}
            <div className="absolute bottom-0 left-0 p-6 min-[1200px]:p-[30px]">
              {item.tags.slice(0, 2).map((tag) => (
                <div
                  key={tag}
                  className="text-[12px] min-[1200px]:text-[14px] font-medium uppercase leading-[1.5] text-white"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite — fond couleur + carte projet + description
              (masquée en dessous de 1200px) */}
          <div
            ref={(el) => { itemRefs.current[i].right = el; }}
            className="hidden min-[1200px]:block"
            style={{
              position: "relative",
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              willChange: "clip-path",
              overflow: "hidden",
            }}
          >
            {/* Fond couleur */}
            <div style={{ position: "absolute", inset: 0, background: item.accentColor ?? "#96461F" }} />

            {(() => {
              const isDark = !item.accentColor || item.accentColor !== "#F3F2ED";
              const textColor = isDark ? "#FFFFFF" : "rgba(0, 0, 0, 0.6)";
              return (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Largeur du bloc : 200px de marge de chaque côté de la colonne (pas de
                      px-* sur le parent, sinon ces 200px s'additionneraient à son padding),
                      plafonnée à 457 (largeur Figma, atteinte vers 1920px) et avec un
                      plancher à 280 pour rester lisible sur les petits écrans desktop.
                      Gap 26 entre la carte et la description. */}
                  <div
                    className="flex flex-col gap-[26px]"
                    style={{ width: "max(280px, min(457px, 100% - 400px))" }}
                  >
                    <ProjectCard item={item} className="w-full" />
                    {/* Description — sous la carte, alignée sur son bord gauche.
                        Figma indique `white` ; on conserve la teinte sombre de repli
                        pour « Châteaudun », dont le fond d'accent est crème (#F3F2ED)
                        et sur lequel du blanc serait illisible. */}
                    <div
                      style={{
                        color: textColor,
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "1.6",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                      }}
                    >
                      {item.shortDescription ?? item.description}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Carte crème : titre du projet puis photo ──────────────────
// Dimensions Figma (référence 457 de large) : padding 26 sur les côtés, 19 en
// haut, 23 en bas, gap 24, titre 46/65.93 en 600, photo en 406×403 (~carrée).
// À partir de 1200px, toutes ces valeurs sont exprimées en `cqw` (% de la
// largeur propre de la carte) au lieu de px fixes : quand la marge de 200px
// (cf. plus haut) réduit la carte sous 457px, chaque mesure rétrécit dans la
// même proportion — la vignette garde exactement sa forme Figma, juste plus
// petite, au lieu de se déformer (ce qui arrivait avant : la photo gardait une
// hauteur fixe de 403px pendant que sa largeur, elle, rétrécissait).
// Un conteneur ne peut pas se mesurer par rapport à lui-même : `containerType`
// est donc posé sur la boîte extérieure (`bg-cream` + ombre), et les `cqw` sont
// utilisés sur son contenu (l'élément suivant), qui la mesure comme ancêtre.
// En dessous de 1200px, tailles fixes classiques (la carte y est déjà fluide
// via w-[min(300px,80%)] côté appelant, sans le même risque de déformation).
// Les textes sont des `div` et non des `p` : la règle globale mobile
// `p, li { font-size: 14px !important }` écraserait les tailles fixées ici.
function ProjectCard({ item, className = "" }: { item: WorkItem; className?: string }) {
  return (
    <div
      className={`bg-cream ${className}`}
      style={{
        boxShadow:
          "0px 2px 8px -2px rgba(38, 34, 30, 0.08), 0px 30px 70px -25px rgba(38, 34, 30, 0.28)",
        containerType: "inline-size",
      }}
    >
      <div className="flex flex-col gap-4 p-5 min-[1200px]:gap-[5.25cqw] min-[1200px]:px-[5.69cqw] min-[1200px]:pb-[5.03cqw] min-[1200px]:pt-[4.16cqw]">
        {/* min-height plutôt que height fixe : un titre long peut passer sur deux
            lignes sans être rogné par l'`overflow: hidden` de la carte. */}
        <div className="flex flex-col justify-center text-center text-[24px] font-semibold capitalize leading-[1.2] text-charcoal min-[1200px]:min-h-[18.16cqw] min-[1200px]:text-[10.07cqw] min-[1200px]:leading-[14.43cqw]">
          {item.title.toLowerCase()}
        </div>
        {/* aspect-ratio (et non une hauteur fixe) : la forme de la photo reste
            proportionnelle à sa propre largeur à toutes les tailles. */}
        <div className="relative w-full aspect-[406/403]">
          <Image
            src={item.rightImage ?? item.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="406px"
          />
        </div>
      </div>
    </div>
  );
}
