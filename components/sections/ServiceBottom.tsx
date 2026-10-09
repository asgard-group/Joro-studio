"use client";

import ComingSoonLink from "@/components/ui/ComingSoonLink";

// Mise en page « bas de page » des sections Services (test, d'après la maquette) :
// - à gauche (centré verticalement en mobile <768px et en desktop ≥940px, en bas en tablette) : label « NOS SERVICES », grand titre, description, lien d'action ;
// - à droite : navigation des services (≥940px), son bas aligné sur le bas du paragraphe (marge basse =
//   espace paragraphe → lien 24px + hauteur du lien 21px = 16px de texte + 4px + 1px de ligne) ; le service actif en cream, les autres atténués.
// Partagé par ServicesAll (DESIGN & BUILD) et ServiceReveal (AMO, Marketing Suite, Conseil).

const serviceNav = [
  { id: "design-build", label: "DESIGN & BUILD" },
  { id: "amo", label: "AMO" },
  { id: "marketing-suite", label: "MARKETING SUITE" },
  { id: "conseil-workplace", label: "CONSEIL & STRATÉGIE" },
];

interface Props {
  activeId: string;
  title: string;
  description: string;
  ctaLabel: string;
  /** Classe d'empilement du conteneur (z-10 par défaut ; z-[5] sous le split de DESIGN & BUILD). */
  zClass?: string;
}

// Alignement optique du grand titre sur le paragraphe : la 1re lettre d'un grand corps a une marge
// interne (mesurée sur GeneralSans, en em) qui décale son tracé vers la droite par rapport au texte
// courant ; on la compense par une marge négative, lettre par lettre.
const leadingBearingEm: Record<string, number> = { D: 0.078, M: 0.078, A: 0.02, C: 0.036 };

const gutterX = "px-[16px] min-[835px]:px-[32px] min-[1280px]:px-[40px]";

export default function ServiceBottom({ activeId, title, description, ctaLabel, zClass = "z-10" }: Props) {
  return (
    <div className={`absolute inset-0 ${zClass}`}>
      {/* Contraste derrière le texte de gauche : très léger dégradé sombre depuis le bord gauche,
          éteint avant le centre (pas un overlay visible). Uniquement sur Marketing Suite. */}
      {activeId === "marketing-suite" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%]"
          style={{ background: "linear-gradient(to right, rgba(12, 16, 16, 0.38), rgba(12, 16, 16, 0))" }}
        />
      )}
      {/* Une seule rangée (bloc de gauche + menu), alignée par le bas : le menu des services
          finit exactement sur le bas du lien d'action. Centrée verticalement en desktop. */}
      <div className={`absolute inset-x-0 mx-auto max-w-[1920px] bottom-[32px] max-[767px]:bottom-auto max-[767px]:top-1/2 max-[767px]:-translate-y-1/2 min-[940px]:bottom-auto min-[940px]:top-1/2 min-[940px]:-translate-y-1/2 flex items-end justify-between gap-[40px] ${gutterX}`}>
      {/* Gauche */}
      <div className="relative min-w-0 [--t:clamp(44px,5.21vw,100px)]">
        {/* Label : sorti du flux et posé plus haut, au-dessus du contenu — le contenu (titre,
            description, lien) reste seul à déterminer le centrage vertical. */}
        <div className="absolute bottom-full left-0 mb-[calc(var(--t)*0.47+10px)] min-[940px]:mb-[clamp(14px,calc(3.5vw-10px),57px)] flex items-center gap-[8px] text-[11px] min-[940px]:text-[13px] font-medium uppercase leading-none text-cream">
          <span className="block w-[6px] h-[6px] rounded-full bg-cream/50 shrink-0" aria-hidden="true" />
          Nos services
        </div>
        {/* Contenu remonté de 10px (sans bouger le label, ancré au bloc non décalé). */}
        <div className="-translate-y-[10px]">
          <h2
            className="text-[length:var(--t)] font-medium leading-none text-cream"
            style={{ marginLeft: `-${leadingBearingEm[title.trim()[0].toUpperCase()] ?? 0.05}em` }}
          >
            {title}
          </h2>
          {/* div et non p : la règle globale `p { font-size: 14px !important }` sous 768px. */}
          <div className="mt-[calc(var(--t)*0.4)] min-[940px]:mt-[40px] max-w-[529px] text-[14px] min-[940px]:text-[16px] leading-[1.65] text-cream">
            {description}
          </div>
          <ComingSoonLink className="mt-[calc(var(--t)*0.24)] min-[940px]:mt-[24px] flex w-fit items-center gap-[8px] border-b border-transparent pb-[4px] text-[13px] min-[940px]:text-[16px] font-medium uppercase leading-none text-cream transition-colors duration-300 hover:border-cream">
            {ctaLabel}
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" className="-scale-y-100">
              <path d="M3 3l8 8M11 4v7H4" />
            </svg>
          </ComingSoonLink>
        </div>
      </div>

      {/* Droite — navigation des services */}
      <nav
        aria-label="Services"
        className="hidden min-[940px]:flex shrink-0 flex-col items-end gap-[clamp(10px,1.2vw,23px)] mb-[45px] -translate-y-[10px]"
      >
        {serviceNav.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              const el = document.getElementById(item.id);
              if (!el) return;
              const top = el.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({ top, behavior: "smooth" });
            }}
            className={`text-[14px] min-[940px]:text-[clamp(14px,0.95vw,18px)] font-medium uppercase tracking-[0.06em] leading-none transition-colors duration-200 ${
              item.id === activeId ? "text-cream" : "text-cream/[0.16] hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      </div>
    </div>
  );
}
