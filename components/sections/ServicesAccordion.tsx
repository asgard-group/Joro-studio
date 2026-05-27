"use client";

import { useRef } from "react";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const items = [
  {
    id: 1,
    title: "Bureaux opérés",
    description: "Bureaux flexibles, opérés et gérés clé en main.",
    image: "/images/desk.jpg",
  },
  {
    id: 2,
    title: "Espace events",
    description: "Cadre premium pour vos events.",
    image: "/images/Frame 52.png",
  },
  {
    id: 3,
    title: "Hospitality",
    description: "Design hôtelier haut de gamme.",
    image: "/images/work/portfolio-1.jpg",
  },
];

export default function ServicesAccordion() {
  const [active, setActive] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div className="px-4 sm:px-6 lg:px-[60px]">
      {/* Photo — parallax + crossfade on click */}
      <div ref={imgRef} className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:h-[600px] lg:w-full overflow-hidden">
        <motion.div className="absolute inset-0 scale-125" style={{ y: parallaxY }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={items[active].image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Image
                src={items[active].image}
                alt={items[active].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1320px"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Accordion */}
      <div className="mt-[45px]">
        {/* Mobile / Tablet */}
        <div className="lg:hidden">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              className={`w-full text-left p-5 border-t border-[#BAB6AA] transition-colors ${
                active === i ? "bg-[#BAB6AA]/20" : "bg-transparent hover:bg-[#BAB6AA]/20"
              }`}
            >
              <div className="flex justify-between items-start gap-[37px]">
                <div className="flex flex-col gap-3 flex-1">
                  <span className="text-[20px] font-medium text-[#1C2626] leading-tight">
                    {item.title}
                  </span>
                  <div className="relative">
                    <span className="invisible text-[16px] font-normal leading-snug block">
                      {item.description}
                    </span>
                    <AnimatePresence>
                      {active === i && (
                        <motion.span
                          key={item.id}
                          className="absolute inset-0 text-[16px] font-normal text-[#1C2626] leading-snug"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        >
                          {item.description}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <span className="text-[20px] font-medium text-[#BAB6AA] shrink-0">
                  {item.id}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-start gap-[29px]">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              className={`flex-1 text-left p-5 border-t border-[#BAB6AA] transition-colors flex gap-[37px] items-start ${
                active === i ? "bg-[#BAB6AA]/20" : "hover:bg-[#BAB6AA]/20"
              }`}
            >
              <div className="flex flex-col gap-3 flex-1">
                <span className="text-[20px] font-medium text-[#1C2626] leading-tight">
                  {item.title}
                </span>
                <div className="relative">
                  <span className="invisible text-[16px] font-normal leading-snug block">
                    {item.description}
                  </span>
                  <AnimatePresence>
                    {active === i && (
                      <motion.span
                        key={item.id}
                        className="absolute inset-0 text-[16px] font-normal text-[#1C2626] leading-snug"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        {item.description}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <span className="text-[20px] font-medium text-[#BAB6AA] shrink-0">
                {item.id}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
