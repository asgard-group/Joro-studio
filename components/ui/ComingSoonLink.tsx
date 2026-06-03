"use client";

import { type ReactNode, type CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  block?: boolean;
}

export default function ComingSoonLink({ children, className = "", style, block = false }: Props) {
  const Tag = block ? "div" : "span";
  return (
    <Tag className={`group/cs relative cursor-default ${className}`} style={style}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-charcoal px-[8px] py-[4px] text-[10px] font-medium uppercase tracking-[0.12em] text-cream opacity-0 transition-opacity duration-150 group-hover/cs:opacity-100">
        À venir
      </span>
    </Tag>
  );
}
