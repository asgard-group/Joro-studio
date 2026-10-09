"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import RevealText from "@/components/ui/RevealText";
import { realisationsProjects, type RealisationProject } from "@/data/realisationsProjects";

const INTRO_TITLE = "Nos projets";
const INTRO_TEXT =
  "Chaque projet naît d’un lieu, d’un usage et d’une rencontre. Hôtels, bureaux, lieux événementiels ou espaces hybrides : nous accompagnons nos clients de la première esquisse à la livraison du chantier. Chacune de nos réalisations est le fruit d’un dialogue étroit entre vision, contraintes et savoir-faire.";


// Projet : titre centré, cadre photo (720 px minimum, puis 50 % de l'écran : pas de plafond) qui grandit de 35 % à 100 % de sa taille pendant que l'image
// dézoome de 1,5 à 1 (progression 0 quand le haut du projet entre en bas de l'écran, 1 quand il atteint
// le haut de l'écran), puis catégorie / mention. Mise en page et animation d'après la maquette
// « Atelier Vauclair — Projets ».
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function ProjectItem({ project }: { project: RealisationProject }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const t = useTransform(scrollYProgress, (v) => easeOutCubic(Math.min(1, Math.max(0, v))));
  const outer = useTransform(t, (v) => 0.35 + 0.65 * v);
  const inner = useTransform(t, (v) => 1 + 0.5 * (1 - v));

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-center px-[4vw] work-title font-medium leading-none tracking-[-0.035em]">
        <h3 className="mx-[0.12em] text-center max-[700px]:whitespace-normal min-[701px]:whitespace-nowrap" style={{ color: project.accentColor }}>
          {project.title}
        </h3>
      </div>
      <div className="relative mx-auto mt-[24px] min-[701px]:mt-[40px] w-[min(92vw,max(720px,50vw))]">
        <motion.div
          className="relative aspect-[16/10] w-full overflow-hidden"
          style={{ scale: reduced ? 1 : outer, transformOrigin: "center top" }}
        >
          <motion.div className="absolute inset-0" style={{ scale: reduced ? 1 : inner }}>
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="(min-width: 1440px) 50vw, (min-width: 780px) 720px, 92vw" />
          </motion.div>
        </motion.div>
        {/* Ligne sous la photo : mention à gauche, bouton « + » (déroule la description) à droite. */}
        <div className="mt-[18px] flex items-center justify-between gap-[20px] text-[15px]">
          <span className="text-charcoal">{project.tagRight}</span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={`desc-${project.id}`}
            className="flex items-center gap-[7px] text-[12px] font-medium uppercase leading-none text-charcoal"
          >
            <span className="relative block h-[12px] w-[12px]" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
              <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
            </span>
            {open ? "Réduire" : "Description"}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`desc-${project.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="overflow-hidden"
            >
              {/* Retrait de la 1re ligne (9 % de la largeur). */}
              <div className="pt-[16px] text-[16px] leading-[1.5] text-charcoal [text-indent:9%]">{project.description}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function FeaturedWork() {
  // Hauteur de l'intro : le morceau de SVG qui dépasse sur la 1re réalisation est une copie
  // « sticky » du même SVG, posée avec le même décalage (haut de la copie = haut de l'intro).
  const introInnerRef = useRef<HTMLDivElement>(null);
  const [introH, setIntroH] = useState(0);
  useEffect(() => {
    const el = introInnerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setIntroH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    // Fond beige sur le wrapper (et non sur la section des projets) : les cercles de l'intro
    // débordent sur la section suivante et restent visibles en entier. overflow-x clip : le
    // SVG dépasse à droite en mobile.
    <div className="relative overflow-x-clip bg-cream">
      {/* Intro : exactement la mise en page de la section À propos (classes .studio* de globals.css :
          titre, paragraphe, label, cercles SVG derrière), sans la photo. */}
      <section data-navbar-theme="light" className="studio">
        <div ref={introInnerRef} className="studio__inner" style={{ paddingBottom: 0, minHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG décoratif positionné en absolu */}
          <img src="/images/logos/svg.svg" alt="" aria-hidden="true" className="studio__ring" />
          <RevealText as="h2" className="studio__title" style={{ whiteSpace: "normal" }}>{INTRO_TITLE}</RevealText>
          <RevealText as="div" className="studio__text" delay={0.15} step={0.07}>{INTRO_TEXT}</RevealText>
          {/* Label dans le flux, juste sous le paragraphe (dans À propos il est ancré en bas, sous la photo). */}
          <div className="studio__label" style={{ position: "relative", left: "auto", bottom: "auto", marginTop: "calc(32 * var(--s))" }}>
            <span className="studio__dot" aria-hidden="true" />
            Réalisations
          </div>
        </div>
      </section>

      {/* Réalisations : liste verticale, animation au défilement dans ProjectItem. */}
      <section
        data-navbar-theme="light"
        className="relative z-[1] overflow-clip pb-[20vh] [--pt:150px] min-[835px]:[--pt:220px] min-[1280px]:[--pt:300px]"
      >
        {/* Le SVG se fige (sticky) quand le haut de la section atteint -100px, soit quand le titre de
            la 1re réalisation est à (--pt − 100px) du haut de l'écran. Il se libère symétriquement :
            quand le titre de la DERNIÈRE réalisation arrive à cette même hauteur. Pour cela, le
            conteneur du sticky (C) s'arrête avant la dernière réalisation ; la marge négative de la
            liste raccourcit d'autant sa zone de contenu (course du sticky) et le padding-bas de C la
            compense : la mise en page ne bouge pas. */}
        <div className="relative" style={{ paddingBottom: "max(0px, calc(var(--pt) - 18vh))" }}>
          {/* Suite des cercles de l'intro : prolonge exactement l'intro au départ (même position) ;
              l'intro, elle, est rognée à sa limite pour que le tracé ne soit pas doublé.
              Hauteur 0 : seul le SVG (positionné vers le haut) dépasse. */}
          <div aria-hidden="true" className="studio pointer-events-none -z-10 h-0" style={{ position: "sticky", top: -100, overflow: "visible", background: "transparent" }}>
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1920px]" style={{ height: introH }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG décoratif positionné en absolu */}
              <img src="/images/logos/svg.svg" alt="" className="studio__ring" />
            </div>
          </div>
          <div className="flex flex-col gap-[18vh] pt-[var(--pt)]" style={{ marginBottom: "calc(-1 * max(0px, calc(var(--pt) - 18vh)))" }}>
            {realisationsProjects.slice(0, -1).map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
        <div className="mt-[18vh]">
          <ProjectItem project={realisationsProjects[realisationsProjects.length - 1]} />
        </div>
      </section>
    </div>
  );
}

