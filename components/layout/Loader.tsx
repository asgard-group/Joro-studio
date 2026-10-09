"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger } from "framer-motion";
import { headerStrings } from "@/lib/strings";

// Loader d'entrée (d'après « loader-demo.html », aux couleurs de JÖRO Studio : fond charbon, logo
// crème) : le logo, découpé lettre par lettre, défile vers le haut en cascade pendant qu'un
// compteur monte de 0 à 100 % ; à la fin, les textes et les lettres repartent vers le haut en
// cascade pendant que la page (photo du hero) se déploie depuis le bas, comme dans la démo : elle
// démarre réduite et rognée sous l'écran puis s'élargit (clip-path + échelle) ; ensuite seulement
// le contenu du hero (titre, texte…) s'anime.
// Joué une fois au chargement de la page d'accueil. Sans animation si l'utilisateur préfère moins
// de mouvement. Prévient Hero / Header via la classe `loader-active` sur <html> et l'événement
// `loader:done` (leurs animations d'intro attendent la fin du loader).

const LOGO_SRC = "/images/logos/joro-studio-amo-architecture-travaux.webp";
const LOGO_W = 1390;
// Décalages (en % de la hauteur d'une lettre) volontairement larges : sur mobile, la marge du cadre
// (--lm) est grande par rapport à la hauteur du logo, et un décalage plus court laisserait dépasser
// le bas des lettres dans cette marge (visible au-dessus / en dessous du logo).
const LOGO_H = 230; // mot-logo seul (la baseline « amo · architecture · travaux » est rognée)
// Découpe du mot-logo à mi-chemin entre chaque lettre (J O R O S T U D I O), mesurée sur le fichier.
const CUTS = [0, 114, 280, 412, 588, 733, 880, 1022, 1170, 1235, 1390];
const SLICES = CUTS.slice(0, -1).map((from, i) => ({ from, width: CUTS[i + 1] - from }));
// Même filtre que le logo de la navbar : crème sur fond sombre.
const LOGO_FILTER = "brightness(0) invert(1) sepia(1) saturate(0) brightness(0.953)";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const FAST_IN_OUT = [0.76, 0, 0.24, 1] as const;

