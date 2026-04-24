# MetaCheck

Preview your site on Google, Facebook, Twitter, and LinkedIn. Paste a URL, see exactly how the page will render when shared on each platform, and get a scored technical report that you can download as a PDF.

**Live:** https://meta-check-two.vercel.app

---

## Features

- **Four faithful platform previews.** Google SERP snippet, Facebook OG card, Twitter / X summary card (both `summary` and `summary_large_image`), and LinkedIn feed card — styled to match each platform's actual rendering rules.
- **Technical score (0–100).** Four categories (SEO, Open Graph, Twitter, Structured Data) with per-check pass / warn / fail status and explanations of what's missing.
- **Downloadable PDF report.** Client-side generation with `@react-pdf/renderer`, lazy-loaded so it doesn't bloat the initial bundle. No account needed.
- **Light / dark theme** with class-based switching via `next-themes`; follows system preference by default.
- **Privacy-respecting.** No login, no tracking, nothing stored between requests. Per-IP sliding-window rate limiting on the public endpoint (Upstash Redis).
- **Safety.** Outbound fetches are guarded against SSRF (private, loopback, link-local, and cloud-metadata IPs all blocked, including across redirects).

---

## Tech stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript (strict + `noUncheckedIndexedAccess` + `noImplicitOverride`) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) with HSL-based design tokens, class-based dark mode |
| UI primitives | [Radix UI](https://www.radix-ui.com/) (Tabs, Label, Slot), icons via [lucide-react](https://lucide.dev/) |
| HTML parsing | [cheerio](https://cheerio.js.org/) |
| Validation | [Zod 4](https://zod.dev/) |
| PDF | [@react-pdf/renderer](https://react-pdf.org/) (lazy-loaded) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |
| Rate limiting | [@upstash/ratelimit](https://github.com/upstash/ratelimit) + Upstash Redis |
| Package manager | [pnpm](https://pnpm.io/) |
| Runtime | Node 20+ |
| Hosting | [Vercel](https://vercel.com/) (auto-deploy on `main`) |

---

## How it works

```
Browser  →  Next.js serverless function on Vercel  →  Target site
   ←     JSON: every meta tag grouped + scored     ←     HTML
```

The analyze endpoint is public (no auth). For each request it:

1. Validates the input with Zod.
2. Runs an SSRF guard on the target hostname (DNS resolve → block private/loopback/link-local ranges).
3. Fetches the HTML with an 8-second timeout, 2 MB body cap, and manual redirect handling (every redirect hop is re-checked by the SSRF guard).
4. Parses the HTML with cheerio and extracts title, description, canonical, all `og:*` tags, all `twitter:*` tags, JSON-LD blocks, `<h1>` / `<h2>` text, and image alt coverage.
5. Returns a structured JSON response.

The client then renders the four preview cards and the scored checklist from the same JSON.

We **do not execute JavaScript** on the target page. What we see is what crawlers see — which is the point: it tells you how Googlebot, Facebook's OG scraper, and Twitter's card validator will actually render your page.

---

## Local development

Requires **Node 20+** and **pnpm**.

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

### Environment variables

Copy the template:

```bash
cp .env.example .env.local
```

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL used in metadata, sitemap, robots |
| `UPSTASH_REDIS_REST_URL` | Production | Rate limiting (missing in dev → disabled with a warning) |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Rate limiting auth |

---

## Project structure

```
app/                       Next.js routes
  api/analyze/route.ts     POST — backend entrypoint
  opengraph-image.tsx      Dynamic OG image (1200×630)
  robots.ts / sitemap.ts   Metadata routes
  error.tsx                Global client error boundary
  not-found.tsx            Branded 404
  layout.tsx / page.tsx    Root layout + landing page
components/
  ui/                      Design-system primitives (Button, Input, Card, …)
  shared/                  SiteHeader, SiteFooter, ThemeToggle
features/
  analyze/                 URL analysis slice — form, previews, scoring, PDF
    components/previews/   google / facebook / twitter / linkedin / missing-field
    components/report/     score-banner, checklist, download-pdf-button
    lib/                   parser (cheerio), scoring, preview-helpers
    pdf/                   React-PDF Document
  landing/                 Landing page sections (hero, features, how-it-works, cta)
context/                   Theme + analyze state providers
lib/                       Pure helpers — cn, normalize-url, ssrf-guard, fetch-html, scoring, rate-limit, site-url
services/                  Typed fetch wrapper for /api/analyze
types/                     Shared TypeScript types
```

---

## Scripts

```bash
pnpm dev     # dev server on :3000 (Turbopack)
pnpm build   # production build + TypeScript check
pnpm start   # serve the built output
pnpm lint    # ESLint across the project
```

---

## Built by

**Cesar Cortes** — [LinkedIn](https://www.linkedin.com/in/c%C3%A9sar-mateo-cort%C3%A9s-le%C3%B3n-b823a2206/) · <cesarcortes4@outlook.com>

Part of [Growing Lab](#) — marketing for small businesses and freelancers. Get in touch through the CTA on the live site, LinkedIn, or email.
