# Code Guide — for people new to this stack

**Last updated:** 2026-10-08

This explains how to run the project, what every dependency is doing here, and
*why* the code is shaped the way it is. Written for someone comfortable with
HTML/CSS/JS who has not built a Next.js site before.

Every example below is real code from this repository, not a generic snippet.

Related: [`HANDOVER.md`](./HANDOVER.md) (what to work on) ·
[`DECISIONS.md`](./DECISIONS.md) (deeper rationale) ·
[`AUDIT-2026-07-26.md`](./AUDIT-2026-07-26.md) (known issues).

---

## 1. Setup and run

**You need Node 18.18 or newer** (verified on Node 22.14). Check with `node -v`.

```bash
npm install      # installs dependencies into node_modules/ (~1–2 min first time)
npm run dev      # development server → http://localhost:3000
```

Leave `npm run dev` running while you work. Edit any file in `src/`, save, and
the browser updates without a reload. This is *Fast Refresh*.

### The four scripts

| Command | What it does | When you run it |
| --- | --- | --- |
| `npm run dev` | Dev server, hot reload, readable errors, **slower on purpose** | While writing code |
| `npm run build` | Compiles the optimised production version into `.next/` | Before deploying, and to catch errors dev hides |
| `npm run start` | Serves what `build` produced | To test the real thing locally |
| `npm run lint` | Runs 71 ESLint rules; **fails on any warning** | Before considering work done |

**Important:** `npm run dev` and `npm run build` are not equivalent. Dev skips
optimisations and tolerates things production will not. Type errors and lint
failures surface at build time. Always run `npm run build` before you believe
something works.

### The full check

```bash
npx tsc --noEmit && npm run lint && npm run build
```

All three must exit cleanly. Verifying a UI change also means opening it in a
browser — no command checks whether a thing *looks* right.

### Where the output goes

`.next/` is generated. Never edit it, never commit it (it is already in
`.gitignore`). Delete it freely — the next build recreates it.

---

## 2. The one idea that explains most of this codebase

**Your page is rendered twice.**

1. **On the server, at build time.** Next runs your React components in Node and
   writes the result to plain HTML. That HTML is what a visitor receives first,
   and it is why the site shows content instantly and why search engines can read
   it.
2. **In the browser.** React loads, walks the same components again, and attaches
   event handlers to the existing HTML. This step is called **hydration**.

The rule that follows, and it is the source of a whole class of bugs:

> **The first browser render must produce exactly the same markup the server
> produced.** If it does not, React reports a *hydration mismatch* and throws away
> that part of the page to rebuild it.

Two things live only in the browser and therefore **must not be read while
rendering**: `window`/`document`, and storage (`localStorage`, `sessionStorage`).
The server has no idea what is in your browser's storage.

### The worked example: `Loader.tsx`

This exact bug was in this repo. The loading screen used to decide whether to
show itself like this:

```tsx
// BROKEN — reads sessionStorage during render
const [skip] = useState(() => sessionStorage.getItem("introPlayed") === "1");
if (skip) return null;
```

On a second visit: the **server** has no `sessionStorage`, so it rendered the
loader. The **browser** found the flag and rendered nothing. Mismatch on every
repeat visit.

The fix, in `src/lib/intro.ts` + `src/app/layout.tsx` + `globals.css`, works in
three moves:

```tsx
// 1. A tiny script in <head>, before anything is painted.
//    It CAN read storage, because it is not React rendering anything.
if (sessionStorage.getItem('introPlayed') === '1')
  document.documentElement.setAttribute('data-intro', 'played');
```

```css
/* 2. CSS hides the loader based on that attribute — before first paint. */
html[data-intro="played"] .loader,
html[data-intro="played"] .wipe { display: none; }
```

```tsx
// 3. The component now renders the SAME thing on server and client.
//    It only removes itself later, from an effect (which runs browser-only).
const [done, setDone] = useState(false);
useEffect(() => {
  if (introAlreadyPlayed()) { setDone(true); return; }
  /* …run the count-up… */
}, []);
if (done) return null;
```

