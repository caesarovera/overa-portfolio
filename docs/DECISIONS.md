# Decision Log

Non-obvious engineering decisions and the reasoning behind them. Each entry
records what was rejected as well as what was chosen — the alternatives are
usually the part that gets forgotten, and re-litigated six months later.

Format: **Context → Decision → Consequences → Revisit when**.

Related: [`AUDIT-2026-07-26.md`](./AUDIT-2026-07-26.md) (what was wrong) ·
[`HANDOVER.md`](./HANDOVER.md) (what to do next).

---

## D01 — The loader renders on the server and is hidden by CSS

**Date:** 2026-07-26 · **Relates to:** [F04](./AUDIT-2026-07-26.md#f04)

**Context.** `Loader.tsx` decided whether to show itself by reading
`sessionStorage` inside a `useState` initialiser. On a repeat visit within the
same session the server emitted the loader markup and the client's first render
emitted `null` — a hydration mismatch. React 19 responds by discarding and
re-rendering the subtree, on exactly the visit that should have been fastest.

**Decision.** Never read storage during render. The component always renders the
same markup on the server and on the client's first pass. Visibility is decided
*before* first paint by an inline script in `layout.tsx` that stamps
`html[data-intro="played"]`, which CSS keys off to hide the overlay. The
component then unmounts itself from an effect.

The session key and attribute names live in `src/lib/intro.ts`, because three
places have to agree on them: the inline script, the Loader, and Hero (which
waits for the loader before animating its headline).

**Alternatives rejected.**

- *Read storage in `useEffect` and hide from state.* Effects run after paint, so
  the loader would flash on every repeat visit.
- *`useLayoutEffect`.* Fires before paint but warns during SSR, and still loses
  the first server-rendered frame.

**Note for anyone reading this next to `Counter.tsx`,** which *does* use a layout
effect ([D11](#d11--counter-renders-its-final-value-on-the-server)). That is not
this decision being violated. The loader's problem was *deciding what to render*
from data the server cannot see; the counter's is *starting an animation* from a
value both sides already agree on. The first must never happen during render, the
second is exactly what layout effects are for.

**Consequences.** This mirrors the pattern the project already used for theming,
so there is one idiom rather than two. The cost is that loader visibility is now
governed by CSS in `globals.css` rather than by the component — deleting the
`html[data-intro="played"]` rule silently reintroduces a full-screen flash on
every reload. The rule carries a comment saying so.

**Revisit when.** Sharing state pre-paint stops being necessary — e.g. if the
intro is dropped, or React ships a supported way to read client storage during
hydration without a mismatch.

---

## D02 — Two-layer no-JS fallback

**Date:** 2026-07-26 · **Relates to:** [F05](./AUDIT-2026-07-26.md#f05)

**Context.** The loader and wipe overlays are server-rendered and were removed
only by React. If JavaScript never ran, they covered the fully server-rendered
page indefinitely — the visitor saw a frozen `00` and nothing else.

**Decision.** Two independent mechanisms, because they cover different failures:

| Layer | Covers | Does not cover |
| --- | --- | --- |
| `<noscript>` stylesheet in `layout.tsx` | JS disabled; non-JS crawlers and text tools | Bundle failing to load |
| `loader-failsafe` CSS animation in `globals.css` | Bundle blocked, failed, or unparseable | — |

> **Correction, 2026-07-27.** The "covers" column above was only half true when
> it was written. Both layers did reveal the page — but what the page then said
> was *"0+ years architecting production backend systems"* and *"0 enterprise
> systems shipped"*, because `Counter` initialised its React state at zero and the
> server render is what ships in the static HTML. Getting a page in front of a
> reader is worthless if the page lies to them. Fixed in
> [D11](#d11--counter-renders-its-final-value-on-the-server) /
> [F30](./AUDIT-2026-07-26.md#f30); the table is accurate now.

The second layer exists because **`<noscript>` content is not rendered when JS is
enabled but the bundle never arrives** — a common failure on flaky mobile
networks, behind corporate proxies, or with an over-eager blocking extension.
The failsafe animates `visibility` to `hidden` after 6 s: normal teardown
completes in ~2.5 s, so it only fires when something has genuinely broken. It
touches no property GSAP owns (GSAP drives `transform`), so the two never fight.

The `<noscript>` layer also hides the burger and theme toggle — both dead
controls without JS — and restores the plain inline links, otherwise mobile is
left with no navigation at all.

**Consequences.** The reduced-motion block sets `animation: none !important` on
everything, which would have disabled the one animation whose job is to prevent a
permanently stuck screen. The failsafe is therefore explicitly re-armed inside
that media query. It wins on specificity (`.loader` beats `*`), and it animates
visibility only, so no motion is reintroduced for a user who asked for none.

A backgrounded tab can throttle timers enough for the failsafe to fire while the
count-up is still running. The result is that the loader disappears and the
content shows — which is the better outcome anyway.

**Revisit when.** The loading screen is removed, or the 6 s budget stops matching
actual teardown time.

---

## D03 — Contrast tokens are tuned against two backgrounds, not one

**Date:** 2026-07-26 · **Relates to:** [F09](./AUDIT-2026-07-26.md#f09)

**Context.** Four tokens sat between 3.9:1 and 4.45:1 — all used on 11–14px
text, all failing WCAG AA. The README claimed AA compliance in light mode, which
was untrue.

**Decision.** Re-derive each value by holding hue and saturation constant and
moving lightness only, and require the result to clear **4.6:1 against both
`--bg` and `--bg-2`**. Two reasons for the second surface and the margin:

- `--bg-2` is the hidden constraint. `.wc-meta` and `.case .no` sit on cards, not
  on the page background, and `--bg-2` is always the harder target. Tuning
  against `--bg` alone is what produced the original failures.
- Targeting 4.6 rather than 4.5 keeps values off the boundary, where different
  audit tools round in different directions.

**Consequences.** `--accent` in light mode is also a *fill* behind
`--accent-ink`, so darkening it raised that pair from 4.20 to 4.94:1 — the
primary button and skip link improved as a side effect. `--accent-glow` was
updated to match the new accent.

All 10 pairs are now verifiable from the stylesheet itself; the token definitions
carry their measured ratios in comments. **Lightening either background invalidates
these numbers** — re-run the check if `--bg` or `--bg-2` changes.

**Revisit when.** Any background token changes, or the design adopts a second
accent.

**Update 2026-10-08 ([F40](./AUDIT-2026-07-26.md#f40)).** The decision holds,
but its reach was overstated. Tuning the tokens only protects rules that use
them. `.photo-badge` uses a hard-coded dark background with `color: var(--text)`,
and in the light theme that pair is about 1:1. Any colour written straight into
a rule has to be checked in both themes by hand.

---

## D04 — One source of truth for the proficiency scale

**Date:** 2026-07-26 · **Relates to:** [F03](./AUDIT-2026-07-26.md#f03)

**Context.** The legend was hand-written markup and filled 4 of 5 dots for
Expert, Working *and* Learning alike. The component teaching readers how to
interpret the dots was itself wrong, and had been for some time.

**Decision.** Move the scale into `skillScale` in `content.ts` and render both
the legend and the per-skill dots from it through a single `Dots` component.

**Consequences.** The two can no longer disagree, because they are the same code
path — the class of bug is eliminated rather than the instance. All five levels
are now shown (previously three anchors, one of which described a level no skill
actually used). Adding a level means editing one array.

Screen-reader labels improved as a side effect: pills now announce
`"PHP — Expert"` instead of `"level 5 of 5"` with no scale to interpret it
against, which closed [F12](./AUDIT-2026-07-26.md#f12) at no extra cost.

---

## D05 — Fonts self-hosted, trimmed to the weights actually used

**Date:** 2026-07-26 · **Relates to:** [F15](./AUDIT-2026-07-26.md#f15)

**Context.** Two render-blocking stylesheets from `api.fontshare.com` and
`fonts.googleapis.com`: two extra DNS + TLS handshakes before text could paint,
every visitor's IP and user-agent disclosed to two third parties, and a strict
`style-src` CSP made impossible.

**Decision.** Serve all three families from our own origin via `next/font`
(`next/font/local` for Clash Display and Satoshi, `next/font/google` for JetBrains
Mono). Ship only the weights `globals.css` actually asks for, audited directly
from the stylesheet: Clash Display 500/600, Satoshi 400/700, JetBrains Mono 400 —
8 requested weights reduced to 5, 88 KB total.

`next/font/google` fetches at **build** time and serves locally, so there is no
runtime request to Google. The build now depends on network access on a cold
cache; that was judged an acceptable trade for a self-hosted runtime.

**Consequences.**

- `--font-display`, `--font-body` and `--font-mono` are **no longer declared in
  `globals.css`**. `next/font` owns them and applies them via a class on
  `<html>`, because the filenames are hashed per build.
- Tailwind v4 also declares `--font-sans` and `--font-mono` in `@layer theme`.
  Ours are unlayered, and unlayered declarations beat layered ones regardless of
  source order — confirmed against the compiled CSS, not assumed.
- Font exports are named after the typefaces (`clashDisplay`, `satoshi`) because
  `next/font/local` derives the generated `font-family` from the binding name;
  `display`/`body` would have shipped as `font-family:"display"`.
- **Adding a `font-weight` to `globals.css` now requires adding the matching file
  in `src/lib/fonts.ts`**, or the browser will synthesise it. Noted in the README.

---

## D06 — `profile.jpg` lives outside `public/`

**Date:** 2026-07-26 · **Relates to:** [F14](./AUDIT-2026-07-26.md#f14)

**Context.** The photo was a raw `<img src="/profile.jpg">`: 121 KB, eager, no
modern format, no srcset.

**Decision.** Move it to `src/assets/` and import it statically into
`next/image`, rather than referencing it by path from `public/`.

A static import gives the build the intrinsic dimensions, lets it generate the
blur placeholder automatically, and makes a missing file a **build failure**
rather than a runtime 404. `fill` is used because `.photo-frame` is deliberately
taller than its container to give the parallax room.

`og.png` stays in `public/` — metadata references it by absolute URL, so it must
keep a stable public path.

**Consequences.** Measured against the running production server: 121 KB eager
JPEG → **44.8 KB lazy WebP**, plus blur-up and 16 srcset candidates. The README
was updated, since it previously told the reader to swap `public/profile.jpg`.

---

## D07 — The mobile menu unmounts when closed, and owns its close control

**Date:** 2026-07-26 · **Relates to:** [F10](./AUDIT-2026-07-26.md#f10)

**Context.** Below 760px all four nav links were hidden and no hamburger existed.
Mobile visitors — the majority for a link shared with a recruiter — had no
navigation at all.

**Decision.** Conditionally render the panel rather than keeping it in the DOM
behind a `hidden` attribute. Unmounting removes its links from the tab order and
the accessibility tree for free, with no risk of the classic `display: flex`
overriding `[hidden]` footgun. `aria-controls` is therefore set **only while the
panel exists**, so it never points at a missing element.

The burger sits *above* the panel (nav z-index 110 vs 105) and doubles as the
visible close control, which avoids a second visible button. But `aria-modal`
hides everything outside the dialog from assistive technology, so the dialog also
carries its **own** close button — last in tab order, revealed on focus using the
same technique as the existing skip link. An always-invisible focusable control
would be its own accessibility defect.

The burger icon is driven directly by `[aria-expanded="true"]` rather than a
separate class, so the visual state cannot diverge from what is announced.

**Consequences.** The entrance animation is entry-only; closing is instant. The
breakpoint is duplicated between `MOBILE_QUERY` in `Nav.tsx` and the media query
in `globals.css` — unavoidable without custom media queries, and commented on
both sides. The panel closes itself when the viewport crosses the breakpoint,
because otherwise rotating to landscape hides the button that closes it.

`justify-content: safe center` is used so the top of the list stays reachable on
short landscape screens, where plain centring would overflow past the scrollable
edge.

**Unverified.** The focus trap and scroll lock were traced line by line but never
exercised in a browser. See [audit §5](./AUDIT-2026-07-26.md#5-not-verified).

---

## D08 — Scroll lock goes through Lenis, not through our own `overflow`

**Date:** 2026-07-26 · **Relates to:** [F07](./AUDIT-2026-07-26.md#f07)

**Context.** The mobile menu must stop the page scrolling behind it. Lenis owns
scrolling on this site, so setting `overflow: hidden` ourselves would fight it.

**Decision.** Call `lenis.stop()` / `lenis.start()`, and import
`lenis/dist/lenis.css` — which the project had never imported. That stylesheet
provides `.lenis-stopped { overflow: clip }`, the rule that actually holds the
page still; without it `stop()` halts Lenis's RAF loop but native scrolling
continues.

**Consequences.** Closes a latent bug that had no symptom before there was
anything to lock. `overscroll-behavior: contain` on the panel additionally
prevents scroll chaining.

**Risk.** iOS Safari has a long history of ignoring `overflow` on `html`/`body`
for scroll locking. This follows the library's own sanctioned approach, but it is
the highest-risk unverified item in this pass and needs testing on a real device.

---

## D09 — Warnings fail the lint run

**Date:** 2026-07-26 · **Relates to:** [F16](./AUDIT-2026-07-26.md#f16)

**Context.** `npm run lint` had never worked: no ESLint config existed, so the
command dropped into an interactive wizard and exited 1, and `next build`
performed no linting either. Two real defects survived the life of the project as
a direct result.

**Decision.** Flat config (`eslint.config.mjs`) extending `next/core-web-vitals`
+ `next/typescript`, bridged through `FlatCompat` because `eslint-config-next`
15.x is still eslintrc-style. Script is `eslint . --max-warnings=0`.

The flag is the substantive part. The Next and react-hooks rules that matter most
here — `no-img-element`, `exhaustive-deps` — ship as **warnings**, so without it
the command exits 0 while real defects sit in the output. That is the same gap
that let those two defects survive; a lint run that cannot fail is decoration.

`next lint` is deprecated and removed in Next 16, so this migration was due
regardless.

**Verification.** Not assumed. A temporary probe file reproducing both historical
defects was linted and correctly flagged all three problems, then deleted.

**Consequences.** Any new warning blocks the lint script. With no CI (see
[F17](./AUDIT-2026-07-26.md#f17)) the value today is editor feedback plus the
signal a clean run sends to anyone who clones the repo — which, for a portfolio,
is part of the product.

---

## D10 — `brace-expansion` advisory not overridden

**Date:** 2026-07-26 · **Relates to:** [F18](./AUDIT-2026-07-26.md#f18)

**Context.** Adding ESLint raised `npm audit` from 3 to 12 high advisories.
Production was re-checked and is **unchanged at 3** — every addition is dev-only,
and they trace to one root: `brace-expansion` ≤5.0.7 (DoS via unbounded expansion
causing an OOM crash), reached through `minimatch@3` inside `@eslint/eslintrc`.

**Decision.** Do not force an override. Accept and document.

Three reasons:

1. **The fix is riskier than the bug.** The vulnerable copy is `1.1.16`, pulled
   in as **CommonJS** by `minimatch@3`. The patched `5.0.8` is **ESM**. Forcing
   the override risks breaking the linter to fix something unreachable.
2. **The exposure does not exist here.** The attack requires a hostile glob
   pattern. The only globs in play are the ones written in our own ESLint config.
   No untrusted input reaches this code path, and it never ships to a browser.
3. **npm's own suggested fix is worse** — it proposes downgrading
   `@eslint/eslintrc` to `0.1.0`, a semver-major regression.

**Consequences.** `npm audit` will keep reporting these. That is a deliberate
accepted risk, recorded here and in the README so it is not re-litigated.

**This entry covers the dev tree only.** It used to dismiss the production
advisories in half a sentence, which was a mistake: re-checked on 2026-07-27,
`next` itself had become the vulnerable package rather than merely depending on a
vulnerable `postcss` and `sharp`. Production is now clean —
`npm audit --omit=dev` reports `found 0 vulnerabilities` — via a patch bump and
two overrides ([D14](#d14--overriding-nexts-bundled-postcss-and-sharp),
[F18](./AUDIT-2026-07-26.md#f18)). Do not read "accepted" here as covering the
production tree; it never should have.

**Revisit when.** `eslint-config-next` moves off `minimatch@3`, or the advisory
is shown to be reachable from untrusted input.

---

## D11 — `Counter` renders its final value on the server

**Date:** 2026-07-27 · **Relates to:** [F30](./AUDIT-2026-07-26.md#f30)

**Context.** `Counter` held `useState(0)` and counted up once scrolled into view.
It is a client component, but client components are still **server-rendered** —
so the first render is what lands in the static HTML. Every stat on the page
shipped as `0`. Anyone reading the HTML without executing the bundle was told the
author had zero years of experience and had shipped zero systems.

That is worse than it sounds, because [D02](#d02--two-layer-no-js-fallback) had
just gone to some trouble to make the page *visible* without JS. The two layers
worked; the content behind them was wrong.

**Decision.** Seed the state with the final value. Reset to `0` on the client
only, inside a layout effect, then animate.

```tsx
const [val, setVal] = useState(to);            // ships in the HTML
useIsomorphicLayoutEffect(() => {
  if (reduced) return;                          // nothing to animate
  setVal(0);                                    // before the browser paints
}, [reduced]);
```

**Alternatives rejected.**

- *A `<noscript>` twin showing the real number.* `<noscript>` does not render
  when JS is enabled but the bundle fails — the exact case D02's second layer
  exists for. It would have fixed the smaller half of the problem.
- *Plain `useEffect` for the reset.* Effects run after paint, so a viewer whose
  counter is already on screen would see the real number flash to `0` and count
  back up. All four counters sit below the fold today, but that is a layout
  accident, not a guarantee.
- *Dropping the animation.* Solves it, and costs the thing the section is for.

**Consequences.** `useLayoutEffect` warns when React renders it on the server, so
it is aliased to `useEffect` there — the standard isomorphic shim, with the
reason commented at the top of the file. Server and client first renders still
produce identical markup, so [F04](./AUDIT-2026-07-26.md#f04) does not return.

The rule this generalises to: **for a server-rendered component, the initial
state is a publishing decision, not an implementation detail.** Ask what the
first render says, because that is what ships.

**Revisited 2026-07-27 — and it held.** `Counter` was rewritten to drop
`framer-motion` ([F28](./AUDIT-2026-07-26.md#f28)) later the same day: `animate`
→ `gsap.to`, `useInView` → `IntersectionObserver`, `useReducedMotion` →
`matchMedia`. The seeding and the layout-effect reset came through the rewrite
unchanged, and the static HTML was re-checked afterwards — still `7+ · 13 · 5`.

**Revisit when.** Anything touches `Counter`'s initial state. The invariant to
protect is not the implementation, it is that **the first render emits the real
number**; re-read the static HTML after any change here, because no test and no
type catches this.

---

## D12 — "Back to top" is a link, not a button

**Date:** 2026-07-27 · **Relates to:** [F35](./AUDIT-2026-07-26.md#f35)

**Context.** The footer's control called `window.scrollTo({ behavior: "smooth" })`.
Lenis owns the scroll position on this site, so that wrote `scrollTop` underneath
its RAF loop — the same conflict `anchors: true` fixes for anchor links
([F06](./AUDIT-2026-07-26.md#f06)), at a second site.

**Decision.** Replace the button with `<a href="#top">`, and let Lenis handle it
as an anchor. The footer became a server component.

**Alternatives rejected.**

- *Route the existing button through `useLenis`.* This was implemented first. It
  is correct, and it cost **5 kB of First Load JS** (196 → 201 kB): the footer is
  in the page's component graph, not the layout's, so importing `lenis/react`
  there pulls Lenis into the page chunk on top of the layout chunk that already
  has it. Measured across four builds — the Footer split, `anchors: true` and
  `outputFileTracingRoot` were each ruled out before the cause was found.
- *Keep `window.scrollTo` and accept the conflict.* The whole point of D08 and
  F06 is that this site has exactly one scroll owner.

**Consequences.** The footer ships **zero** client JavaScript, the control works
with JS disabled, and it is now the semantically correct element: moving a reader
to a location is navigation, not an action. Reduced motion is handled globally —
Lenis runs at `lerp: 1`, so the jump is instant.

The trade is that the control's behaviour now depends on `anchors: true` staying
set in `Providers.tsx`. Turning that off would silently make three things fall
back to native scrolling: the nav links, the skip link, and this.

---

## D13 — The section eyebrow *is* the heading

**Date:** 2026-07-27 · **Relates to:** [F11](./AUDIT-2026-07-26.md#f11)

**Context.** `About` carried substantial prose with no heading at all, `Now`
opened at `h3`, and no `<section>` had an accessible name — so none were exposed
as landmarks and region-by-region screen-reader navigation was unusable across
most of the page.

**Decision.** Promote the existing `.eyebrow` to `<h2>` in `About` and `Now`, give
`Stats` an `sr-only` heading, and point every section at its heading with
`aria-labelledby`.

**Alternatives rejected.**

- *Add visible headings to `About` and `Now`.* A content and design change to fix
  a semantics problem, and it would have forced the unrelated section-numbering
  question ([F23](./AUDIT-2026-07-26.md#f23)) at the same time.
- *`aria-label` on each `<section>`.* Names the landmark without adding a
  heading, so heading navigation stays broken. Half the fix.
- *`sr-only` headings everywhere.* Correct but wasteful where a visible label
  already exists on screen — and a hidden heading that duplicates visible text is
  a maintenance trap.

**Consequences.** No visual change, but it required pinning `font-weight: 400`
and `line-height: 1` on `.eyebrow`: the base `h1, h2, h3, h4` rule would
otherwise have applied weight 600 to JetBrains Mono, which
[D05](#d05--fonts-self-hosted-trimmed-to-the-weights-actually-used) ships in 400
only — the browser would have synthesised the bold. Verified by reading the
compiled stylesheet back, not by eye.

`Marquee` was deliberately left alone. It is a `<div>`, not a landmark, so it has
nothing to name; whether it should be `aria-hidden` at all is
[F13](./AUDIT-2026-07-26.md#f13)'s question and a separate decision
([D16](#d16--the-marquee-is-decorative)).

**Update 2026-10-07.** The `Now` section was deleted
([D15](#d15--positioning-follows-the-cv)), so the pattern now lives in `About`
only. The section numbers this entry avoided touching were dropped the same day
([F23](./AUDIT-2026-07-26.md#f23)): every section eyebrow is now a plain word.

---

## D14 — Overriding Next's bundled `postcss` and `sharp`

**Date:** 2026-07-27 · **Relates to:** [F18](./AUDIT-2026-07-26.md#f18)

**Context.** `next@15.5.19` carried eight advisories of its own plus two
vulnerable bundled dependencies. Bumping to `15.5.22` cleared Next's own eight
but not the bundled pair: `postcss@8.5.15` (advisory covers `<=8.5.17`) and
`sharp@0.34.5` (needs `>=0.35.0`). npm's suggested remedy at that point was
`next@9.3.3` — six major versions backwards, which is the resolver finding the
only release whose ranges exclude the bad versions, not a fix.

**Decision.** Correct the `overrides` block: `"postcss": ">=8.5.18"` (the
existing `>=8.5.10` was stale and still resolved to a vulnerable 8.5.15) and add
`"sharp": ">=0.35.0"`. Resolves to `postcss@8.5.23` and `sharp@0.35.3`.

**Note the tension with [D10](#d10--brace-expansion-advisory-not-overridden),**
which declines to override `brace-expansion`. The two are consistent, and the
difference is what makes an override sane:

| | `brace-expansion` (D10) | `postcss` / `sharp` (here) |
| --- | --- | --- |
| Reachable? | No — dev-only, our own globs | Yes — ships to production |
| Override crosses a module-system boundary? | Yes, CJS → ESM | No, same format |
| Can the result be tested? | Only "does the linter still run" | Yes, directly |

An override is a claim that a package works with a version its parent did not
pick. That claim is cheap when you can test it and reckless when you cannot.

**Verification.** `sharp` is a native binary and is what Next's image optimiser
runs on, so a bad override would fail at runtime rather than at build. The
production server was started and the optimiser exercised over HTTP: `w=384`,
`w=640` and `w=1080` all returned `200 image/webp` at 11.5 / 30.2 / 43.8 KB from
a 120.9 KB source — matching the figures [D06](#d06--profilejpg-lives-outside-public)
recorded on the older `sharp`.

**Consequences.** `npm audit --omit=dev` reports `found 0 vulnerabilities`. The
overrides are now load-bearing: removing them silently reintroduces both
advisories, because Next still pins the older versions.

**Update 2026-10-07 ([F39](./AUDIT-2026-07-26.md#f39)).** `next` 15.5.22 →
15.5.27. That release declares `sharp: ^0.34.3 || ^0.35.4`, and 0.35.4 is still
vulnerable, so the override was raised to `"sharp": ">=0.35.5"` rather than
dropped. Resolves to `sharp@0.35.5`. The optimiser check was re-run: `w=384` /
`640` / `1080` returned `200 image/webp` at 11.7 / 30.9 / 44.9 KB.

**Revisit when.** Next ships releases that depend on patched `postcss` and
`sharp` directly — then drop the overrides rather than carrying them forever, and
re-run the optimiser check.

---

## D15 — Positioning follows the CV

**Date:** 2026-10-07 · **Relates to:** [slop review §2](./SLOP-REVIEW-2026-09-22.md),
[design review D08 / D09](./DESIGN-REVIEW-2026-09-16.md#d08)

**Context.** The site sold a "senior PHP / Laravel developer transitioning into
AI engineering". The owner's CV, published on the site the same day, sells a
senior PHP / Laravel backend and full-stack developer and does not mention AI.
A recruiter can open both side by side. The AI half had no artefact behind it:
the `Now` section was a topic list and three progress bars at 30–50%, and the
Skills dots rated Python, RAG, MCP and LLM apps at 2 of 5.

**Decision.** The owner chose to follow the CV. The AI messaging was removed
everywhere (hero, About, Skills, SEO and OG metadata, JSON-LD, `og.png`), and the
`Now` section was deleted with its data. Employer, job titles, location and
availability were aligned to the CV as well. The CV is now a second source of
record next to `FORM UPDATE KOMPETENSI & PENGALAMAN PROJECT.md`; for employment
facts it wins.

**Alternatives rejected.**

- *Keep the pivot, shrink it to one line.* The design review's fallback. It still
  contradicts the CV, which is the document recruiters forward.
- *Keep `Now` and fill it with backend learning.* There is nothing concrete to put
  there yet, and a thin section is the problem both reviews named.

**Consequences.** Every skill and claim should trace to the source record or the
CV. Five skill tags that traced to neither were removed or narrowed. TypeScript,
Inertia.js and Tailwind CSS are not in the CV but were kept at the owner's call.

**Revisit when.** A public AI artefact exists (a repo or a demo). The pivot can
come back then, with evidence, and the CV should change first.

---

## D16 — The marquee is decorative

**Date:** 2026-10-07 · **Relates to:** [F13](./AUDIT-2026-07-26.md#f13)

**Context.** `Marquee` was `aria-hidden` while its comment argued it was content,
and used that argument to keep it moving under reduced motion (slowed from 30 s
to 60 s, not stopped).

**Decision.** Decorative. `aria-hidden` stays, and under
`prefers-reduced-motion: reduce` the tween is never created, so the band is
static.

**Why decorative is true, not just convenient.** Every marquee item is also a
Skills tag, so nothing hidden from assistive technology is missing from the page.
The array is also duplicated for the seamless loop; exposing it would announce
the whole list twice.

**Consequences.** `marquee[]` must stay a subset of `skills[]`. When `RAG` and
`Claude Code` left Skills ([D15](#d15--positioning-follows-the-cv)), they left the
marquee too, replaced by `Oracle` and `Docker`.

**Revisit when.** The marquee is removed in the planned visual reset (slop review
§3). This entry then becomes history.

---

## D17 — The name sits above the headline, not inside it

**Date:** 2026-10-08 · **Relates to:** [F25](./AUDIT-2026-07-26.md#f25),
[design review D03](./DESIGN-REVIEW-2026-09-16.md#d03)

**Context.** The full name was in the title, JSON-LD and footer, but not in the
hero, which is the first thing a recruiter sees. The design review asks for the
name in the hero.

**Decision.** A `<p class="hero-id">` between the availability pill and the
`<h1>`: `site.name` in the display face, `site.tagline` in mono caps beside it
(it wraps under the name on a phone). It fades in with the other
`data-hero-fade` elements. The hero subheading dropped its own "Senior PHP /
Laravel developer" opening, since the name line now says it.

**Alternatives rejected.**

- *Make the name the `<h1>`.* Better for SEO, but it changes the heading
  structure and the per-character headline animation at once. That belongs to
  the hero copy rewrite (HANDOVER), which replaces the slogan anyway.
- *Put the name in the pill.* The pill is small body text; the name would not
  read as identity.

**Consequences.** `site.tagline` ("Senior PHP / Laravel Developer", from the CV
positioning) now has three readers: the loading screen, the hero name line and
the `<title>` suffix. Keep it short. It renders in uppercase mono and has to fit
a 390 px screen.

**Revisit when.** The hero is rewritten and the slogan goes. Reconsider the name
as the `<h1>` then.

---

## D18 — Security headers with a same-origin CSP

**Date:** 2026-10-08 · **Relates to:** deploy (HANDOVER Next up #2)

**Context.** The site is about to be deployed and sent no security headers at
all. It loads nothing from another origin: fonts are self-hosted ([D05](#d05--fonts-self-hosted-trimmed-to-the-weights-actually-used)),
images go through `/_next/image`, and there is no analytics or embed.

**Decision.** `headers()` in `next.config.ts` adds, on every route: a CSP of
`default-src 'self'` with `img-src` also allowing `data:`/`blob:` (the blur
placeholder and two SVG data URIs in `globals.css`), `object-src 'none'`,
`base-uri`/`form-action 'self'`, `frame-ancestors 'none'` and
`upgrade-insecure-requests`; plus `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, a
`Permissions-Policy` that turns off camera, microphone, geolocation, payment and
USB, and a two-year HSTS. `poweredByHeader: false` drops `X-Powered-By`.

**Alternatives rejected.**

- *Nonce-based `script-src` without `'unsafe-inline'`.* Needs middleware to mint a
  nonce per request, which makes the static page render per request. The only
  inline scripts are the no-flash theme script (compile-time constants only),
  JSON-LD and Next's RSC payload; with no user input on the page, the gain is
  small for the cost.
- *Dropping `'unsafe-inline'` from `style-src`.* GSAP animates through inline
  `style` attributes, so it would break every animation.

**Consequences.** Adding any third-party resource (analytics, an embed, a font
CDN, Vercel Analytics) is blocked until its origin is added to the matching
directive. `next dev` gets `'unsafe-eval'` for fast refresh and no
`upgrade-insecure-requests`; production gets neither.

**Revisit when.** A third-party script is added, or the page gains a form or
any user input, at which point a nonce-based CSP is worth the dynamic render.
