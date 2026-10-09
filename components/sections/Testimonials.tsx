"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { testimonials, type TestimonialCard } from "@/data/testimonials";
import Pill from "@/components/ui/Pill";
import RevealText from "@/components/ui/RevealText";

const items = testimonials as TestimonialCard[];

// Section « Ils nous ont fait confiance » : titre à gauche, label à droite, puis une rangée
// horizontale de cartes (photo + ligne de méta + filet). Au survol (ou au toucher sur écran
// tactile), la photo laisse place à une carte charbon qui dévoile le témoignage.
export default function Testimonials() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    // « Suivant » tant que la dernière carte n'est pas entièrement visible.
    const cards = el.querySelectorAll("article");
    const last = cards[cards.length - 1];
    setCanNext(last ? last.getBoundingClientRect().right > el.getBoundingClientRect().right - 2 : false);
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  // Défile d'une carte (largeur + espacement) à la fois.
  function scrollByCard(dir: 1 | -1) {
    const el = rowRef.current;
    const card = el?.querySelector("article");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  return (
    <section data-navbar-theme="light" className="bg-cream pb-[80px] pt-[100px] min-[1280px]:pb-[120px] min-[1280px]:pt-[160px]">
      {/* Label sur la même ligne que le titre tant qu'il reste au moins 100px entre eux (gap-x) ; sinon
          il passe au-dessus (flex-wrap-reverse : la ligne qui déborde se place avant ; en wrap-reverse, items-start aligne en bas). */}
      <div className="mx-auto flex max-w-[1920px] flex-wrap-reverse items-start justify-between gap-x-[100px] gap-y-[24px] px-[16px] min-[835px]:px-[32px] min-[1280px]:px-[40px]">
        <RevealText as="h2" className="m-0 max-w-[9em] text-[length:clamp(40px,4.2vw,104px)] font-medium leading-[1.1] text-charcoal">
          Ils nous ont fait confiance
        </RevealText>
        <Pill className="mb-[10px]">
          TÉMOIGNAGES
        </Pill>
      </div>

      {/* Rangée horizontale (--ml : marge de centrage au-delà de 1920px, comme le hero) : défile en natif (trackpad, doigt, Maj + molette), la dernière carte
          peut dépasser à droite. */}
      <div
        ref={rowRef}
        className="[--ml:max(0px,calc((100vw-1920px)/2))] mt-[48px] flex snap-x snap-mandatory min-[835px]:snap-proximity gap-[16px] overflow-x-auto pl-[calc(var(--ml)+16px)] pr-[16px] pb-[8px] min-[835px]:mt-[72px] min-[835px]:gap-[1.9vw] min-[835px]:pl-[calc(var(--ml)+32px)] min-[835px]:pr-[32px] min-[1280px]:pl-[calc(var(--ml)+40px)] min-[1280px]:pr-[40px] [scroll-padding-left:calc(var(--ml)+16px)] min-[835px]:[scroll-padding-left:calc(var(--ml)+32px)] min-[1280px]:[scroll-padding-left:calc(var(--ml)+40px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
        {/* Espace de fin : la dernière carte peut se caler à la même marge que la première. */}
        <div aria-hidden="true" className="w-[1px] shrink-0 min-[835px]:w-[3.5vw]" />
      </div>

      {/* Flèches précédent / suivant (masquées si toutes les cartes tiennent à l'écran) */}
      {(canPrev || canNext) && (
        <div className="mx-auto mt-[40px] flex max-w-[1920px] justify-end gap-[10px] px-[16px] min-[835px]:px-[32px] min-[1280px]:px-[40px]">
          <ArrowButton dir="prev" disabled={!canPrev} onClick={() => scrollByCard(-1)} />
          <ArrowButton dir="next" disabled={!canNext} onClick={() => scrollByCard(1)} />
        </div>
      )}
    </section>
  );
}

// Bouton rond à flèche : actif = contour et flèche pleins, désactivé (début / fin de rangée) = atténué.
function ArrowButton({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Témoignage précédent" : "Témoignage suivant"}
      className={`flex h-[36px] w-[36px] items-center justify-center rounded-full border border-charcoal text-charcoal transition-opacity duration-300 min-[835px]:h-[42px] min-[835px]:w-[42px] ${
        disabled ? "cursor-default opacity-35" : "hover:opacity-60"
      }`}
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: dir === "prev" ? "rotate(180deg)" : "none" }}
      >
        <path d="M4 12h16M13 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function Card({ item }: { item: TestimonialCard }) {
  // Écrans sans survol : un toucher bascule l'affichage du témoignage.
  const [open, setOpen] = useState(false);

  function handleClick() {
    if (window.matchMedia("(hover: none)").matches) setOpen((o) => !o);
  }

  return (
    <article
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }}
      onBlur={() => setOpen(false)}
      className="group w-[calc(100vw-32px)] shrink-0 snap-start snap-always outline-none min-[835px]:w-[31.5vw]"
    >
      <div className="relative aspect-[629/483] w-full overflow-hidden">
        <Image
          src={item.photo}
          alt={`${item.company}, ${item.location}`}
          fill
          className="object-cover"
          sizes="(min-width: 835px) 32vw, 100vw"
        />
        {/* Carte charbon avec le témoignage */}
        <div
          className={`absolute inset-0 flex items-start bg-[#1C2626] p-[8%] transition-opacity duration-300 ease-out [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:opacity-100 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-[length:clamp(13px,0.95vw,18px)] leading-[1.45] text-cream">{item.quote}</div>
        </div>
      </div>

      <div className="mt-[16px] flex items-baseline justify-between gap-[16px] text-[14px] font-medium uppercase leading-none text-charcoal min-[835px]:text-[clamp(13px,0.85vw,16px)]">
        <span>{item.company}</span>
        <span className="opacity-65">{item.location}</span>
      </div>
      {/* Filet : trait de fond discret + trait plein qui se dessine de gauche à droite au survol, en
          même temps que le fondu du témoignage (0,5 s, vitesse constante, sans délai), et qui
          disparaît de gauche à droite en quittant la carte : l'origine de l'échelle passe à droite
          au repos (le trait se rétracte vers la droite) et à gauche au survol (il part de la gauche). */}
      <div className="relative mt-[16px] h-px bg-charcoal/25">
        <div
          className={`absolute inset-0 bg-charcoal transition-transform duration-300 ease-linear [@media(hover:hover)]:group-hover:origin-left [@media(hover:hover)]:group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 ${
            open ? "origin-left scale-x-100" : "origin-right scale-x-0"
          }`}
        />
      </div>
    </article>
  );
}