**The takeaway to carry into your own code:** when something must differ between
server and browser, do not branch during render. Render the same thing, then
change it in an effect — or decide it in CSS before React is involved.

The theme toggle uses this identical pattern. That is not a coincidence; one
idiom is easier to hold in your head than two.

---

## 3. Server Components vs Client Components

By default, every component in `src/app/` and `src/components/` is a **Server
Component**: it runs only at build time, and **its JavaScript is never sent to
the browser**. That is free performance.

Add `"use client"` at the top of a file and it becomes a **Client Component**:
its code ships to the browser. You need this the moment you use `useState`,
`useEffect`, `useRef`, or any `onClick`/`onMouseMove` handler.

Compare two files in this repo:

```tsx
// src/components/sections/Contact.tsx — NO "use client"
export default function Contact() {
  return <section id="contact" aria-labelledby="contact-title">…</section>;
}
```

```tsx
// src/components/Nav.tsx — needs "use client"
"use client";
import { useState } from "react";
export default function Nav() {
  const [open, setOpen] = useState(false);    // state → browser → must be client
```

**Rule of thumb:** start without `"use client"`. Add it only when the compiler
tells you to. Every file that does not need it is JavaScript your visitor never
downloads.

Note that `"use client"` is contagious downward — anything imported by a client
component also ends up in the browser bundle.

### A worked example of that cost

`Footer.tsx` used to be a client component for one reason: a "Back to top" button
with an `onClick` that called `window.scrollTo`. That was also a bug — Lenis owns
the scroll position on this site, and a native `scrollTo` writes to it underneath
Lenis's animation loop.

The obvious fix was to call Lenis directly instead, through its React hook. It
worked, and it cost **5 kB** of JavaScript on first load. Importing `lenis/react`
in the footer pulled the whole library into the *page's* bundle, on top of the
layout bundle that already contained it.

The better fix was to stop using JavaScript at all:

```tsx
// src/components/sections/Footer.tsx — no "use client" any more
<a href="#top" className="totop">Back to top ↑</a>
```

Lenis intercepts in-page anchor links itself (`anchors: true` in
`Providers.tsx`), so the scroll is still smooth and still driven by the one
shared loop. The footer now ships **zero** JavaScript, and the control works with
JavaScript disabled.

**The general lesson:** "which element should this be?" is often a performance
question as well as a semantic one. Moving the reader to a location is
navigation, so it wanted a link, not a button — and the correct element happened
to be the free one.

---

## 4. Dependencies: what each one is, and why it is here

```
next react react-dom          the framework
typescript @types/*           types (dev only)
tailwindcss @tailwindcss/postcss   CSS build (dev only)
gsap                          scroll animation
lenis                         smooth scrolling
```

That is the whole list — **five** runtime packages. It was seven until
2026-07-27; the two that left are the subject of the last two sections in this
chapter, because how a dependency gets removed is more instructive than how one
gets added.

**"dev only"** means the package is used while building and never shipped to the
visitor. That distinction matters for both bundle size and security: a
vulnerability in a dev dependency cannot be reached by a visitor's browser.

### `next` · `react` · `react-dom`

React describes the UI; Next turns it into a real website (routing, server
rendering, image optimisation, bundling). `react-dom` is React's browser adapter
— you never import it directly, but React cannot render to a page without it.

Concretely, Next earns its place here through features you would otherwise build
yourself:

```tsx
// src/components/ProfilePhoto.tsx — next/image
<Image src={profile} fill sizes="(max-width: 860px) 340px, 480px" placeholder="blur" />
```

That one tag converts the photo to WebP, generates 16 sizes, serves the right one
per screen, delays loading until it is scrolled near, and shows a blurred preview
meanwhile. Measured on this site: **121 KB → 44.8 KB**. Hand-writing that is a
day of work.

