import type { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  /**
   * - `"light"` (default) : outline + texte `charcoal`, pour fond cream/clair.
   * - `"dark"` : outline + texte `cream`, pour fond charcoal/sombre.
   */
  variant?: "light" | "dark";
  /** Classes additionnelles pour le positionnement (`mb-*`, `self-start`, etc.). */
  className?: string;
}

/**
 * Eyebrow pill — petit label en capitales dans un cadre arrondi avec outline 1px.
 * Utilisé pour les eyebrows comme « NOTRE HISTOIRE », « NOS OFFRES », etc.
 *
 * Le composant est volontairement 100 % Tailwind (aucun inline-style) afin de
 * rester aligné avec le design system (tokens `cream` / `charcoal`).
 */
export default function Pill({ children, variant = "light", className = "" }: PillProps) {
  const colorClasses =
    variant === "dark"
      ? "outline-cream text-cream"
      : "outline-charcoal text-charcoal";

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full px-5 py-[5px] outline outline-1 -outline-offset-1 ${colorClasses} ${className}`}
    >
      <span className="text-[12px] font-medium tracking-[0.18em] uppercase">
        {children}
      </span>
    </div>
  );
}
