"use client";

import { useState } from "react";
import type { FAQItem } from "@/types";

interface FAQProps {
  items: FAQItem[];
  title?: string;
  eyebrow?: string;
}

export default function FAQ({ items, title = "Questions fréquentes", eyebrow = "FAQ" }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="label-eyebrow mb-4">{eyebrow}</p>
            <h2 className="heading-section">{title}</h2>
          </div>

          <dl className="divide-y divide-cream-300">
            {items.map((item, i) => (
              <div key={i} className="py-6">
                <dt>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                    aria-expanded={open === i}
                  >
                    <span className="font-serif text-lg text-charcoal">
                      {item.question}
                    </span>
                    <span
                      className={`mt-1 shrink-0 text-taupe transition-transform duration-200 ${
                        open === i ? "rotate-45" : ""
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </dt>
                {open === i && (
                  <dd className="mt-4 text-base leading-relaxed text-charcoal-muted">
                    {item.answer}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