### `gsap` — the animation engine

Used in 10 components. It is here because **React state is the wrong tool for
animation**.

If you animated with state, you would re-render the component ~60 times a second:

```tsx
// DON'T — 60 re-renders per second
const [y, setY] = useState(0);
```

GSAP writes to the DOM node directly and never touches React:

```tsx
// src/components/sections/Work.tsx (condensed)
const root = useRef<HTMLElement>(null);   // a handle on the real DOM element

useEffect(() => {
  const cases = gsap.utils.toArray<HTMLElement>(".case", root.current);
  cases.forEach((c) => {
    gsap.fromTo(c, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: { trigger: c, start: "top 85%", once: true },
    });
  });
}, []);
```

`useRef` gives you the actual DOM element; `useEffect` runs after it exists.
**Together they are the standard "let a non-React library touch the DOM" recipe.**
You will see this exact shape in `Hero`, `Skills`, `Marquee`, `Aurora` and
`ProfilePhoto`.

`ScrollTrigger` is the GSAP plugin that ties an animation to scroll position —
that is what drives the stacking case-study cards.

### `lenis` — smooth scrolling

Makes the wheel glide instead of jumping. It matters here for a second reason:
GSAP's scroll animations must agree with Lenis about the current scroll position,
so both are driven from **one** animation loop:

```tsx
// src/components/Providers.tsx
function update(time: number) {
  lenisRef.current?.lenis?.raf(time * 1000);  // gsap counts seconds, lenis wants ms
}
gsap.ticker.add(update);
```

Two independent loops would drift apart and the scroll animations would stutter.

