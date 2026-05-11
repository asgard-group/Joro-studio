# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Development server at http://localhost:3000
npm run build    # Production build (standalone output for Netlify)
npm run start    # Run production build locally
npm run lint     # ESLint check
```

No test suite is configured.

## Architecture

**Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, deployed on Netlify via `@netlify/plugin-nextjs`.

**Data flow:** All content (services, portfolio, navigation, testimonials, blog) lives in `data/*.ts` files as typed arrays. Pages import from these files directly — no CMS, no API calls. To add or update content, edit the corresponding data file and the page will reflect it automatically. TypeScript interfaces for all data shapes are in `types/index.ts`.

**Page structure:** Each route under `app/` is a server component. The root `app/layout.tsx` wraps all pages with `<Header>` and `<Footer>`. Reusable section components live in `components/sections/`, UI primitives in `components/ui/`.

**Metadata:** Use `buildMetadata()` from `lib/metadata.ts` (wraps Next.js `Metadata`) in each page's `export const metadata`. Site-wide defaults (title, OG image, URL, locale) are in `lib/metadata.ts` `siteConfig`.

**Header behavior:** `components/layout/Header.tsx` is a client component that listens to scroll position. It starts transparent with white logo and switches to cream background with dark logo after scrolling past 50px. `Navigation.tsx` also receives the scroll state to switch link colors.

## Design System

Custom Tailwind colors (defined in `tailwind.config.ts`):
- `cream` — light beige backgrounds (primary background)
- `terracotta` — warm brown/red accent (`#812403` base), used for CTAs and highlights
- `charcoal` — near-black for dark sections and text (`#1C1A18` base)

Custom font: **GeneralSans Variable**, loaded locally from `public/fonts/` via `next/font/local` in `app/layout.tsx` as CSS variable `--font-general-sans`.

Path alias `@/*` resolves to the project root (configured in `tsconfig.json`).

## Services & Portfolio

The four JÖRO service lines are defined in `data/services.ts`: **Office**, **Meeting**, **Living**, and **Studio**. Navigation dropdown items in `data/navigation.ts` link to their individual service pages under `app/services/[slug]/`.

Portfolio projects in `data/work.ts` have a `featured: boolean` field — the homepage shows only the 3 featured items. Project images reference `/images/work/portfolio-N.jpg` under `public/`.

## Deployment

Netlify config is in `netlify.toml`. The Next.js config uses `output: "standalone"` to produce a self-contained bundle. Environment variables required at build time are documented in `.env.example`.
