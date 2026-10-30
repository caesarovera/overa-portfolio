# Overa Caesar — Portfolio (2026)

Personal portfolio of Overa Caesar, a senior PHP / Laravel developer (backend and
full stack) working on port operations systems. Single page, dark-first, with a
light theme, reduced-motion support and WCAG AA contrast on its colour tokens.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 ·
GSAP (ScrollTrigger) · Lenis (smooth scroll).

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Requires **Node 22** (pinned in `.nvmrc` and `engines`; CI and Vercel use the same).

---

## ✏️ Personalize before deploying

All editable content lives in **`src/lib/content.ts`**. One placeholder is
**still unfilled** and is shipping right now:

| Field | Current value | What to put | Why it matters |
| --- | --- | --- | --- |
| `site.url` | `https://your-domain.com` | your deployed domain | Feeds `metadataBase`, the canonical tag, OG/Twitter images, JSON-LD and the sitemap |

`site.email`, `site.github` and `site.linkedin` are filled in. The CV is
`public/CV_Overa_Caesar_EN.pdf`, linked from `site.cv` (hero and Contact). The
CV is also a source of record for the site: employer, job titles, location,
availability and skills should match it. Company names and dates
in `experience[]` and `work[]` are real — keep them that way or anonymise
deliberately. Do not add figures that cannot be backed by the CV or a project
record.

Then swap the images:

- `src/assets/profile.jpg` — the profile photo (780×1040, 3:4).
  Lives outside `public/` on purpose: it's imported statically so `next/image`
  can read its dimensions, generate the blur placeholder, and fail the build
  rather than 404 at runtime if it goes missing.
- `public/og.png` — social share image (1200×630), regenerated on 2026-10-07.
  It repeats the hero headline, so change it whenever the headline changes. It
  stays in `public/` because the metadata references it by absolute URL.

> Tip: the headline, bio, skills, case studies, and timeline
> data are **all** in `content.ts` — edit there, the UI follows.

---

## Fonts

Headings use **Clash Display**, body uses **Satoshi**, and mono uses **JetBrains
Mono**. All three are **self-hosted** — there are no runtime requests to
Fontshare or Google, which keeps two DNS + TLS handshakes off the critical path,
avoids leaking visitor IPs to third parties, and leaves `style-src`/`font-src`
free of external origins for a strict CSP.

Wiring lives in **`src/lib/fonts.ts`**; the `.woff2` files are in `src/fonts/`.
`next/font` emits the `@font-face` rules, hashes the filenames, preloads them and
generates a metric-matched fallback, then exposes `--font-display`,
`--font-body` and `--font-mono` via a class on `<html>` — which is why those
variables are **not** declared in `globals.css`.

Only the weights the stylesheet actually uses are shipped (Clash Display 500/600,
Satoshi 400/700, JetBrains Mono 400 — 88 KB total). **If you add a `font-weight`
to `globals.css`, add the matching file in `src/lib/fonts.ts` too**, or the
browser will synthesise the weight and it will look wrong.