Lenis is also why the mobile menu locks scrolling with `lenis.stop()` instead of
setting `overflow: hidden` — see [D08](./DECISIONS.md#d08--scroll-lock-goes-through-lenis-not-through-our-own-overflow).

### `typescript` — types

TypeScript is JavaScript plus type annotations, checked before the code runs. Its
value here is concrete:

```ts
// src/lib/content.ts
export type SkillLevel = 1 | 2 | 3 | 4 | 5;
```

That says a skill level can only be one of five numbers. Writing `level: 7` is a
build error, not a subtly wrong dot count discovered months later. `tsc --noEmit`
means "check the types, produce no output".

### `tailwindcss` — honestly, barely used here

Tailwind lets you style with utility classes (`class="flex gap-4"`). **This
project uses exactly one of them** — `object-cover` in `Work.tsx:154`.

Everything else is hand-written CSS in `globals.css`, built around CSS custom
properties:

```css
:root              { --accent: #c8ff3d; }   /* dark theme  */
[data-theme=light] { --accent: #546f00; }   /* light theme */

.btn.primary { background: var(--accent); }
```

Flipping one attribute on `<html>` re-skins the entire site. That is a legitimate
choice for a design this bespoke — the animation-heavy, one-off styling here does
not benefit much from utilities. But it does mean Tailwind is mostly paying for
its CSS reset. See [F29](./AUDIT-2026-07-26.md#f29).

**If you are learning:** do not conclude "Tailwind is unnecessary". Conclude that
this particular design was hand-built, and the tool was kept for the reset and
the option to use it.

### `framer-motion` — removed, and what it actually cost

A React animation library. It was used in **exactly one file** — `Counter.tsx`,
for the counting-up numbers in the stats row — on a site that already loads GSAP,
which can do the same job.

The audit that flagged it was careful to say the *bundle* cost was unmeasured; it
only knew the package was 5.4 MB on disk, which is not the same thing. When it
was finally removed on 2026-07-27, the real number turned out to be substantial:

```
Route /            32.1 kB → 10.4 kB
First Load JS       196 kB → 174 kB
```

The replacements were all things already present:

| framer-motion | replaced with |
| --- | --- |
| `animate` | `gsap.to` on a plain object |
| `useInView` | `IntersectionObserver` |
| `useReducedMotion` | `window.matchMedia(...)` |

**Two lessons for your own projects.** First, "we already have a tool that does
this" is worth asking before every `npm install`. Second — and less obvious —
**measure before and after, because both the optimistic and the pessimistic guess
are usually wrong.** "It's 5.4 MB" overstated it; "tree-shaking will handle it"
would have understated it.

### `lucide-react` — removed, and worth knowing why

An icon library that used to be in `dependencies`. **It was never imported
anywhere in `src/`.** Because nothing imported it, tree-shaking kept it out of
the bundle entirely, so it cost visitors **zero bytes** — which is exactly why it
survived unnoticed for the life of the project.

The cost was elsewhere: 37 MB in `node_modules`, install time on every clean
checkout and CI run, and one more package in the supply-chain surface for no
benefit. Removed on 2026-07-27 ([F27](./AUDIT-2026-07-26.md#f27)).

**The lesson is the checking, not the package.** "It doesn't affect bundle size"
is not the same as "it's free". Here is how to check any dependency yourself:

```bash
grep -r "from \"some-package\"" src/     # no output = nothing imports it
npm uninstall some-package               # then confirm the build still passes
```

---

## 5. Where things live

```
src/
  app/
    layout.tsx      wraps every page: <head>, metadata, fonts, providers
    page.tsx        the section order of the single page
    globals.css     the entire design system
    sitemap.ts      generates /sitemap.xml
  components/
    sections/       the visible page sections (Hero, About, Work, …)
    *.tsx           reusable pieces (Nav, Loader, Cursor, Reveal, Counter)
  lib/
    content.ts      ALL text and data
    fonts.ts        font setup
    intro.ts        loading-screen session flag
  fonts/  assets/   self-hosted font files, the profile photo
public/             files served as-is at the site root (og.png, favicons, the CV PDF)
```

### Suggested reading order

1. **`src/lib/content.ts`** — plain data, no React. Shows you what the site says.
2. **`src/app/page.tsx`** — 20 lines; the section order.
3. **`src/components/sections/Contact.tsx`** — the simplest section, no client JS.
4. **`src/components/sections/Hero.tsx`** — your first animation.
5. **`src/app/globals.css`** — the design tokens at the top explain the rest.
6. **`src/components/Nav.tsx`** — the most involved component (state, effects,
   focus management, accessibility) once the rest makes sense.

---

## 6. Patterns you will see repeatedly

### Content is separated from presentation

Every string lives in `src/lib/content.ts`; components only decide how to display
it:

```tsx
// src/components/sections/Experience.tsx
{experience.map((e) => (
  <Reveal className="item" key={e.role}>
    <div className="yr">{e.year}</div>
```

**Why:** changing your job title should not require opening a React file. It also
means one place to check when you ask "does the site claim anything untrue?".
The answer is checked against two documents: the project record
(`FORM UPDATE KOMPETENSI & PENGALAMAN PROJECT.md`) and the CV in `public/`
([D15](./DECISIONS.md#d15--positioning-follows-the-cv)).

**One documented exception:** the three About paragraphs live in `About.tsx`,
because each carries its own `<strong>` / `<span class="dim">` emphasis and a
plain string array cannot express that. `content.ts` used to *also* hold a
`bio[]` copy of them that nothing rendered — two sources of truth, quietly
drifting. It was deleted, and a comment at its old location points here
([F33](./AUDIT-2026-07-26.md#f33)).

When you cannot centralise something, delete the copy that lies rather than keep
a decorative one.

The same principle applied to the skill scale fixes a real bug — the legend and
the dots now render from one array, so they cannot disagree
([D04](./DECISIONS.md#d04--one-source-of-truth-for-the-proficiency-scale)).

### Every animation checks reduced motion

```tsx
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduced) {
  gsap.set(cases, { opacity: 1, y: 0 });   // jump straight to the visible state
  return;
}
```

**Why:** "prefers reduced motion" is an operating-system setting. For people with
vestibular disorders, large scroll animations cause genuine nausea. This is not
decoration — it is the difference between a usable site and an unusable one.

**The detail that matters most:** the reduced-motion branch sets content to
*visible*. A common beginner bug is to skip the animation and leave elements at
`opacity: 0` forever — an invisible page for exactly the users you were trying to
accommodate.

### Effects clean up after themselves

```tsx
useEffect(() => {
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);  // ← cleanup
}, [open]);
```

**Why:** the function you return runs when the component disappears or before the
effect re-runs. Without it, listeners, intervals and animations pile up every
time — a memory leak, and handlers firing for components no longer on screen.

Anything you *start* in an effect (`addEventListener`, `setInterval`, a GSAP
timeline) must be *stopped* in the cleanup.

### `?.` and `try/catch` around browser APIs

```tsx
try {
  localStorage.setItem("theme", next);
} catch {
  /* private mode — ignore */
}
```

**Why:** `localStorage` **throws** in some privacy modes. Unhandled, that error
breaks the theme toggle entirely. The site should degrade, not die.

---

## 7. How not to break things

Load-bearing details, each commented at the source. Fuller list in
[`HANDOVER.md`](./HANDOVER.md#traps-worth-knowing-before-you-edit).

| Do not | Because |
| --- | --- |
| Read `localStorage`/`sessionStorage` while rendering | Hydration mismatch — see §2 |
| Delete `html[data-intro="played"]` in `globals.css` | The loading screen flashes on every reload |
| Add a `font-weight` to CSS without adding the file in `lib/fonts.ts` | The browser fakes the weight and it looks wrong |
| Lighten `--bg` or `--bg-2` without re-checking contrast | The measured AA ratios in the token comments stop holding |
| Write a colour straight into a rule next to a theme token | It escapes the contrast check and can break in the other theme ([F40](./AUDIT-2026-07-26.md#f40)) |
| Change the 760px breakpoint in only one place | It exists in `Nav.tsx` **and** `globals.css` |
| Leave content at `opacity: 0` in a reduced-motion branch | Invisible page for those users |
| "Simplify" `Counter` back to `useState(0)` | It is server-rendered, so the static HTML would again claim 0 years of experience |
| Turn the footer's "Back to top" link into a button | Costs 5 kB and breaks it without JS — see §3 |
| Add a `marquee[]` item that is not in `skills[]` | The marquee is `aria-hidden` because it repeats Skills ([D16](./DECISIONS.md#d16--the-marquee-is-decorative)) |
| Make `site.tagline` long | It renders in the loader, the hero name line and the `<title>`, in uppercase mono on a 390 px screen |
| Run `npm audit fix --omit=dev` | It deletes every dev dependency from `node_modules` |

### When something breaks

1. **Read the error.** Next's messages usually name the file and line.
2. **Check the browser console** (F12). Hydration mismatches only appear there.
3. **`npx tsc --noEmit`** — type errors often explain a confusing runtime bug.
4. **Delete `.next/` and rebuild** if behaviour looks impossible; stale build
   cache does happen.
5. **`npm run build`** before concluding it works. Dev is more forgiving than
   production.

---

## 8. Glossary

| Term | Meaning |
| --- | --- |
| **SSR** | Server-Side Rendering — HTML generated before the browser gets it |
| **Hydration** | React attaching to server-rendered HTML in the browser |
| **Client Component** | Marked `"use client"`; its JS ships to the browser |
| **Server Component** | The default; runs at build time, ships no JS |
| **Bundle** | The JavaScript sent to the visitor |
| **Tree-shaking** | Dropping code nothing imports (why an unused dependency can cost 0 bytes and still be worth removing) |
| **CSS custom property** | A `--variable` in CSS; how theming works here |
| **Ref** | A handle on a real DOM element, for libraries like GSAP |
| **Effect** | Code that runs after render, browser-only |
| **WCAG AA** | Accessibility standard; text needs 4.5:1 contrast |
