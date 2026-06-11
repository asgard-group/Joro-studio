"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedImageProps {
  images: string[];
  alt: string;
}

const INTERVAL = 3000;
const DURATION = 500;

function FillBar({ duration }: { duration: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `width ${duration}ms linear`;
        el.style.width = "100%";
      });
    });
  }, [duration]);

  return <div ref={ref} className="h-full bg-white" style={{ width: "0%" }} />;
}

export default function AnimatedImage({ images, alt }: AnimatedImageProps) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [fillIndex, setFillIndex] = useState(0);
  const [fillEpoch, setFillEpoch] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const currentRef = useRef(0);

  const advance = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;

    const nextIndex = (currentRef.current + 1) % images.length;

    // Place la prochaine image invisible par-dessus
    setNext(nextIndex);
    setTransitioning(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Déclenche le fondu
        setTransitioning(true);
        setTimeout(() => {
          currentRef.current = nextIndex;
          setCurrent(nextIndex);
          setFillIndex(nextIndex);
          setFillEpoch((e) => e + 1);
          setNext(null);
          setTransitioning(false);
          lockRef.current = false;
        }, DURATION);
      });
    });
  }, [images.length]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setFillIndex(currentRef.current);
    setFillEpoch((e) => e + 1);
    stopTimer();
    intervalRef.current = setInterval(advance, INTERVAL);
  }, [advance, stopTimer]);

  const handleMouseLeave = useCallback(() => {
    stopTimer();
    if (lockRef.current) return;

    setFillIndex(0);
    setFillEpoch(0);

    if (currentRef.current === 0) return;

    // Fondu retour vers image 0
    lockRef.current = true;
    setNext(0);
    setTransitioning(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitioning(true);
        setTimeout(() => {
          currentRef.current = 0;
          setCurrent(0);
          setNext(null);
          setTransitioning(false);
          lockRef.current = false;
        }, DURATION);
      });
    });
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const getTransform = (i: number) => {
    if (i === next) return transitioning ? "translateY(0%)" : "translateY(100%)";
    if (i === current) return "translateY(0%)";
    return "translateY(100%)";
  };

  const getZIndex = (i: number) => {
    if (i === next) return 2;
    if (i === current) return 1;
    return 0;
  };

  const getTransition = (i: number) =>
    i === next
      ? `transform ${DURATION}ms cubic-bezier(0.25,0.46,0.45,0.94)`
      : "none";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Indicateurs */}
      <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
        {images.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[2px] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.35)" }}
          >
            {i < fillIndex ? (
              <div className="h-full bg-white w-full" />
            ) : i === fillIndex && fillEpoch > 0 ? (
              <FillBar key={`${fillEpoch}-${fillIndex}`} duration={INTERVAL} />
            ) : (
              <div className="h-full bg-white w-0" />
            )}
          </div>
        ))}
      </div>

      {/* Images */}
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt={i === 0 ? alt : ""}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: getTransform(i),
            zIndex: getZIndex(i),
            transition: getTransition(i),
          }}
        />
      ))}
    </div>
  );
}
