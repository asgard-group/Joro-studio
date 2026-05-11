import Link from "next/link";
import Image from "next/image";
import { footerLinks } from "@/data/navigation";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cream-300 bg-charcoal text-cream">
      <div className="container-site py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logos/logo-white.svg"
                alt="JÖRO Studio"
                width={130}
                height={36}
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              Architecture intérieure & espaces hybrides haut de gamme. Design
              contemporain, engagement écologique.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.linkedin.com/company/joro-studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JÖRO Studio sur LinkedIn"
                className="text-cream/40 transition-colors hover:text-cream"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/jorostudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JÖRO Studio sur Instagram"
                className="text-cream/40 transition-colors hover:text-cream"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Nos offres
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.offres.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/60 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Studio
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.studio.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/60 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Contact
            </h3>
            <address className="not-italic">
              <p className="text-sm text-cream/60">Paris, France</p>
              <a
                href="mailto:contact@jorostudio.fr"
                className="mt-2 block text-sm text-cream/60 transition-colors hover:text-cream"
              >
                contact@jorostudio.fr
              </a>
            </address>
            <div className="mt-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
                Légal
              </h3>
              <ul className="flex flex-col gap-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/60 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-cream/30">
            © {year} JÖRO Studio. Tous droits réservés.
          </p>
          <p className="text-xs text-cream/20">
            Architecture intérieure • Rénovation • Espaces hybrides
          </p>
        </div>
      </div>
    </footer>
  );
}
