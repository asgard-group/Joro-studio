"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt?: string;
  aspectClass?: string;
  sizes?: string;
}

export default function ParallaxImage({
  src,
  alt = "",
  aspectClass = "aspect-[16/7]",
  sizes = "100vw",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`relative w-full ${aspectClass} overflow-hidden`}>
      <motion.div className="absolute inset-0 scale-125" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      </motion.div>
    </div>
  );
}
