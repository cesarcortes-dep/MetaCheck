@AGENTS.md
# MetaCheck — Project Context & Continuity

You are helping me build MetaCheck, a Next.js 14 web application that analyzes any URL's meta tags and shows how the site will appear on Google, Facebook, Twitter/X, and LinkedIn. Before generating any code, internalize the full context below.

## Project Overview

**Name:** MetaCheck
**Purpose:** Analyze meta tags, Open Graph, Twitter Cards, and schema.org for any public URL. Generate visual previews of how the site will appear on Google SERP, Facebook, Twitter/X, and LinkedIn. Output a technical report with a score and a downloadable PDF.
**Target users:** Local business owners, junior marketers, freelancers, small agencies.
**Business goal:** Serve as a lead magnet and portfolio piece for my marketing agency. MUST be demoable in 30 seconds, must work without login, must lead to a CTA toward my agency.
**Time budget:** 5-10 hours per week. Aim for MVP in 2 weeks (10 nights of work).

## MVP Scope (what we ARE building)

- URL input → scrapes public HTML
- Parses: title, description, canonical, og:*, twitter:*, schema.org (JSON-LD), h1/h2, imgs without alt, favicon
- Renders 4 visual previews: Google SERP snippet, Facebook card, Twitter card, LinkedIn card
- Technical report with score (0-100) and checklist (SEO / Open Graph / Twitter / Structured Data)
- Downloadable PDF with the analysis
- Rate limiting via Upstash Redis
- Basic landing page with CTA to the agency

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
- Named exports ONLY — no default exports
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

## Current Status

I will tell you which night we are on at the start of each session. The full 10-night plan is:

- **Night 1:** Project scaffolding (Next.js + Tailwind + folder structure + deploy) — DONE
- **Night 2:** UI base components (Button, Input, Card, Badge, Spinner, Tabs) with design tokens
- **Night 3:** Scraping and parsing API (`/api/analyze` with cheerio, returns structured JSON)
- **Night 4:** URL input form UI + dispatch to API + loading states + Context for results
- **Night 5:** Google SERP preview + Facebook preview components
- **Night 6:** Twitter preview + LinkedIn preview + Tabs navigation
- **Night 7:** Technical report with score calculation and checklist
- **Night 8:** PDF generation with @react-pdf/renderer
- **Night 9:** Rate limiting (Upstash) + error handling + app-level SEO/metadata
- **Night 10:** Landing page + README + launch prep

At the start of each session I'll tell you the current night and any relevant state. Assume everything from previous nights is already implemented and working unless I say otherwise.

## How to Help Me

1. **Ask clarifying questions before generating code** if the task is ambiguous
2. **Follow every convention above without deviation** — if you think a convention should be broken, ASK first
3. **Generate complete, working code** — no placeholders like `// TODO: implement later` unless I explicitly ask
4. **Explain trade-offs** when you make non-obvious technical decisions
5. **Propose verification steps** at the end of each task (lint, typecheck, build, visual check)
6. **Use the folder structure strictly** — don't create files outside the defined structure
7. **Suggest commit messages** following Conventional Commits
8. **Flag scope creep** — if I ask for something that's in the "out of scope" list, remind me it's v2

## Out-of-Scope Requests

If I ask for something that contradicts this document (new framework, login system, AI features, etc.), remind me gently and ask if I want to update the scope document before proceeding.

---

**Ready. Tell me which night we're working on and what specific task you'd like help with.**