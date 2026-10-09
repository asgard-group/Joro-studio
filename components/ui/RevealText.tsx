"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  children: string;
  as?: "h2" | "h3" | "div";
  className?: string;
  style?: CSSProperties;
  /** Délai de départ (s), pour enchaîner un paragraphe après son titre. */
  delay?: number;
  /** Décalage (s) entre deux lignes successives. */
  step?: number;
}

// Même animation d'apparition que le titre du hero (.hero-line) : le texte remonte ligne par
// ligne depuis un masque (1,1 s, cubic-bezier(.77,0,.18,1)), la 2e ligne en léger décalage… mais
// déclenchée quand le bloc entre dans l'écran. Les retours à la ligne étant naturels (le texte
// s'adapte à la largeur), chaque mot a son propre masque et reçoit le délai de SA ligne,
// mesurée après le rendu (et remesurée au redimensionnement).
export default function RevealText({ children, as: Tag = "div", className, style, delay = 0, step = 0.12 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [lines, setLines] = useState<number[]>([]);
  const words = children.split(" ");

  // Rang de ligne de chaque mot (d'après sa position verticale).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const tops: number[] = [];
      const idx = Array.from(el.querySelectorAll<HTMLElement>("[data-w]")).map((w) => {
        const t = w.offsetTop;
        let i = tops.findIndex((x) => Math.abs(x - t) < w.offsetHeight / 2);
        if (i === -1) {
          tops.push(t);
          i = tops.length - 1;
        }
        return i;
      });
      setLines(idx);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  // Déclenchement unique à l'entrée dans l'écran.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ref générique sur h2/h3/div
      ref={ref as any}
      className={`${className ?? ""}${revealed ? " is-revealed" : ""}`}
      style={style}
      aria-label={children}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span data-w className="reveal-word" aria-hidden="true">
            <span className="reveal-inner" style={{ transitionDelay: `${delay + (lines[i] ?? 0) * step}s` }}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
