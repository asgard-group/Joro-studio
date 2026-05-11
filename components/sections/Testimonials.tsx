import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-cream-200 py-24">
      <div className="container-site">
        <div className="mb-16 max-w-xl">
          <p className="label-eyebrow mb-4">Témoignages</p>
          <h2 className="heading-section">
            Ce que disent nos clients
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="flex flex-col gap-6 bg-cream p-8"
            >
              {/* Opening quote mark */}
              <svg
                className="h-8 w-8 text-terracotta/30"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V8z" />
              </svg>
              <p className="flex-1 text-base leading-relaxed text-charcoal-light">
                {t.quote}
              </p>
              <footer>
                <p className="font-semibold text-charcoal">{t.author}</p>
                <p className="text-sm text-charcoal-muted">
                  {t.role} — {t.company}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
