import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ServicesAll from "@/components/sections/ServicesAll";
import ServiceReveal from "@/components/sections/ServiceReveal";
import FeaturedWork from "@/components/sections/FeaturedWork";
import { workItems } from "@/data/work";

export const metadata: Metadata = buildMetadata({
  title: "JÖRO Studio — Architecture intérieure & espaces hybrides durables",
  description:
    "JÖRO Studio conçoit et réalise des espaces hybrides haut de gamme : bureaux, hôtellerie, résidentiel. Design contemporain et engagement écologique depuis 2022.",
  alternates: { canonical: "/" },
});

export default function HomePage() {
  const featuredWork = workItems.filter((w) => w.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Hero
        eyebrow="Architecture & Design d'intérieur"
        title={<>Concevoir les espaces<br />hybrides de demain</>}
        video="/vidéos/final.mp4"
        scrollCta="Découvrir notre studio"
      />

      {/* À propos — Notre histoire */}
      <section className="py-[80px] min-[1020px]:py-[200px] bg-[#F3F2ED] overflow-hidden">

        {/* ROW TEXTES — sous 1020 : stack avec gap 50px / ≥1020 : 2 colonnes gap 30px */}
        <div className="flex flex-col gap-[50px] min-[1020px]:flex-row min-[1020px]:gap-[30px]">
          {/* Texte gauche : pill + titre — padding 20 sous 840, 40 entre 840-1439, 60 ≥1440 */}
          <div className="flex-1 min-[1440px]:flex-[1129_1_0%] min-[1020px]:max-w-[1129px] flex flex-col pl-[20px] min-[840px]:pl-[40px] min-[1440px]:pl-[60px]" style={{ gap: 10 }}>
            <div
              className="inline-flex self-start items-center justify-center"
              style={{
                paddingLeft: 19,
                paddingRight: 19,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 10000,
                outline: "1px black solid",
                outlineOffset: "-1px",
              }}
            >
              <span
                style={{
                  textAlign: "center",
                  color: "#1C2626",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                NOTRE HISTOIRE
              </span>
            </div>
            <h2
              className="font-semibold tracking-tight text-[46px] min-[1020px]:text-[64px]"
              style={{ color: "#1C2626", lineHeight: "130%" }}
            >
              Une réflexion <br className="hidden min-[1020px]:inline min-[1601px]:hidden" />architecturale
            </h2>
          </div>
          {/* Texte droite : description — padding 20 sous 840, 40 entre 840-1019, puis pl-0 + pr 40/60 ≥1020. Bornes 660/760 ≥1440 */}
          <div className="flex-1 min-[1440px]:flex-[761_1_0%] min-[1440px]:min-w-[660px] min-[1440px]:max-w-[760px] min-[1020px]:pt-[36px] px-[20px] min-[840px]:px-[40px] min-[1020px]:pl-0 min-[1020px]:pr-[40px] min-[1440px]:pr-[60px]">
            <p
              className="font-medium text-[14px] leading-[24px] min-[1020px]:text-[16px] min-[1020px]:leading-[26px]"
              style={{ color: "#1C2626" }}
            >
              Notre studio est né d&rsquo;un constat simple : il est aujourd&rsquo;hui difficile de concevoir des espaces qui allient innovation, élégance et respect de l&rsquo;environnement. Pour répondre à ce défi, nous avons créé JORO Studio, une approche nouvelle de l&rsquo;architecture et des travaux où chaque projet est pensé dans les moindres détails afin de conjuguer qualité haut de gamme, design contemporain et responsabilité écologique.
            </p>
          </div>
        </div>

        {/* ROW IMAGES — edge-to-edge à toutes tailles. mt 50 sous 1020 / 130 ≥1020 ; 2 colonnes items-stretch ≥1020 */}
        <div className="mt-[50px] min-[1020px]:mt-[130px] flex flex-col gap-[30px] min-[1020px]:flex-row min-[1020px]:items-stretch">
          {/* Image gauche — sous 1020 : aspect 1020/560 (h=560 à viewport 1020 edge-to-edge, scale uniforme). 1020-1439 : h 370. ≥1440 : aspect 1129/592 */}
          <div className="flex-1 min-[1440px]:flex-[1129_1_0%] min-[1020px]:max-w-[1129px] relative aspect-[1020/560] min-[1020px]:aspect-auto min-[1020px]:h-[370px] min-[1440px]:h-auto min-[1440px]:aspect-[1129/592] overflow-hidden">
            <Image
              src="/images/1.png"
              alt="JÖRO Office — salle de réunion"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          {/* Image droite — cachée sous 1020. Flex équivalent 1020-1440, ratio 761 ≥1440. Copie la hauteur via items-stretch */}
          <div className="max-[1019px]:hidden flex-1 min-[1440px]:flex-[761_1_0%] min-[1440px]:min-w-[660px] min-[1440px]:max-w-[760px] relative aspect-[761/592] min-[1020px]:aspect-auto overflow-hidden">
            <Image
              src="/images/f11417fe33c2cc32ef0ecc7b3c1c059e.jpg"
              alt="JÖRO Studio — espace lounge"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

      </section>

      {/* Services — intro + 4 cartes dans le même conteneur sticky */}
      <ServicesAll />
      <div className="relative" style={{ height: "350vh", marginTop: "-100vh" }}>
        {/* Ancres absolues — non-sticky, position réelle dans le document */}
        <div id="amo" style={{ position: "absolute", top: 0 }} />
        <div id="marketing-suite" style={{ position: "absolute", top: "100vh" }} />
        <div id="conseil-workplace" style={{ position: "absolute", top: "200vh" }} />

        <div className="sticky top-0 h-screen" style={{ zIndex: 40 }}>
          <ServiceReveal
            activeId="amo"
            title="AMO"
            description="Assistance à maîtrise d'ouvrage : nous vous accompagnons à chaque étape de votre projet, de la définition du programme jusqu'à la livraison."
            video="/vidéos/Composition 1.mp4"
          />
        </div>
        <div className="sticky top-0 h-screen" style={{ zIndex: 50 }}>
          <ServiceReveal
            activeId="marketing-suite"
            title="MARKETING SUITE"
            description="Des espaces de démonstration et de commercialisation pensés pour valoriser vos actifs immobiliers et séduire vos futurs acquéreurs."
            image="/images/Frame 207.png"
            overlayClass="bg-[#1C2626]/20 mix-blend-color-burn"
          />
        </div>
        <div className="sticky top-0 h-screen" style={{ zIndex: 60 }}>
          <ServiceReveal
            activeId="conseil-workplace"
            title={"CONSEIL WORKPLACE &\nSTRATÉGIE IMMOBILIÈRE"}
            description="Nous vous aidons à définir votre stratégie immobilière, optimiser vos espaces de travail et anticiper les nouveaux usages urbains."
            video="/vidéos/vecteezy_4k-animation-angled-view-of-modern-building-with-clear-blue_40552327.mp4"
            flipX
            wide
            overlayClass="bg-[#1C2626]/20 mix-blend-soft-light"
          />
        </div>
      </div>

      <FeaturedWork items={featuredWork} />

      <Testimonials />

      <CTA />
    </>
  );
}
