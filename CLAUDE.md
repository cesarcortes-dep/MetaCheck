@AGENTS.md
# MetaCheck — Project Context

You are helping build MetaCheck, a Next.js 14+ web application that analyzes any URL's meta tags and shows how the site will appear on Google, Facebook, Twitter/X, and LinkedIn. Before generating any code, internalize the full context below.

> Local-only personal notes (work cadence, nightly plan, current status) live in `.claude/notes.md` — gitignored. Read that at session start to know where we are in the build.

## Project Overview

**Name:** MetaCheck
**Purpose:** Analyze meta tags, Open Graph, Twitter Cards, and schema.org for any public URL. Generate visual previews of how the site will appear on Google SERP, Facebook, Twitter/X, and LinkedIn. Output a technical report with a score and a downloadable PDF.
**Target users:** Local business owners, junior marketers, freelancers, small agencies.

## MVP Scope (what we ARE building)

- URL input → scrapes public HTML
- Parses: title, description, canonical, og:*, twitter:*, schema.org (JSON-LD), h1/h2, imgs without alt, favicon
- Renders 4 visual previews: Google SERP snippet, Facebook card, Twitter card, LinkedIn card
- Technical report with score (0-100) and checklist (SEO / Open Graph / Twitter / Structured Data)
- Downloadable PDF with the analysis
- Rate limiting via Upstash Redis
- Landing page with CTA

## Out of Scope (do NOT build these)

- Login / accounts / persistence
- Full-site crawling (only the given URL)
- Core Web Vitals / Lighthouse integration (v2)
- AI-powered suggestions (v2 — this MVP has NO Claude API usage)
- Custom branding per client on PDF (v2)
- Screenshot of actual website (v2)
- Mobile-first optimization beyond responsive basics

## Tech Stack (non-negotiable)

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript strict mode (no `any`, no non-null assertions)
- **Styling:** Tailwind CSS
- **UI primitives:** Radix UI (@radix-ui/react-*)
- **Variants:** class-variance-authority (cva)
- **Class merging:** clsx + tailwind-merge (via `cn` helper in `lib/utils.ts`)
- **HTML parsing:** cheerio
- **Validation:** Zod
- **Icons:** lucide-react
- **PDF:** @react-pdf/renderer (not Puppeteer)
- **Rate limiting:** Upstash Redis (@upstash/redis, @upstash/ratelimit)
- **Theme:** next-themes (light/dark, class-based)
- **Package manager:** pnpm
- **Node:** 20+
- **Deployment:** Vercel (auto-deploy on push to main)

## Code Conventions (strict)

**Folder structure (by-type):**
```
app/              # Next.js App Router routes
  api/            # API route handlers
components/
  ui/             # Primitives (Button, Input, Card, Badge, Spinner, Tabs)
  shared/         # App-wide shared components
features/
  [feature]/      # Feature-scoped components, hooks, logic
    components/
    hooks/
    lib/
hooks/            # Global reusable hooks
services/         # Data fetching layer (fetch wrappers, API clients)
context/          # React Context providers
types/            # Global TypeScript types
lib/              # Utilities and helpers
public/           # Static assets
```

**Component conventions:**
- Always use `forwardRef` where refs make sense
- Always accept `className` and merge via `cn()`
- Always set `displayName`
- Named exports ONLY — no default exports (except Next's required `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `not-found.tsx`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`)
- Use cva for variants — no inline ternaries for styling
- Use Radix primitives for anything that needs accessibility (dialogs, tabs, selects, etc.)

**State management priority:**
1. Server Components first
2. React Context API for shared client state
3. Redux Toolkit ONLY if justified by complexity
(Redux is NOT justified for this project — use Context)

**Data fetching:**
- API routes for backend logic
- TanStack Query via `services/` layer if client-side fetching is needed
- For this project, Server Actions or simple fetch inside Client Components is acceptable

**TypeScript:**
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- No `any`, no `as` type assertions unless absolutely necessary
- Prefer `type` for unions, `interface` for object shapes that may be extended

**Git workflow:**
- GitHub Flow (main is always deployable)
- Feature branches for new work: `feat/preview-google`, `fix/parsing-edge-case`
- Commit convention: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)
- Push frequently — Vercel auto-deploys preview URLs from feature branches

## Internal documentation

There's a `docs/` folder (gitignored) with a living technical doc — one file per feature slice plus `architecture.md` as the index. After completing or materially changing a feature, update the relevant doc in the same session. See `docs/architecture.md` for the current map.

## How to Help Me

1. **Ask clarifying questions before generating code** if the task is ambiguous.
2. **Follow every convention above without deviation** — if you think a convention should be broken, ASK first.
3. **Generate complete, working code** — no placeholders like `// TODO: implement later` unless I explicitly ask.
4. **Explain trade-offs** when you make non-obvious technical decisions.
5. **Propose verification steps** at the end of each task (lint, typecheck, build, visual check).
6. **Use the folder structure strictly** — don't create files outside the defined structure.
7. **Suggest commit messages** following Conventional Commits.
8. **Flag scope creep** — if I ask for something that's in the "out of scope" list, remind me it's v2.

## Out-of-Scope Requests

If I ask for something that contradicts this document (new framework, login system, AI features, etc.), remind me gently and ask if I want to update the scope document before proceeding.
