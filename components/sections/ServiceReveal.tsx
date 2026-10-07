"use client";

import { useState } from "react";
import Image from "next/image";
import ServiceBottom from "@/components/sections/ServiceBottom";

import { motion, type MotionValue } from "framer-motion";


interface Props {
  activeId: string;
  title: string;
  description: string;
  ctaLabel?: string;
  image?: string;
  video?: string;
  /** Frame fixe affichée à la place de la vidéo tant qu'elle n'a pas fini de charger. */
  poster?: string;
  flipX?: boolean;
  wide?: boolean;
  overlayClass?: string;
  /** Second filtre (dégradé, mode de fusion…) posé au-dessus de overlayClass, en style inline. */
  gradientOverlayStyle?: React.CSSProperties;
  /** Classes du second filtre (ex. mode de fusion avec repli selon le navigateur). */
  gradientOverlayClass?: string;
  /** Décalage vertical du fond (parallaxe), piloté par ServiceStage. */
  bgY?: MotionValue<string>;
  /** Agrandit le fond (même principe que le scale-110 du Hero) pour un cadrage plus serré */
  zoomed?: boolean;
}

export default function ServiceReveal({ activeId, title, description, ctaLabel = "Découvrir l'offre", image, video, poster, flipX, overlayClass, gradientOverlayStyle, gradientOverlayClass, bgY, zoomed }: Props) {
  // Fondu de la vidéo une fois chargée : le poster reste visible (et net) jusque-là.
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div
      data-navbar-theme="dark"
      className="relative h-full overflow-hidden"
    >
      {/* Fond parallaxe — vidéo ou image
          scale passé en prop motion (pas en classe CSS) : Framer Motion pilote `transform`
          via le style `y` et écraserait sinon toute classe scale-* posée à côté */}
      <motion.div
        className="absolute inset-x-0 w-full"
        style={{ y: bgY, top: "-12%", height: "124%", scale: zoomed ? 1.1 : 1 }}
      >
        {video ? (
          <>
            {/* Poster affiché instantanément, puis fondu vers la vidéo une fois chargée */}
            {poster && <Image src={poster} alt="" fill className="object-cover" sizes="100vw" />}
            <video
              className={`absolute inset-0 w-full h-full object-cover${flipX ? " scale-x-[-1]" : ""}`}
              style={{ opacity: videoLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
              src={video}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setVideoLoaded(true)}
            />
          </>
        ) : image ? (
          <Image src={image} alt={title} fill className="object-cover" sizes="100vw" />
        ) : null}
      </motion.div>
      {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} />}
      {gradientOverlayStyle && <div className={`absolute inset-0 pointer-events-none ${gradientOverlayClass ?? ""}`} style={gradientOverlayStyle} />}

      {/* Contenu — affiché d'emblée (pas de fondu à l'entrée dans le viewport) */}
      <ServiceBottom activeId={activeId} title={title} description={description} ctaLabel={ctaLabel} />
    </div>
  );
}
