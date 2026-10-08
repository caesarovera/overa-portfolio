# Handover

**Last updated:** 2026-10-08

Where the project stands and what to pick up next. For the full findings see
[`AUDIT-2026-07-26.md`](./AUDIT-2026-07-26.md); for why things are built the way
they are, [`DECISIONS.md`](./DECISIONS.md). New to this stack? Read
[`CODE-GUIDE.md`](./CODE-GUIDE.md) first. The content and design critique lives in
[`DESIGN-REVIEW-2026-09-16.md`](./DESIGN-REVIEW-2026-09-16.md) and
[`SLOP-REVIEW-2026-09-22.md`](./SLOP-REVIEW-2026-09-22.md).

---

## Current state

Re-measured 2026-10-08:

```
tsc --noEmit          clean
npm run lint          exit 0   (71 rules, --max-warnings=0)
npm run build         exit 0   (no warnings; the "Experiments" notice is gone with F37)
First Load JS         162 kB
Route /                10.2 kB
npm audit --omit=dev  found 0 vulnerabilities   (next 15.5.27, sharp 0.35.5)
HTTP  /_next/image (384/640/1080)   200 image/webp · 11.7 / 30.9 / 44.9 kB
HTTP  /CV_Overa_Caesar_EN.pdf       200 application/pdf · 54 kB
Browser (Chrome, 7 emulated devices)  no overflow, no console errors; 1 open bug (F40)
```

