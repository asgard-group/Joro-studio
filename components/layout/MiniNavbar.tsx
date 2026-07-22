"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { headerStrings } from "@/lib/strings";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

const LABEL_STYLE: CSSProperties = {
  lineHeight: "100%",
  letterSpacing: "0.02em",
};

// Inverse un SVG foncé (charcoal) en cream — même filtre que Header/FullscreenMenu.
const ICON_FILTER = "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)";

const pillClasses =
  "inline-flex items-center gap-0 rounded-full bg-[#9C938C] px-[16px] py-[10px] text-[13px] font-medium uppercase text-cream transition-colors duration-200 hover:bg-[#8C837C]";

interface Props {
  visible: boolean;
  dark: boolean;
  onOpenMenu: () => void;
}

export default function MiniNavbar({ visible, dark, onOpenMenu }: Props) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const langTriggerId = useId();

  useEffect(() => {
    if (!langOpen) return;
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [langOpen]);

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-navbar"
      initial={false}
      animate={{ y: visible ? "0%" : "-100%" }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between px-[20px] min-[840px]:px-[40px] min-[1200px]:px-[60px] py-[16px]">
        {/* Gauche — monogramme + Menu */}
        <div className="flex items-center gap-[15px]">
          <Image
            src="/images/logos/monograme.svg"
            alt={headerStrings.logoAlt}
            width={44}
            height={28}
            priority
            style={{ filter: dark ? ICON_FILTER : "none" }}
          />
          <button type="button" onClick={onOpenMenu} aria-label={headerStrings.menu} className={pillClasses}>
            <span style={LABEL_STYLE}>{headerStrings.menu}</span>
          </button>
        </div>

        {/* Droite — Contact + langue */}
        <div className="flex items-center gap-[12px]">
          <ComingSoonLink className={pillClasses} style={LABEL_STYLE}>
            {headerStrings.contact}
          </ComingSoonLink>

          <div ref={langRef} className="relative">
            <button
              type="button"
              id={langTriggerId}
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={headerStrings.languageSwitcherAriaLabel}
              className={`${pillClasses} justify-center`}
              style={{ width: "64px" }}
            >
              <span style={LABEL_STYLE}>{headerStrings.currentLanguage}</span>
            </button>

            {langOpen && (
              <ul
                role="listbox"
                aria-labelledby={langTriggerId}
                className="absolute right-0 top-full mt-[8px] flex flex-col items-start rounded-[12px] bg-[#9C938C] py-[8px]"
              >
                <li role="option" aria-selected="false">
                  <button
                    type="button"
                    onClick={() => setLangOpen(false)}
                    className="px-[16px] py-[6px] text-[12px] font-medium uppercase text-cream cursor-pointer"
                    style={LABEL_STYLE}
                  >
                    {headerStrings.alternateLanguage}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
