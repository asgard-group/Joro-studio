import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/data/navigation";
import ComingSoonLink from "@/components/ui/ComingSoonLink";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream -mt-px">
      <div className="px-4 sm:px-6 lg:px-[60px] py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-12">

          {/* Col 1 — Logo */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block" aria-label="JÖRO Studio — retour à l'accueil">
              <Image
                src="/images/logos/joro-studio-vertical-blanc-RVB 1.png"
                alt="JÖRO Studio"
                width={160}
                height={160}
                className="w-[120px] h-auto lg:w-[160px]"
              />
            </Link>
          </div>

          {/* Col 2 — Nos offres */}
          <div>
            <h3 className="mb-5 text-[13px] font-medium text-cream/50">
              Nos offres
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.offres.map((link) => (
                <li key={link.href}>
                  <ComingSoonLink className="text-[11px] font-medium uppercase tracking-[0.12em] text-cream/50">
                    {link.label}
                  </ComingSoonLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Notre studio */}
          <div>
            <h3 className="mb-5 text-[13px] font-medium text-cream/50">
              Notre studio
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.studio.map((link) => (
                <li key={link.href}>
                  <ComingSoonLink className="text-[11px] font-medium uppercase tracking-[0.12em] text-cream/50">
                    {link.label}
                  </ComingSoonLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Nous suivre */}
          <div>
            <h3 className="mb-5 text-[13px] font-medium text-cream/50">
              Nous suivre
            </h3>
            {/* Social icons */}
            <div className="flex items-center gap-4 mb-8">
              <a
                href="https://www.instagram.com/joro_studio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JÖRO Studio sur Instagram"
                className="text-cream transition-colors hover:text-cream/60"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/joro-studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JÖRO Studio sur LinkedIn"
                className="text-cream transition-colors hover:text-cream/60"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://fr.pinterest.com/joro_studio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JÖRO Studio sur Pinterest"
                className="text-cream transition-colors hover:text-cream/60"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
            </div>

            {/* Legal links */}
            <ul className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <ComingSoonLink className="text-[12px] text-cream/25">
                    {link.label}
                  </ComingSoonLink>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