function LogoLayer({ className = "", style, refs, initialY }: { className?: string; style?: React.CSSProperties; refs: React.MutableRefObject<HTMLDivElement[]>; initialY: string }) {
  return (
    <div className={`flex w-full ${className}`} style={{ aspectRatio: `${LOGO_W} / ${LOGO_H}`, ...style }}>
      {SLICES.map((s, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          className="relative overflow-visible"
          style={{ width: `${(s.width / LOGO_W) * 100}%`, height: "100%", transform: `translateY(${initialY})` }}
        >
          {/* Tranche du logo : l'image entière, décalée pour ne montrer que cette lettre. */}
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- tranche de logo positionnée au pixel près */}
            <img
              src={LOGO_SRC}
              alt=""
              draggable={false}
              className="absolute top-0 max-w-none"
              style={{
                width: `${(LOGO_W / s.width) * 100}%`,
                height: `${(330 / LOGO_H) * 100}%`,
                left: `${(-s.from / s.width) * 100}%`,
                filter: LOGO_FILTER,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Précharge tout ce que la page contient : images (y compris celles à chargement différé, forcées en
// « eager »), vidéos (jusqu'à pouvoir être lues sans coupure) et polices. `onProgress` reçoit la
// fraction chargée (0 → 1). Chaque ressource est plafonnée à 15 s : une ressource lente ou en erreur
// ne bloque jamais le site.
function preloadAssets(onProgress: (fraction: number) => void): Promise<void> {
  const wait = (setup: (done: () => void) => void) =>
    new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 15000);
      setup(() => {
        clearTimeout(timer);
        resolve();
      });
    });

  const tasks: Promise<void>[] = [];

  document.querySelectorAll("img").forEach((img) => {
    img.loading = "eager";
    tasks.push(
      wait((done) => {
        if (img.complete && img.naturalWidth > 0) return done();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
        // Image « lazy » passée en eager que le navigateur n'a jamais démarrée (aucune source choisie) :
        // on précharge la même source via une image sonde, ce qui réchauffe le cache et libère le loader.
        setTimeout(() => {
          if (img.complete || img.currentSrc) return;
          const probe = new Image();
          probe.sizes = img.sizes;
          probe.srcset = img.srcset;
          probe.onload = probe.onerror = () => done();
          probe.src = img.src;
        }, 2500);
      }),
    );
  });

  document.querySelectorAll("video").forEach((video) => {
    video.preload = "auto";
    tasks.push(
      wait((done) => {
        if (video.readyState >= 4) return done();
        video.addEventListener("canplaythrough", done, { once: true });
        video.addEventListener("error", done, { once: true });
      }),
    );
  });

  tasks.push(wait((done) => void document.fonts.ready.then(done)));

  let loaded = 0;
  onProgress(0);
  return Promise.all(
    tasks.map((t) =>
      t.then(() => {
        loaded += 1;
        onProgress(loaded / tasks.length);
      }),
    ),
  ).then(() => undefined);
}

export default function Loader() {
  const pathname = usePathname();
  // Uniquement si la 1re page chargée est l'accueil (pas à chaque navigation interne).
  const [active, setActive] = useState(() => pathname === "/");

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const topLetters = useRef<HTMLDivElement[]>([]);
  const bottomLetters = useRef<HTMLDivElement[]>([]);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const metaRefs = useRef<HTMLSpanElement[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    const panel = panelRef.current;
    const logoBox = logoBoxRef.current;
    const main = document.querySelector("main") as HTMLElement | null;
    const html = document.documentElement;
    if (!root || !panel || !logoBox) return;

    // Mouvement réduit : pas de loader.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(false);
      return;
    }

    html.classList.add("loader-active", "loader-running");
    // Fond charbon derrière la page pendant tout le loader : quand le panneau s'efface, la zone pas encore
    // dévoilée reste charbon (et non beige) jusqu'à l'arrivée de la photo.
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = document.body.style.backgroundColor;
    html.style.backgroundColor = "#1C2626";
    document.body.style.backgroundColor = "#1C2626";
    const restoreBg = () => {
      html.classList.remove("loader-running");
      html.style.backgroundColor = prevHtmlBg;
      document.body.style.backgroundColor = prevBodyBg;
    };
    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;
    let cancelled = false;

    // Scroll bloqué pendant le loader (Lenis pilote le scroll à la molette : on bloque aussi les événements).
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    // État initial de la page (cf. démo) : réduite, rognée et décalée sous l'écran.
    const mainH = main ? main.offsetHeight : 0;
    const y0 = logoBox.offsetHeight;
    const s0 = 1 - 64 / W;
    const insetStart = isMobile
      ? `inset(${1.1 * H}px ${0.1 * W}px ${Math.max(0, mainH - 1.1 * H)}px ${0.1 * W}px)`
      : `inset(${H}px ${0.3 * W}px ${Math.max(0, mainH - H)}px ${0.3 * W}px)`;
    if (main) {
      main.style.transformOrigin = `50% ${H / 2}px`;
      main.style.willChange = "transform, clip-path";
      main.style.clipPath = insetStart;
      main.style.transform = `translateY(${y0}px) scale(${s0})`;
    }

    const finish = () => {
      if (main) {
        main.style.transform = "";
        main.style.clipPath = "";
        main.style.transformOrigin = "";
        main.style.willChange = "";
      }
      html.style.overflow = prevOverflow;
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      html.classList.remove("loader-active");
      restoreBg();
      setActive(false);
    };

    // animate() renvoie des contrôles « thenables » : on les convertit en vraies promesses.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- signatures d'animate() (valeur, élément, liste)
    const anim = (...args: [any, any, any]) =>
      new Promise<void>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (animate as any)(...args).then(() => resolve());
      });

    async function run() {
      // 1. Entrée : textes qui montent, puis lettres en cascade ; le compteur monte en parallèle.
      // Compteur = progression RÉELLE du chargement (images, vidéos, polices), jamais plus rapide qu'un
      // minimum de 2,2 s : il lit la fraction préchargée avec un léger lissage.
      let fraction = 0;
      const preload = preloadAssets((f) => (fraction = f));
      const count = new Promise<void>((resolve) => {
        const start = performance.now() + 250;
        let shown = 0;
        const tick = () => {
          if (cancelled) return resolve();
          const elapsed = Math.max(0, (performance.now() - start) / 1000);
          const timeCap = Math.min(1, elapsed / 2.2);
          const eased = timeCap < 0.5 ? 2 * timeCap * timeCap : 1 - Math.pow(-2 * timeCap + 2, 2) / 2;
          const target = Math.min(fraction, eased);
          shown += (target - shown) * 0.12;
          if (counterRef.current) counterRef.current.textContent = `${Math.min(100, Math.round(shown * 100))}%`;
          if (fraction >= 1 && elapsed >= 2.2 && shown >= 0.995) {
            if (counterRef.current) counterRef.current.textContent = "100%";
            return resolve();
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      const loaded =
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
      let loadingDone = false;
      void Promise.all([count, loaded, preload]).then(() => {
        loadingDone = true;
      });
      const texts = Promise.all([
        anim(metaRefs.current, { y: ["100%", "0%"] }, { duration: 1, ease: EXPO_OUT, delay: stagger(0.05, { startDelay: 0.25 }) }),
        anim(lineRefs.current, { y: ["100%", "0%"] }, { duration: 1.2, ease: EXPO_OUT, delay: stagger(0.075, { startDelay: 0.25 }) }),
      ]);
      // Logo en boucle tant que le chargement n'est pas terminé : entrée en cascade → (si ça charge encore)
      // sortie par le haut → on repart. Le dernier passage s'arrête logo posé, prêt pour la sortie finale.
      const logoIn = (startDelay: number) =>
        Promise.all([
          anim(topLetters.current, { y: ["160%", "-160%"] }, { duration: 2, ease: EXPO_OUT, delay: stagger(0.0475, { startDelay }) }),
          anim(bottomLetters.current, { y: ["280%", "0%"] }, { duration: 2, ease: EXPO_OUT, delay: stagger(0.0475, { startDelay }) }),
        ]);
      const logoLoop = async () => {
        await logoIn(0.55);
        while (!loadingDone && !cancelled) {
          await anim(bottomLetters.current, { y: ["0%", "-160%"] }, { duration: 1.1, ease: FAST_IN_OUT, delay: stagger(0.04) });
          if (cancelled) return;
          await Promise.all([
            anim(topLetters.current, { y: "160%" }, { duration: 0 }),
            anim(bottomLetters.current, { y: "280%" }, { duration: 0 }),
          ]);
          await logoIn(0.1);
        }
      };
      const intro = Promise.all([texts, logoLoop()]);
      await Promise.all([count, intro, loaded, preload]);
      if (cancelled) return;

      // 2. Sortie : d'abord les textes et les lettres du logo repartent vers le haut en cascade (sur le
      // fond charbon, jusqu'à la dernière lettre : plus aucun logo à l'écran ensuite)…
      const exit = Promise.all([
        anim(lineRefs.current, { y: ["0%", "-100%"] }, { duration: 1.2, ease: FAST_IN_OUT, delay: stagger(0.05) }),
        anim(metaRefs.current, { y: ["0%", "-100%"] }, { duration: 1.2, ease: FAST_IN_OUT, delay: stagger(0.05, { startDelay: 0.1 }) }),
        anim(bottomLetters.current, { y: ["0%", "-160%"] }, { duration: 1.3, ease: FAST_IN_OUT, delay: stagger(0.05) }),
      ]);
      // La page enchaîne sans temps mort : elle démarre dès que les dernières lettres sont presque sorties
      // (la fin de leur course est hors écran), sans attendre la fin complète de l'animation.
      await new Promise((r) => setTimeout(r, 1000));
      if (cancelled) return;

      // …puis, comme dans la démo, le fond s'efface et la page se déploie depuis le bas (rognage qui
      // s'ouvre + échelle qui revient à 1).
      const t = (d: number) => ({ delay: d });
      const reveal: Promise<unknown>[] = [exit, anim(panel, { opacity: [1, 0] }, { duration: 0.35, ease: "easeOut" })];
      if (main) {
        reveal.push(
          anim(main, { clipPath: [insetStart, "inset(0px 0px 0px 0px)"] }, { duration: 1.7, ease: FAST_IN_OUT, ...t(0) }),
          anim(main, { scale: [s0, 1], y: [y0, 0] }, { duration: 1.2, ease: FAST_IN_OUT, ...t(0.5) }),
        );
      }
      // Navbar en fondu quand la page est presque en place, puis le contenu du hero s'anime.
      // À ~40 % du déploiement de la page (0,7 s sur 1,8 s) : la navbar apparaît et sa ligne se trace.
      const navTimer = setTimeout(() => {
        html.classList.remove("loader-active");
        window.dispatchEvent(new Event("loader:navbar"));
      }, 720);
      const heroTimer = setTimeout(() => window.dispatchEvent(new Event("loader:done")), 1500);
      await Promise.all(reveal);
      clearTimeout(navTimer);
      clearTimeout(heroTimer);
      if (cancelled) return;
      html.classList.remove("loader-active");
      window.dispatchEvent(new Event("loader:navbar"));
      finish();
      window.dispatchEvent(new Event("loader:done"));
      // Recalcule le thème de la navbar (clair / sombre) maintenant que la page est à sa place.
      window.dispatchEvent(new Event("scroll"));
    }

    run();
    return () => {
      cancelled = true;
      html.style.overflow = prevOverflow;
      restoreBg();
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [active]);

  if (!active) return null;

  const addLine = (el: HTMLSpanElement | null) => {
    if (el && !lineRefs.current.includes(el)) lineRefs.current.push(el);
  };
  const addMeta = (el: HTMLSpanElement | null) => {
    if (el && !metaRefs.current.includes(el)) metaRefs.current.push(el);
  };
  const hidden = (y: string) => ({ transform: `translateY(${y})` });

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="loader-root pointer-events-none fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ ["--lm" as string]: "clamp(16px, 2.2vw, 32px)", padding: "0 var(--lm)" }}
    >
      <div ref={panelRef} className="absolute inset-0 bg-[#1C2626]" />

      {/* Logo : 2 couches de lettres — la couche du haut traverse l'écran vers le haut, celle du bas
          vient se poser à sa place. */}
      <div ref={logoBoxRef} className="relative z-[2] w-full overflow-hidden" style={{ padding: "var(--lm) 0" }}>
        <LogoLayer refs={topLetters} initialY="160%" className="relative" />
        <LogoLayer refs={bottomLetters} initialY="280%" className="absolute left-0 w-full" style={{ top: "var(--lm)" }} />
      </div>

      {/* Infos : titre, lieu, compteur */}
      <div
        className="absolute z-[3] grid grid-cols-12 text-[12px] uppercase tracking-[0.04em] text-cream max-[767px]:bottom-[var(--lm)] max-[767px]:grid-rows-[auto_1fr]"
        style={{ top: "var(--lm)", left: "var(--lm)", right: "var(--lm)" }}
      >
        <div className="col-span-4 max-[767px]:col-span-12">
          <div className="overflow-hidden"><span ref={addLine} className="block" style={hidden("100%")}>Jöro Studio</span></div>
          <div className="overflow-hidden"><span ref={addLine} className="block" style={hidden("100%")}>{headerStrings.tagline}</span></div>
        </div>
        <div className="col-span-4 max-[767px]:col-span-6 max-[767px]:row-start-2 max-[767px]:self-end">
          <div className="overflow-hidden"><span ref={addLine} className="block" style={hidden("100%")}>Paris</span></div>
          <div className="overflow-hidden"><span ref={addLine} className="block" style={hidden("100%")}>France</span></div>
        </div>
        <div className="col-span-3 col-start-10 flex flex-col items-end max-[767px]:col-span-6 max-[767px]:col-start-7 max-[767px]:row-start-2 max-[767px]:self-end">
          <div className="overflow-hidden"><span ref={addMeta} className="block" style={hidden("100%")}>Chargement</span></div>
          <div className="overflow-hidden"><span ref={addMeta} className="block tabular-nums" style={hidden("100%")}><span ref={counterRef}>0%</span></span></div>
        </div>
      </div>
    </div>
  );
}
