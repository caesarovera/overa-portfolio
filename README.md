# Overa Caesar — Portfolio (2026)

Personal portfolio of Overa Caesar, a senior PHP / Laravel developer (backend and
full stack) working on port operations systems. Single page, dark-first, with a
light theme, reduced-motion support and WCAG AA contrast on its colour tokens
(one hard-coded exception is open: [F40](docs/AUDIT-2026-07-26.md#f40)).

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

Requires **Node 18.18+** (Node 20+ recommended).

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
deliberately, but see the note on unverified claims in
[`HANDOVER.md`](docs/HANDOVER.md#still-blocked-on-real-data).

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

## Documentation

| Document | What it is for |
| --- | --- |
| [`docs/CODE-GUIDE.md`](docs/CODE-GUIDE.md) | **New to Next.js?** Start here — setup, how the code works and why, what every dependency is for |
| [`docs/HANDOVER.md`](docs/HANDOVER.md) | Current state, what to pick up next, traps to know before editing |
| [`docs/AUDIT-2026-07-26.md`](docs/AUDIT-2026-07-26.md) | Full engineering audit — 40 findings with evidence, and what was explicitly *not* verified |
| [`docs/DESIGN-REVIEW-2026-09-16.md`](docs/DESIGN-REVIEW-2026-09-16.md) | Design & hiring-effectiveness review — 10 findings, screenshot-driven, with a phased plan to fix them |
| [`docs/SLOP-REVIEW-2026-09-22.md`](docs/SLOP-REVIEW-2026-09-22.md) | Review in Bahasa Indonesia: unsupported claims, template visuals, generic copy |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Why the non-obvious things are the way they are, and what was rejected |
| [`docs/archive/`](docs/archive/) | Superseded reviews, kept for history |

---

## Code quality

```bash
npm run lint     # eslint . --max-warnings=0
```

Flat config in `eslint.config.mjs`, extending `next/core-web-vitals` +
`next/typescript` (71 rules). **Warnings fail the run on purpose** — the Next and
react-hooks rules that matter most (`no-img-element`, `exhaustive-deps`) ship as
warnings, so without `--max-warnings=0` the command would exit 0 while real
defects sat in the output. Both of those rules had in fact caught nothing here
for the life of the project, because no ESLint config existed and the script
dropped into an interactive wizard instead of running.

> **`npm audit` note.** Production dependencies are **clean** as of 2026-10-07 —
> `npm audit --omit=dev` reports `found 0 vulnerabilities`. Getting there took
> `next@15.5.27` plus two `overrides` (`postcss >=8.5.18`, `sharp >=0.35.5`),
> because the bundled copies lag behind their own patches; see
> [F18](docs/AUDIT-2026-07-26.md#f18) and [F39](docs/AUDIT-2026-07-26.md#f39). **Keep those overrides** until Next ships
> the fixed versions itself, and re-verify the image optimiser if you touch the
> `sharp` one — it is a native binary and a bad override fails at runtime, not at
> build. The dev tree still reports 7 high advisories via the lint tooling —
> `brace-expansion`, `braces` / `micromatch` / `fast-glob` and `js-yaml` (all
> DoS through hostile input). None ship to production. For `brace-expansion`: That one is deliberately
> **not** overridden: it reaches the tree as CommonJS through `minimatch@3`, the
> patched 5.0.8 is ESM, and the exposure is a glob pattern you write yourself in
> your own config. Forcing it risks breaking the linter to fix something
> unreachable. Re-check when `eslint-config-next` moves off `minimatch@3`. Never run
> `npm audit fix --omit=dev`: it prunes every dev dependency from `node_modules`.

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
    Cursor.tsx        # custom cursor (dot + lagging ring)
    Aurora.tsx        # parallax gradient blobs
    Grain.tsx         # film-grain overlay
    ScrollProgress.tsx# top progress bar
    Nav.tsx           # brand, links, theme toggle, mobile menu (focus trap + scroll lock)
    MagneticButton.tsx# magnetic CTA
    Reveal.tsx        # scroll-reveal wrapper (GSAP)
    Counter.tsx       # animated stat counter — renders the FINAL value on the server
    ProfilePhoto.tsx  # About photo: clip-path reveal, parallax, next/image
    sections/
      Hero · About · Skills · Work · Stats · Marquee · Experience · Contact · Footer
  lib/
    content.ts        # ← ALL site content + placeholders
    fonts.ts          # next/font wiring — owns --font-display / --font-body / --font-mono
    intro.ts          # loading-screen session flag, shared by layout, Loader and Hero
  fonts/              # self-hosted .woff2 (Clash Display, Satoshi)
  assets/
    profile.jpg       # statically imported by next/image
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
- **Sticky stacked case studies** — `.case` cards are `position: sticky` and scale
  down slightly as the next one stacks over them (`Work.tsx`).
- **Accessibility / reduced motion** — every animation checks
  `prefers-reduced-motion: reduce`. In that mode the loader is skipped, smooth
  scroll is disabled, the custom cursor is off, the marquee stops, and content
  renders statically.
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