Production dependencies were vulnerable again earlier today (1 critical, 3 high,
[F39](./AUDIT-2026-07-26.md#f39)) and are clean after the bump. A full
`npm audit` still shows 7 high advisories in **dev-only** lint tooling; none
ship. Details in the audit.

The site was exercised in Chrome on 2026-10-08, desktop and seven emulated
devices ([Browser test](#browser-test--2026-10-08)). It works; the open items it
found are #10–#12 below and the CTA-fold problem in #6.

One placeholder is left in the shipped output: `site.url` (F02). `site.github`
is filled. The site is still **not deployed**. It became a git repository on
2026-10-08 (local only, not pushed).

---

## Content sources

Two documents now back the claims on the site. Every claim should trace to at
least one of them:

| Source | Covers |
| --- | --- |
| `FORM UPDATE KOMPETENSI & PENGALAMAN PROJECT.md` | Per-project client, role, period, status, stack, tasks |
| `public/CV_Overa_Caesar_EN.pdf` | Employers and job titles, skills, positioning, GitHub URL |

Where the two differ, the CV wins for employment facts (employer, job title,
location, availability). It is also published on the site, so a recruiter can
compare the two side by side.

---

## Next up

| # | Task | Ref | Needs |
| --- | --- | --- | --- |
| 1 | ~~`git init` + first commit~~ done 2026-10-08; push to GitHub (private or public) | [F17](./AUDIT-2026-07-26.md#f17) | owner |
| 2 | Deploy, then set `site.url` to the real domain | [F02](./AUDIT-2026-07-26.md#f02) | the domain |
| 3 | Open the site in a real browser, desktop **and** iOS | [§5](./AUDIT-2026-07-26.md#5-not-verified) | a device |
| 4 | Fill TAS's real client / period / status, then fix `period` | [F34](./AUDIT-2026-07-26.md#f34) · [F24](./AUDIT-2026-07-26.md#f24) | **owner**, not in the repo |
| 5 | Correct overstated status claims: "13 systems shipped", the "Also shipped" label, MYTOS "Present" vs Closure, TAS Impact written as achieved | [slop §2b](./SLOP-REVIEW-2026-09-22.md#2b-status-dan-dampak-yang-dilebihkan) | MYTOS status from owner |
| 6 | Rewrite generic copy: hero slogan (and shrink it, so the CTAs fit above the fold), About, Contact heading, footer note; regenerate `public/og.png` with the new headline | [slop §4](./SLOP-REVIEW-2026-09-22.md) | partly owner |
| 7 | ~~Decide whether the published CV keeps the phone number~~ decided 2026-10-08: **keep it** (owner) | — | — |
| 8 | Remove decorative chrome (Loader, Cursor, Aurora, Grain, Marquee, tilt, magnetic button); cut featured cards from 6 to 4 | [slop §3](./SLOP-REVIEW-2026-09-22.md) · [design §4](./DESIGN-REVIEW-2026-09-16.md#4-recommended-direction) | — |
| 9 | Architecture diagrams per featured project, in place of screenshots | [F26](./AUDIT-2026-07-26.md#f26) | — |
| 10 | Fix the light-theme photo badge (one line) | [F40](./AUDIT-2026-07-26.md#f40) | — |
| 11 | Give the fixed nav a background (or hide it on scroll) so it stops covering text | [Browser test](#browser-test--2026-10-08) #2, #5 | — |
| 12 | Make "Also shipped" an `<h3>` so the compact cards are not filed under TAS | [Browser test](#browser-test--2026-10-08) #8 | — |

**#1 is half done.** The repository exists locally, so changes can now be
diffed and reverted. Until it is pushed, the laptop is the only copy.

**#3 is the largest technical risk.** Desktop Chrome was tested on 2026-10-08
([Browser test](#browser-test--2026-10-08)) and passed, menu and scroll lock
included. What is left is a real phone, above all iOS Safari. Lenis `anchors: true` carries the nav links, the skip link and the
footer's back-to-top, and iOS Safari's handling of `overflow: clip` (the mobile
menu's scroll lock) is the highest-risk unverified item. The 2026-10-07 pass
added a third meta item (`role`) to the case cards and a CV button to the hero;
both were checked in CSS and built HTML, not on screen.

**#6 includes `og.png`.** The image was regenerated on 2026-10-07 to drop the AI
line, but it still carries the "I build systems that don't break." headline,
because the page does. Change both together.

---

## Browser test — 2026-10-08

Automated run in desktop Chrome (headless, driven through `puppeteer-core`
against `npm run start`). Covers desktop 1440×900, an emulated phone (390×844,
touch, 2× DPR), reduced motion and JavaScript disabled. **Not covered:** iOS
Safari and real devices; Next up #3 stays open for that.

**Passed (30 checks):**

- Loader clears; `<title>` and the hero name line are correct; no console errors
  or failed requests in any mode.
- Nav links Work / About / Contact land on their sections (Lenis
  `anchors: true` works); footer back-to-top returns to 0; the first Tab on a
  fresh load reaches the skip link, which becomes visible.
- Theme toggle switches and survives a reload.
- Both CV links carry `download`; GitHub link points at the real profile.
- No horizontal overflow at 1440 or 390 px; the hero name line and all 13
  case/compact meta rows fit at 390 px.
- Mobile menu: opens, focus moves in, Tab stays trapped, Escape closes and
  returns focus to the burger, a menu link closes the menu and scrolls.
- Scroll lock: wheel and touch-drag do not move the page while the menu is
  open (a control drag with the menu closed scrolls 817 px). Programmatic
  `scrollBy` still scrolls; expected, because `overflow: clip` on `<html>` is
  applied to the viewport as `hidden`.
- Reduced motion: no loader, hero visible immediately, marquee static.
- No JavaScript: the loader does not cover the page; hero and stats render.

**Found:**

1. **CTAs are below the fold on laptops.** "View Work" / "Download CV" start at
   1031 px on a 900 px viewport, 1013 px on 768. Pre-existing (design review D05:
   the four-line slogan), but the name line added 72 px. Fix with the hero
   rewrite (Next up #6): shrink the headline.
2. **The fixed nav has no background.** Scrolled content passes under the
   transparent nav; on a phone the logo sits on top of a case card's "07 /
   NPKTOS" label. Pre-existing.
3. **Without JS, the custom-cursor ring renders stuck at the top-left corner.**
   Cosmetic, and only for no-JS visitors. Goes away if the cursor is removed in
   the visual reset (Next up #8).

### Detailed run (same day)

Seven emulated devices with mobile user agents, touch and real DPR: Galaxy S8
360×740, iPhone SE 375×667, iPhone 14 390×844, Pixel 7 412×915, iPhone 14
landscape 844×390, iPad 768×1024, iPad landscape 1024×768. Dark theme on all,
light theme on three. Each page was scrolled top to bottom with a screenshot
per screen (about 150 in total).

**Clean on every device:** no horizontal overflow, no clipped text, no console
errors or failed requests, no duplicate IDs, no broken in-page anchors, every
`target="_blank"` has `noopener`, the profile photo loads (480 px WebP) with
alt text, ten named landmarks, `lang="en"`. The mobile menu fits every screen
and locks scroll. Sticky case cards stack on iPad landscape and fall back to
plain cards at 860 px and below, as designed. The keyboard walk from a fresh load
reaches all 16 controls in order (skip link → nav → theme → CTAs → Visit site ×2
→ Contact links → back to top), each with a visible outline. External links:
Okezone, MNC Energy and GitHub return 200; LinkedIn returns 999, its usual
response to non-browser clients.

**Measured locally** (`next start`, no network throttling, so only relative):
FCP about 300 ms on a first visit, under 100 ms on a repeat visit; CLS 0.000 to
0.011; about 330 kB transferred on a first visit.

| Device | CTAs visible without scrolling |
| --- | --- |
| iPhone 14, Pixel 7, iPad portrait | yes |
| iPhone SE, Galaxy S8 | no (bottom at 832 px on 667 / 740 px screens) |
| iPhone landscape | no (headline alone is 347 px on a 390 px screen) |
| iPad landscape, 1440×900, 1366×768 | no |

**New findings from the detailed run:**

4. **The photo badge is unreadable in the light theme** ([F40](./AUDIT-2026-07-26.md#f40)).
   `.photo-badge` hard-codes a dark background (`rgba(10,10,11,0.6)`) but takes
   its text colour from `--text`, which is near-black in the light theme:
   `#111110` on near-black, roughly 1:1. The "Bogor, West Java, Indonesia" label
   on the photo disappears. One-line fix.
5. **The nav collision is worse than finding 2 suggested.** On every phone, the
   "O/era" logo and the theme / menu buttons sit on top of body text, card labels
   and headings as they scroll past (seen in roughly a third of the phone
   screenshots). It also happens on iPad and in landscape.
6. **Touch targets.** All controls pass the WCAG 2.2 AA minimum (24×24 px, or
   spaced apart), but several are under the 44×44 px comfort size: the logo
   (58×32), the theme toggle (46×26), the desktop nav links on iPad (about 35×30),
   "Visit site" (93×19) and "Back to top" (84×22).
7. **Small labels.** The mono labels (skill cell titles, CONTEXT / APPROACH /
   IMPACT, the photo badge, compact card meta) render at 11–11.5 px on phones.
   Legible, but at the low end.
8. **Heading order.** The compact "Also shipped" cards use `<h4>` directly after
   the last featured card's `<h3>`, so assistive tech files all seven under
   "Truck Appointment System". "Also shipped" is a `<span>`, not a heading.

---

## Changed on 2026-10-08

- **Security headers** in `next.config.ts`, sent on every route: a CSP that
  allows only the site's own origin (`'unsafe-inline'` kept for scripts and
  styles, see [D18](./DECISIONS.md#d18--security-headers-with-a-same-origin-csp)),
  `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy` and HSTS. `X-Powered-By` is off. Checked with `next start`
  in headless Chrome at 1440 and 390 px: zero CSP violations, no console errors,
  photo and all 8 font faces load.
- **`git init`** ([F17](./AUDIT-2026-07-26.md#f17)) on `main`, first commit
  local only. The internal project form is git-ignored, so it never reaches a
  public repo; it stays on disk as a content source.
- **Browser testing, twice** (no code changed by it). A first pass of 31
  checks, then a detailed run on seven emulated devices with about 150
  screenshots. Results, findings and the device table are under
  [Browser test](#browser-test--2026-10-08). New: [F40](./AUDIT-2026-07-26.md#f40)
  (light-theme photo badge) and Next up #10–#12.
- **Full name in the hero** ([design review D03](./DESIGN-REVIEW-2026-09-16.md#d03),
  [D17](./DECISIONS.md#d17--the-name-sits-above-the-headline-not-inside-it)).
  A new line above the headline shows "Overa Caesar" with the tagline beside
  it. The subheading no longer opens with "Senior PHP / Laravel developer",
  since the name line says it.
- **`site.tagline` follows the CV:** "Full-Stack Developer" → "Senior PHP /
  Laravel Developer". It feeds the loading screen, the hero name line and the
  `<title>` (now "Overa Caesar — Senior PHP / Laravel Developer").
- **Tested in desktop Chrome**, including the hero at 390 px with device
  emulation. Results under [Browser test](#browser-test--2026-10-08). This is
  **not** the real-device test in Next up #3.
- **All documents updated:** README, CODE-GUIDE, DECISIONS (D15–D17 added),
  this file, the audit, and status notes at the top of both reviews.

---

## Changed on 2026-10-07

**Engineering findings closed** (detail in
[audit §4d](./AUDIT-2026-07-26.md#4d-remediated-on-2026-10-07)):
[F01](./AUDIT-2026-07-26.md#f01) GitHub link filled,
[F13](./AUDIT-2026-07-26.md#f13) marquee is decorative and stops under reduced
motion, [F23](./AUDIT-2026-07-26.md#f23) section numbers dropped,
[F25](./AUDIT-2026-07-26.md#f25) `site.name` is "Overa Caesar" and JSON-LD has
`sameAs` (GitHub + LinkedIn),
[F36](./AUDIT-2026-07-26.md#f36) `package.json` description,
[F37](./AUDIT-2026-07-26.md#f37) dead `viewTransition` config,
[F38](./AUDIT-2026-07-26.md#f38) Work header now reveals,
[F39](./AUDIT-2026-07-26.md#f39) `next` 15.5.22 → 15.5.27 and `sharp` override
`>=0.35.5` (a critical RCE in the image optimiser). F26 is half closed:
the CV is published, screenshots are not.

**CV published.** `CV_Overa_Caesar_EN.pdf` moved from `src/assets/` to
`public/` (files in `src/assets` are not served). `site.cv` holds the path.
"Download CV" sits in the hero, replacing "Get in touch" (Contact is still in the
nav), and in the Contact links. Both use the `download` attribute.

**`role` on every case study.** New required field on `CaseStudy`, taken from
the source record and normalised to Backend / Full-stack / Data / BI. Rendered in
`.case-meta` and `.wc-meta`. `.case-meta` gained `flex-wrap`, without which three
items overflow the card on a phone.

**Unsupported skill claims removed** (slop review §2a). Outbox pattern and
cache-stampede prevention are gone from Skills and About. "Pessimistic &
optimistic locking" became "Pessimistic locking", "TDD" became "Automated tests",
"Sanctum / JWT" became "Sanctum". Redis caching was added because the CV
supports it. TypeScript, Inertia.js and Tailwind CSS are not in the CV and were
**kept deliberately** at the owner's call.

**Positioning follows the CV: Senior PHP / Laravel, backend and full stack.**
The AI-transition message is gone from the hero, About, Skills, SEO/OG
metadata, JSON-LD and `og.png`.

- The **Now section was deleted** (`Now.tsx`, its nav link, `learning[]`,
  `progress[]` and the `.now` CSS). It existed only to carry the AI pivot.
- Python, Claude Code, MCP, RAG and LLM apps were removed from Skills; the
  "Tooling & AI" cell is now "Tooling" with CV-backed plain tags (no level dots,
  so no invented levels).
- Experience: 2021–present is now **Software Developer at PT Integrasi Logistik
  Cipta Solusi (ILCS), for PT Pelabuhan Tanjung Priok**, matching the CV. The
  MNC entry's title is "Web Developer", also from the CV.
- Location Cilebut → **Bogor**; availability → **remote and onsite**.

Owner-confirmed on 2026-10-07: the ILCS employer and title, Bogor, remote and
onsite, and keeping TypeScript / Inertia.js / Tailwind CSS.

---

## Still blocked on real data

Carried forward from the 2026-06-27 handover and **still open**. The `Impact` rows
of the six featured case studies are qualitative. They should carry real numbers.

> **Do not invent these.** A portfolio is read by people who verify. Qualitative
> but true beats quantitative and fabricated. Every current claim should trace to
> the source record or the CV (see [Content sources](#content-sources)).

| # | Project | Figures worth having |
| --- | --- | --- |
| 07 | NPKTOS | departments digitised · cargo entries/day · user count |
| 08 | MYTOS | containers tracked/day · concurrent users · years live |
| 09 | AIA | audit-approval flows processed · auditors · time saved |
| 10 | SIMONGKA | departments/KPIs monitored · user count |
| 12 | Power BI | dashboards · data sources consolidated · C-level stakeholders |
| 13 | TAS | trucks/slots per day · wait-time reduction % |

**One real figure exists in the CV:** "added Redis caching to read-heavy
endpoints, cutting database response times by about 25%". It is not tied to a
project there. Ask the owner which project it belongs to before using it in an
`Impact` row.

Where no figure exists, sharpen the sentence using facts already in
`Context`/`Approach` rather than reaching for a number. Edit location: the `rows`
entries keyed `Impact` in `work[]` (`src/lib/content.ts`).

---

## Verification pass — 2026-08-02

**No code was changed.** Every open finding was re-checked against the source and
the built HTML rather than against the audit text, the four gates were re-run,
and the production server was exercised over HTTP.

**All nine open tasks are still open.** Nothing had been quietly closed, and
nothing had regressed — every 2026-07-27 fix still holds in the shipped HTML:
counters ship `7 / 13 / 5 / 7` ([F30](./AUDIT-2026-07-26.md#f30)), 8 named
landmarks ([F11](./AUDIT-2026-07-26.md#f11)), the `h1`'s accessible name is still
derived ([F31](./AUDIT-2026-07-26.md#f31)), and every anchor target
(`#work`, `#about`, `#now`, `#contact`, `#top`) resolves to a real element. The
`sharp` override still delivers WebP at all three widths, so
[F14](./AUDIT-2026-07-26.md#f14) and [F18](./AUDIT-2026-07-26.md#f18) both hold.

Two P0s were confirmed by observation rather than by reading:

- **[F01](./AUDIT-2026-07-26.md#f01)** — the built HTML carries
  `href="[YOUR GITHUB]" target="_blank"`, and `GET /[YOUR GITHUB]` against the
  production server returns **404**. Because of `target="_blank"` it opens that
  404 in a new tab, so the visitor is left holding a broken tab in the one
  section a recruiter is most likely to click.
- **[F02](./AUDIT-2026-07-26.md#f02)** — `your-domain.com` appears **8 times** in
  the shipped output (enumerated under [Next up](#next-up)).

Three new findings surfaced (F36–F38). They were folded into the audit index on
2026-10-07 and closed the same day; see [audit §4d](./AUDIT-2026-07-26.md#4d-remediated-on-2026-10-07).

---

## Changed on 2026-07-27 (second pass)

Scoped to F18, F22 and F28. Detail in
[audit §4c](./AUDIT-2026-07-26.md#4c-also-remediated-on-2026-07-27).

- **Production dependencies are clean** — `found 0 vulnerabilities`. `next`
  15.5.19 → 15.5.22 cleared its own eight CVEs; the two it bundles needed
  corrected `overrides` (`postcss >=8.5.18`, `sharp >=0.35.0`). The `sharp`
  override was verified by exercising the image optimiser over HTTP, because it
  is a native binary that fails at runtime rather than at build
  ([D14](./DECISIONS.md#d14--overriding-nexts-bundled-postcss-and-sharp)).
- **`framer-motion` removed** — `Counter` rewritten on GSAP +
  `IntersectionObserver` + `matchMedia`. **First Load JS 196 → 174 kB**, route
  `/` 32.1 → 10.4 kB. Runtime dependencies: seven → five.
- **Two public projects linked** — Okezone and MNC Energy, via a new optional
  `url` on `CaseStudy`. Scoped to two by the project owner; `spinpay.id` was
  deliberately left out.

---

## Changed on 2026-07-27 (first pass)

A verification pass re-checked every open finding against the code and the
shipped HTML rather than against the audit text. All seventeen were still valid;
six new defects surfaced, and ten findings were closed. Detail in
[audit §4b](./AUDIT-2026-07-26.md#4b-remediated-on-2026-07-27).

**Correctness**
- Every stat counter shipped as `0` in the static HTML — the page told non-JS
  readers "0+ years architecting production backend systems"
  ([F30](./AUDIT-2026-07-26.md#f30))
- The `h1`'s accessible name was a hard-coded copy of the headline
  ([F31](./AUDIT-2026-07-26.md#f31))

**Accessibility**
- All 8 sections are now named landmarks; `About` and `Now` have real `h2`s and
  `Stats` a `sr-only` one ([F11](./AUDIT-2026-07-26.md#f11))

**Single source of truth**
- Skills' years figure now reads `stats[0]` ([F08](./AUDIT-2026-07-26.md#f08));
  five more hard-coded strings pulled into `content.ts`
  ([F32](./AUDIT-2026-07-26.md#f32)); four dead exports removed
  ([F33](./AUDIT-2026-07-26.md#f33))

**Scroll ownership**
- Lenis owns anchor navigation (`anchors: true`), and the footer's "back to top"
  is an `<a href="#top">` instead of a native `window.scrollTo` — the footer no
  longer ships any client JS ([F06](./AUDIT-2026-07-26.md#f06),
  [F35](./AUDIT-2026-07-26.md#f35))

**Tooling**
- `lucide-react` removed ([F27](./AUDIT-2026-07-26.md#f27)); workspace root
  pinned, so the build no longer warns ([F19](./AUDIT-2026-07-26.md#f19))

No files were added — `Footer.tsx` became a server component instead of gaining a
client sibling.

Three decisions were recorded:
[D11](./DECISIONS.md#d11--counter-renders-its-final-value-on-the-server) (why the
counter seeds its final value),
[D12](./DECISIONS.md#d12--back-to-top-is-a-link-not-a-button) (and what the
obvious fix cost),
[D13](./DECISIONS.md#d13--the-section-eyebrow-is-the-heading).

**Documentation was re-checked in the same pass**, since it is the tasklist this
work runs from. `lucide-react` was still documented in three places in
`CODE-GUIDE.md`; the README still described `Reveal` as using Framer Motion (it
uses GSAP) and still listed `[YOUR EMAIL]` as an unfilled placeholder; every
`content.ts` line number cited in the audit had shifted; and
[D02](./DECISIONS.md#d02--two-layer-no-js-fallback)'s claim that the `<noscript>`
layer covers non-JS readers was only half true until F30 was fixed. All corrected.

Still open and needing you, not the codebase:
[F34](./AUDIT-2026-07-26.md#f34) (TAS's real client / period / status).

---

## Changed on 2026-07-26

Twelve findings remediated. Full detail in
[audit §4](./AUDIT-2026-07-26.md#4-remediated-in-this-pass).

**Correctness**
- Skill legend was filling 4/5 dots for *every* level; now data-driven from
  `skillScale` ([D04](./DECISIONS.md#d04--one-source-of-truth-for-the-proficiency-scale))
- Loader hydration mismatch on repeat visits eliminated
  ([D01](./DECISIONS.md#d01--the-loader-renders-on-the-server-and-is-hidden-by-css))
- Stray pipe character in a stat label removed; `13+` corrected to `13`

**Accessibility**
- All 10 colour pairs now clear WCAG AA; the README's AA claim is true for the
  first time ([D03](./DECISIONS.md#d03--contrast-tokens-are-tuned-against-two-backgrounds-not-one))
- Mobile navigation added — previously there was none below 760px
  ([D07](./DECISIONS.md#d07--the-mobile-menu-unmounts-when-closed-and-owns-its-close-control))
- Skill pills announce `"PHP — Expert"` instead of an unexplained `"level 5 of 5"`

**Performance & privacy**
- Profile photo: 121 KB eager JPEG → 44.8 KB lazy WebP
  ([D06](./DECISIONS.md#d06--profilejpg-lives-outside-public))
- Fonts self-hosted; two third-party origins removed from the critical path
  ([D05](./DECISIONS.md#d05--fonts-self-hosted-trimmed-to-the-weights-actually-used))

**Resilience & tooling**
- Page no longer stuck behind the loader without JS, in two layers
  ([D02](./DECISIONS.md#d02--two-layer-no-js-fallback))
- ESLint works for the first time — 71 rules, warnings fail the run
  ([D09](./DECISIONS.md#d09--warnings-fail-the-lint-run))

### New files

| Path | Purpose |
| --- | --- |
| `src/lib/intro.ts` | Intro session flag shared by layout, Loader and Hero |
| `src/lib/fonts.ts` | `next/font` wiring; owns the three font CSS variables |
| `src/fonts/*.woff2` | Self-hosted Clash Display + Satoshi (88 KB) |
| `src/assets/profile.jpg` | Moved out of `public/` for static import |
| `eslint.config.mjs` | Flat config |

---

## Earlier work (2026-06-27)

Preserved for continuity — this is where the current `Work` section came from.

- **Work section refactored** from 13 flat cards to 6 featured sticky cards plus a
  compact "Also shipped" grid, via a `featured?: boolean` flag on `CaseStudy`.
  Featured: NPKTOS (07), MYTOS (08), AIA (09), SIMONGKA (10), Power BI (12),
  TAS (13).
- **Bug fixes:** `visuals[i % visuals.length]` so cards past the fourth stop
  reusing one layout; Skills tilt made to track the cursor instantly and ease back
  on leave; the loader stopped re-gating content on every reload; the marquee
  stopped jumping by measuring after `document.fonts.ready`.
- **Content:** "Now → Next" removed from `experience[]` (an aspiration, not
  employment history — it already lives in the `Now` section); the third stat
  replaced with the port & logistics years figure.

---

## Traps worth knowing before you edit

Each is load-bearing and non-obvious. All are commented at the source; this is
the index.

- **`--font-display` / `--font-body` / `--font-mono` are not in `globals.css`.**
  `next/font` owns them. Adding a `font-weight` to the CSS means adding the
  matching file in `src/lib/fonts.ts`, or the browser synthesises it.
- **Do not delete `html[data-intro="played"]` in `globals.css`.** It is what keeps
  the loader from flashing on every reload; the component deliberately still
  renders it so server and client markup match.
- **The loader failsafe is re-armed inside the reduced-motion block.** The blanket
  `animation: none !important` would otherwise disable the one animation that
  prevents a permanently stuck screen.
- **Contrast tokens are tuned against `--bg` *and* `--bg-2`.** Lightening either
  background invalidates the measured ratios in the token comments.
- **The 760px breakpoint is duplicated** between `MOBILE_QUERY` in `Nav.tsx` and
  the media query in `globals.css`. Change both.
- **`work[]` is sorted ascending by start date.** Keep it that way when adding
  entries.
- **`CaseStudy.url` renders on the compact "Also shipped" cards only.** No
  featured project is public, so the case-card branch was deliberately not
  written. Setting `url` on a `featured` entry does nothing until it is.
- **The `postcss` / `sharp` overrides in `package.json` are load-bearing.**
  Removing them silently reintroduces the advisories, because Next still
  pins the older versions. Next 15.5.27 still allows `sharp` 0.35.4, which is
  vulnerable; the override is `>=0.35.5`. Re-verify the image optimiser if you change the
  `sharp` one.
- **`site.brandMark` does not spell the brand name.** Its `sep` is a slash
  standing in for the letter "v", so `left + right` gives `"Oera"`. The readable
  name is `site.wordmark`; `brandMark` is only for rendering the O/era lockup.
  This shipped as a real bug in the loading screen on 2026-07-27.
- **`Counter` starts at its FINAL value, not 0.** It is server-rendered, so the
  first render is what ships in the static HTML. "Simplifying" it back to
  `useState(0)` re-ships a page claiming zero years of experience to every reader
  without a working bundle. The reset to 0 belongs in the layout effect.
- **`.eyebrow` pins `font-weight` and `line-height`.** About applies it to an
  `<h2>`; without those two declarations the base heading rule applies weight
  600 to a mono face that only ships 400.
- **The footer's "back to top" is a link, not a button.** That is what lets Lenis
  handle it via `anchors: true` and what keeps the footer free of client JS. A
  `window.scrollTo` writes scrollTop underneath Lenis's RAF loop; routing it
  through `useLenis` instead costs 5 kB of First Load JS, because the footer is
  in the page's graph rather than the layout's.
- **The CV lives in `public/`, not `src/assets/`.** Only `public/` is served as
  files. `site.cv` points at it; renaming the PDF means updating that one string.
- **`marquee[]` must stay a subset of `skills[]`.** The marquee is `aria-hidden`
  on the grounds that everything in it is already on the page. Adding an item
  that is not in Skills breaks that reasoning (F13).
- **Colours written straight into a rule skip the contrast check.** Use the
  theme tokens, or check both themes by hand. `.photo-badge` is the one current
  case ([F40](./AUDIT-2026-07-26.md#f40)).
- **The nav has no background.** Anything placed in the top 88 px of the
  viewport will be overlapped by the logo and the nav buttons while scrolling,
  until Next up #11 is done.
- **Never run `npm audit fix --omit=dev`.** It prunes every dev dependency from
  `node_modules`; eslint and tsc vanish until the next `npm install`.
- **The Now section no longer exists.** It was deleted on 2026-10-07 together
  with `learning[]` and `progress[]`. Older docs and audit entries still mention
  it as history.

## How to verify a change

```bash
npx tsc --noEmit     # types
npm run lint         # 71 rules, fails on any warning
npm run build        # production build
npm run start        # then exercise the page over HTTP
```

Contrast can be re-checked by parsing the tokens straight out of
`src/app/globals.css` and computing WCAG ratios against both `--bg` and `--bg-2`
— the numbers in [audit §4 / F09](./AUDIT-2026-07-26.md#f09) were produced that
way rather than by eye.

That method covers the **tokens only**. A colour written straight into a rule
skips it, which is how [F40](./AUDIT-2026-07-26.md#f40) got through. As of
2026-10-08 `.photo-badge` is the only rule that pairs a hard-coded background
with a theme token (`grep -n "background: rgba\|background: #" src/app/globals.css`;
the cursor's `#fff` is intentional, it uses `mix-blend-mode: difference`).

### Browser testing

The 2026-10-08 runs drove the installed Chrome through `puppeteer-core`,
installed in a scratch folder rather than in this project, against
`npm run start`. What made the results trustworthy:

- **Emulate with `page.setViewport`**, not `--window-size`. Headless Chrome on
  Windows will not go below a 504 px window, so a "390 px" screenshot taken with
  the flag is a 504 px layout cropped.
- **A fresh browser context per run.** The theme is in `localStorage`, so one
  test that toggles it changes every later test in the same profile.
- **Wait for the loader** (about 2.5 s) before measuring the hero, and scroll
  through the page before judging sections: reveals start at `opacity: 0` until
  their ScrollTrigger fires.
- **Measure LCP without scrolling.** Scrolling keeps producing new LCP
  candidates and inflates the number.
- **Programmatic `scrollBy` is not a scroll-lock test.** `overflow: clip` on
  `<html>` becomes `hidden` on the viewport, which still allows script scrolling.
  Use wheel and touch input.

**Still not covered:** a real phone, and iOS Safari above all — see
[audit §5](./AUDIT-2026-07-26.md#5-not-verified).
