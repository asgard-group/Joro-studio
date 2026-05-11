# JÖRO Studio — Site web

Site vitrine professionnel B2B pour JÖRO Studio — architecture intérieure & espaces hybrides.

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS  
**Déploiement :** Netlify

---

## Structure du projet

```
├── app/                    # Pages (App Router)
│   ├── layout.tsx          # Layout global (Header + Footer)
│   ├── page.tsx            # Accueil
│   ├── about/page.tsx      # À propos
│   ├── services/page.tsx   # Nos offres (JÖRO Office, Meeting, Living, Studio)
│   ├── work/               # Portfolio
│   │   ├── page.tsx
│   │   └── [id]/page.tsx   # Détail réalisation
│   ├── blog/page.tsx       # Blog & Insights
│   ├── contact/page.tsx    # Contact
│   ├── privacy/page.tsx    # Mentions légales & RGPD
│   ├── terms/page.tsx      # CGU
│   ├── sitemap.ts          # Sitemap auto-généré
│   └── robots.ts           # Robots.txt
│
├── components/
│   ├── layout/             # Header, Footer, Navigation
│   ├── sections/           # Hero, CTA, Testimonials, FAQ
│   └── ui/                 # Button, Card, Input, Textarea
│
├── data/                   # Contenu statique (navigation, services, portfolio, blog)
├── lib/                    # Utilitaires (cn, formatDate, metadata builder)
├── types/                  # Types TypeScript partagés
└── public/images/          # Assets (à remplir avec vos photos)
```

---

## Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-org/joro-studio.git
cd joro-studio

# 2. Installer les dépendances
npm install

# 3. Copier les variables d'environnement
cp .env.example .env.local
# Renseigner les valeurs dans .env.local

# 4. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

---

## Déploiement Netlify

### Première mise en production

1. Connecter le dépôt GitHub à Netlify (New site from Git)
2. Vérifier les paramètres de build :
   - **Build command :** `npm run build`
   - **Publish directory :** `.next`
   - **Node version :** 20
3. Installer le plugin Next.js : `@netlify/plugin-nextjs` (déjà déclaré dans `netlify.toml`)
4. Ajouter les variables d'environnement dans Netlify UI (Settings → Environment variables)
5. Déclencher un premier déploiement

### Déploiements suivants

Chaque push sur `main` déclenche automatiquement un déploiement.

---

## Contenu à compléter avant le lancement

### Images (priorité haute)
Placer vos photos dans `public/images/` en suivant les chemins référencés dans `data/` :
- `hero-main.jpg` — Photo hero page d'accueil
- `studio-intro.jpg` — Photo section "À propos" accueil
- `about-team.jpg` — Photo équipe / fondateur
- `office-cover.jpg`, `meeting-cover.jpg`, `living-cover.jpg`, `studio-cover.jpg` — Covers offres
- `work/` — Photos par projet (nommées selon les `coverImage` dans `data/work.ts`)
- `blog/` — Covers articles
- `og-default.jpg` — Image Open Graph (1200×630)

### Données
- `data/services.ts` — Ajuster descriptions et features
- `data/work.ts` — Ajouter vos projets réels
- `data/blog.ts` — Ajouter les vrais articles
- `data/testimonials.ts` — Ajouter les vrais témoignages

### Formulaire de contact
Dans `app/contact/ContactForm.tsx`, remplacer le `setTimeout` placeholder par votre intégration :
- **Formspree** : `https://formspree.io/f/your-id`
- **Resend** : API route Next.js + SDK Resend
- **Netlify Forms** : ajouter `data-netlify="true"` sur la balise `<form>`

### Intégrations à configurer
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` pour Google Analytics
- `NEWSLETTER_API_KEY` pour Brevo / Mailchimp
- Calendly : ajouter un widget de prise de RDV dans la page Contact

---

## Étapes avant le lancement

- [ ] Remplacer toutes les images placeholder
- [ ] Vérifier textes, mentions légales et politique RGPD avec un juriste
- [ ] Renseigner les vraies données (projets, blog, témoignages)
- [ ] Brancher le formulaire de contact
- [ ] Configurer le domaine custom dans Netlify
- [ ] Activer les redirections HTTPS dans Netlify
- [ ] Tester Lighthouse (objectif : score > 90)
- [ ] Vérifier l'accessibilité (RGAA niveau AA)
- [ ] Soumettre le sitemap dans Google Search Console

---

## Commandes utiles

```bash
npm run dev      # Développement local
npm run build    # Build de production
npm run start    # Serveur de production local
npm run lint     # Linting ESLint
```
