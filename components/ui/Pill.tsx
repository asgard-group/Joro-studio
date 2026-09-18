import type { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  /**
   * - `"light"` (default) : outline + texte `charcoal`, pour fond cream/clair.
   * - `"dark"` : outline + texte `cream`, pour fond charcoal/sombre.
   */
  variant?: "light" | "dark";
  /**
   * - `"left"` (default) : puce à gauche du label uniquement.
   * - `"both"` : puce à gauche et à droite du label.
   */
  dotSide?: "left" | "both";
  /** Classes additionnelles pour le positionnement (`mb-*`, `self-start`, etc.). */
  className?: string;
}

/**
 * Eyebrow pill — puce ronde accentuée + label, utilisé pour les eyebrows
 * comme « NOTRE STUDIO », « NOS OFFRES », etc.
 *
 * Tailles fluides par palier (design system vw de globals.css : `.pill-text`,
 * `.pill-dot`, `.pill-gap`) plutôt que des valeurs Tailwind fixes.
 */
export default function Pill({ children, variant = "light", dotSide = "left", className = "" }: PillProps) {
  const textClass = variant === "dark" ? "text-cream" : "text-charcoal";
  const dot = <span className="pill-dot rounded-full bg-taupe shrink-0" />;

  return (
    <div className={`inline-flex items-center pill-gap ${className}`}>
      {dot}
      <span className={`pill-text ${textClass}`}>{children}</span>
      {dotSide === "both" && dot}
    </div>
  );
}