Clash Display and Satoshi come from [fontshare.com](https://www.fontshare.com)
(free for commercial use, self-hosting permitted); JetBrains Mono is OFL and is
fetched from Google at **build** time, then served from your own origin.

---

## CI/CD

GitHub Actions (`.github/workflows/ci-cd.yml`) runs on every pull request and
every push to `main`:

| Job | Runs on | What it does |
| --- | --- | --- |
| **Verify** | PRs, `main` | `npm ci`, typecheck, lint (`--max-warnings=0`), production build, `npm audit --omit=dev --audit-level=high` |
| **Deploy preview** | PRs from this repo | Builds with the Vercel CLI and deploys a preview; the URL appears on the PR as a deployment |
| **Deploy production** | `main`, after Verify passes | Builds and deploys to production, then smoke-tests the live domain: HTTP 200, security headers, CV and sitemap |

Nothing deploys unless Verify passes. Vercel's own Git auto-deploy is switched
off in `vercel.json`, so Actions is the only path to production. Actions are
pinned to commit SHAs, the workflow token is read-only, and Dependabot
(`.github/dependabot.yml`) opens weekly grouped updates for npm and Actions.

**One-time setup** (repository → Settings → Secrets and variables → Actions):

| Name | Kind | Value |
| --- | --- | --- |
| `VERCEL_TOKEN` | Secret | A token from vercel.com/account/tokens, scoped to your account |
| `VERCEL_ORG_ID` | Variable | `orgId` from `.vercel/project.json` after `npx vercel link` |
| `VERCEL_PROJECT_ID` | Variable | `projectId` from the same file |
| `PRODUCTION_URL` | Variable | The production domain, e.g. `https://overa-portfolio.vercel.app` |

Until `VERCEL_PROJECT_ID` is set, the deploy jobs are skipped and only Verify
runs.

Internal project notes (handover, audit, design reviews, decision log) live in
`docs/`, which is kept out of the repository.

---

## Code quality

```bash
npm run typecheck  # next typegen && tsc --noEmit
npm run lint       # eslint . --max-warnings=0
```

Flat config in `eslint.config.mjs`, extending `next/core-web-vitals` +
`next/typescript` (71 rules). **Warnings fail the run on purpose** — the Next and
react-hooks rules that matter most (`no-img-element`, `exhaustive-deps`) ship as
warnings, so without `--max-warnings=0` the command would exit 0 while real
defects sat in the output. Both of those rules had in fact caught nothing here
for the life of the project, because no ESLint config existed and the script
dropped into an interactive wizard instead of running.

> **`npm audit` note.** A full `npm audit`, dev dependencies included, reports
> `found 0 vulnerabilities` as of 2026-10-30. Getting there took `next@15.5.28`
> plus two `overrides` (`postcss >=8.5.18`, `sharp >=0.35.5`), because the copies
> Next bundles lag behind their own patches (the `sharp` one closes a critical
> RCE in the image optimiser). **Keep those overrides** until Next ships the fixed
> versions itself, and re-verify the image optimiser if you touch the `sharp`
> one — it is a native binary and a bad override fails at runtime, not at build.
> New advisories keep appearing, so re-run `npm audit` before every deploy. Never
> run `npm audit fix --omit=dev`: it prunes every dev dependency from
> `node_modules`.

---

## Project structure

```
src/
  app/
    layout.tsx        # metadata, SEO (OG, JSON-LD Person), theme no-flash script, providers
    page.tsx          # section composition order
    globals.css       # design system (tokens, components, reduced-motion)
    sitemap.ts        # SEO sitemap
  components/
    Providers.tsx     # Lenis smooth scroll wired into the GSAP ticker
    Loader.tsx        # count-up loading screen + wipe
    ScrollProgress.tsx# top progress bar
    Nav.tsx           # brand, links, theme toggle, mobile menu (focus trap + scroll lock)
    Reveal.tsx        # scroll-reveal wrapper (GSAP)
    Counter.tsx       # animated stat counter — renders the FINAL value on the server
    ProfilePhoto.tsx  # About photo: clip-path reveal, parallax, next/image
    sections/
      Hero · About · Skills · Work · Stats · Experience · Contact · Footer
  lib/
    content.ts        # ← ALL site content + placeholders
    fonts.ts          # next/font wiring — owns --font-display / --font-body / --font-mono
    intro.ts          # loading-screen session flag, shared by layout, Loader and Hero
  fonts/              # self-hosted .woff2 (Clash Display, Satoshi)
  assets/
    profile.jpg       # statically imported by next/image
vercel.json           # disables Vercel's Git auto-deploy (Actions deploys instead)
.github/
  workflows/ci-cd.yml # verify → deploy preview / production → smoke test
  dependabot.yml
public/
  og.png · favicon.ico · favicon.svg
  CV_Overa_Caesar_EN.pdf  # linked from site.cv
```

---

## Design & motion notes

- **One accent colour** — signal lime (`--accent: #c8ff3d`), deepened automatically
  in light mode for AA contrast. All theming flows through CSS variables in
  `globals.css`; the `[data-theme="light"]` block overrides the palette.
- **Smooth scroll** via Lenis, sharing a single RAF loop with GSAP ScrollTrigger.
- **Sticky stacked case studies** — four featured `.case` cards are
  `position: sticky` and scale down slightly as the next one stacks over them
  (`Work.tsx`). Each carries an architecture diagram from its `diagram` field in
  `content.ts`, in place of screenshots of internal software. Every diagram entry
  must trace to the same project's `stack` or `rows`.
- **Motion is kept small** — the loading screen (once per session) handing off
  to the hero's letter reveal, one scroll reveal, the case stacking and the
  photo reveal. No custom cursor, background blobs, grain, marquee, tilt or
  magnetic buttons.
- **Accessibility / reduced motion** — every animation checks
  `prefers-reduced-motion: reduce`. In that mode the loader is skipped, smooth
  scroll is disabled, and content renders statically.
  Semantic HTML, keyboard-navigable controls, visible focus, and ARIA labels
  throughout.
- **SEO** — full metadata, Open Graph image, Twitter card, JSON-LD `Person`, and a
  sitemap. Update `site.url` so absolute URLs resolve.

---

## Switching copy to Bahasa Indonesia

All UI copy is centralized in `src/lib/content.ts`, with **one** documented
exception: the three About paragraphs live in `About.tsx`, because each carries
its own inline emphasis markup. (`Hero.tsx` and `Skills.tsx` used to hold stray
strings too; those were pulled into `content.ts` on 2026-07-27.)

To target an Indonesian audience, translate `content.ts` plus that one component
— no structural changes needed.

---

© 2026 Overa Caesar
