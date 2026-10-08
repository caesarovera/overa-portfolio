# Design & Hiring-Effectiveness Review — Overa Portfolio

| | |
| --- | --- |
| **Date** | 2026-09-16 |
| **Reviewer** | Design/UX pass, from an HR / hiring-manager reading perspective |
| **Scope** | Visual design, content strategy, and conversion effectiveness — **not** a code or accessibility audit (see [`AUDIT-2026-07-26.md`](./AUDIT-2026-07-26.md) for that) |
| **Method** | Full read of `src/`, `content.ts`, and `globals.css`, plus a locally-run build screenshotted with a headless browser at desktop (1440×900, dark + light) and mobile (390×844) breakpoints, scroll-triggered animations included |
| **Companion docs** | [`AUDIT-2026-07-26.md`](./AUDIT-2026-07-26.md) (engineering) · [`HANDOVER.md`](./HANDOVER.md) (open blockers) · [`DECISIONS.md`](./DECISIONS.md) (why things are the way they are) |

---

## Status as of 2026-10-08

This review is a snapshot of 2026-09-16 and is not rewritten. Progress since, per
finding. Current task list: [`HANDOVER.md`](./HANDOVER.md#next-up).

| ID | Status | What changed |
| --- | --- | --- |
| D01 | Open | No screenshots or diagrams yet |
| D02 | Open | Impact rows still qualitative. The CV has one figure (~25% faster DB responses) not yet tied to a project |
| D03 | ✅ Done | "Overa Caesar" in the `<title>`, JSON-LD (with `sameAs`), footer, and on its own line in the hero |
| D04 | Half done | `site.github` filled; `site.url` waits on a domain |
| D05 | Partly | Name and role now lead the hero, and the CTAs are View Work + Download CV. The slogan and its size are unchanged; browser testing on 10-08 found the CTAs below the fold on iPhone SE, Galaxy S8, phones in landscape, iPad landscape and laptops |
| D06 | ✅ Done | CV PDF linked from the hero and Contact |
| D07 | Open | Visual language unchanged |
| D08 | ✅ Moot | The AI skills and their 2/5 dots were removed when positioning moved to the CV ([DECISIONS D15](./DECISIONS.md#d15--positioning-follows-the-cv)) |
| D09 | ✅ Moot | The AI pivot was dropped rather than backed with an artefact (D15) |
| D10 | Partly | The `Now` section is gone. Stats, Marquee, loader and the motion chrome remain |

**Found since, in browser testing on 2026-10-08** ([`HANDOVER.md` → Browser test](./HANDOVER.md#browser-test--2026-10-08)):
the fixed nav has no background and covers text on every phone; the photo badge
is unreadable in the light theme ([F40](./AUDIT-2026-07-26.md#f40)); several
touch targets are under 44 px. These add to D05 and D07 rather than replace them.

---

## 1. Verdict

| | Score | Note |
| --- | --- | --- |
| **Engineering quality** | 8 / 10 | Confirmed by the 2026-07-26 audit — not re-litigated here |
| **Visual polish** | 7 / 10 | Competently executed dark-mode editorial style, consistent tokens, good motion craft |
| **Hiring effectiveness** | **4 / 10** | Reads as a template, not as evidence. The design doesn't cost the candidate an interview by itself, but it also doesn't win one |

**The core problem is not that the design is ugly. It's that it is generic and
unproven.** Nearly every signature visual element — dark background with a single
lime accent, blurred aurora blobs, film grain, custom cursor, count-up loader,
giant "I build things that don't break" headline, tech-stack marquee, bento skill
grid, sticky-stacking case cards — is a recognizable pattern from the current wave
of AI-assisted portfolio templates (2024–2026). A recruiter who screens many
candidates a week will pattern-match this instantly, and pattern-matched pages get
skimmed, not read.

The second and more damaging problem: **zero visual proof of any of the 13 listed
projects.** Every featured case card shows a three-letter glyph and decorative
rings where a screenshot or diagram should be.

---

## 2. Findings at a glance

10 findings, ranked by how much each one costs the candidate at the moment a
recruiter is deciding whether to keep reading.

| ID | Severity | Finding |
| --- | --- | --- |
| [D01](#d01) | 🔴 Critical | No visual evidence for any of the 6 featured case studies |
| [D02](#d02) | 🔴 Critical | Case study `Impact` rows are all qualitative, unverifiable, and vague |
| [D03](#d03) | 🔴 Critical | Real name never appears anywhere on the page |
| [D04](#d04) | 🔴 Critical | Placeholder values still live (`github`, `site.url`) — GitHub link 404s |
| [D05](#d05) | 🟠 High | Hero doesn't fit one screen and leads with a generic slogan, not identity |
| [D06](#d06) | 🟠 High | No CV/resume download anywhere on the site |
| [D07](#d07) | 🟠 High | Visual language matches the current "AI portfolio template" pattern |
| [D08](#d08) | 🟡 Medium | Skill proficiency dots publicly advertise weakness in the target field (AI/LLM) |
| [D09](#d09) | 🟡 Medium | No real AI/LLM artifact exists despite the site's stated pivot |
| [D10](#d10) | 🟢 Low | Redundant/decorative content dilutes signal (triple-repeated stat, empty Stats/Marquee sections, heavy motion chrome) |

---

## 3. Findings in detail

### D01
**No visual evidence for any of the 6 featured case studies.**

`Work.tsx` falls back to a glyph (`NPK`, `MYT`, `AIA`, `SMG`, `PBI`, `TAS`) plus
decorative rings whenever `CaseStudy.image` is unset — and it is unset for all 13
entries in `content.ts` (the `image` field is present only as a commented-out
placeholder). On desktop this leaves the entire right half of every case card,
roughly 50% of its area, carrying no information at all.

**Why it matters:** a case study without a screenshot, diagram, or artifact is
indistinguishable from a fabricated one. HR and hiring managers weight visual
proof heavily because it's the fastest way to verify a claim.

**Fix:** for each featured project, add either (a) a cropped/blurred screenshot
of the real UI (`public/work/*.webp`, already wired up in `CaseStudy.image` —
just needs the files), or (b) for projects that can't be shown for confidentiality
reasons, a simple architecture diagram (API → queue → DB → SPA) built specifically
for that project.

---

### D02
**Case study `Impact` rows are all qualitative, unverifiable, and vague.**

Examples straight from `content.ts`: *"Digitized non-container cargo operations
across multiple departments,"* *"Reliable container yard operations tracking and
reporting,"* *"Unified operational visibility across departments."* This is
already flagged as an open blocker in `HANDOVER.md` (`## Still blocked on real
data`, carried since 2026-06-27) with a table of exactly which figures are
missing for which project (NPKTOS, MYTOS, AIA, SIMONGKA, Power BI, TAS).

**Why it matters:** vague impact statements are the single most common tell of a
padded or fabricated resume. Numbers, even modest ones, read as credible; adjectives
don't.

**Fix:** follow the existing `HANDOVER.md` table. Pull real figures (department
counts, daily transaction volume, user counts, years live) from source records.
Where no number exists, sharpen the sentence using facts already in `Context`/
`Approach` rather than inventing a metric — the project's own documentation
explicitly warns against fabricating these.

---

### D03
**Real name never appears anywhere on the page.**

`site.name` is `"Overa"` and feeds the `<title>`, JSON-LD `Person.name`, and the
footer. The nav wordmark renders `O/era`. Nowhere in the rendered HTML does the
candidate's actual legal/professional name appear.

**Why it matters:** recruiters search for and reference people by name. A
portfolio branded entirely under a stylized handle makes it harder to cross-reference
against a CV, LinkedIn profile, or email signature, and reads as an agency/brand
site rather than a personal one.

**Fix:** set `site.name` to the real name; keep `"Overa"` as a separate visual
brand mark in the nav if desired, but the `<title>`, JSON-LD, footer, and at
minimum one place in the hero should show the real name.

---

### D04
**Placeholder values still live.**

Per `README.md`'s own personalization table: `site.github` is literally the
string `"[YOUR GITHUB]"`, which `Contact.tsx` renders as `href="[YOUR GITHUB]"` —
a broken relative link. `site.url` is still `"https://your-domain.com"`, which
feeds `metadataBase`, canonical tag, OG/Twitter images, JSON-LD, and the sitemap.

**Why it matters:** a recruiter who clicks "GitHub" and gets a 404 loses trust
instantly, and it happens on the very first interaction most technical evaluators
make.

**Fix:** fill both fields before any further sharing of the link. This is flagged
as P0 in the engineering audit as well ([F01](./AUDIT-2026-07-26.md#f01)) — not a
new finding, but directly relevant to hiring effectiveness.

---

### D05
**Hero doesn't fit one screen and leads with a generic slogan, not identity.**

At 1440×900 (a common laptop viewport) the visible hero content is the four-line
headline "I build systems that don't break." — the subheading is cut off mid-sentence
and both CTAs sit below the fold. The headline itself is a stock phrase that
appears across many developer portfolios and says nothing project-specific.

**Why it matters:** the first five seconds decide whether a recruiter keeps
scrolling. That window should establish who the candidate is, what they do, and
what to do next (view work / get CV) — not a mood-board tagline.

**Fix:** shrink the headline to ~72–96px, cap it at two lines, replace the slogan
with a specific claim ("Senior PHP/Laravel engineer — 7 years on port & logistics
operational systems"), and ensure name, role, and both CTAs are visible without
scrolling on a 900px-tall viewport.

---

### D06
**No CV/resume download anywhere on the site.**

Contact section offers email, GitHub, and LinkedIn only. No PDF resume link
exists in `content.ts`, `Contact.tsx`, or anywhere else in the codebase.

**Why it matters:** a downloadable CV is one of the most commonly expected
actions on a candidate's own site — recruiters frequently want to save/forward
a PDF rather than screenshot a webpage.

**Fix:** add a "Download CV" button in the hero and/or Contact section, backed by
a PDF kept in sync with the site's own content (a `/cv` route rendered from the
same `content.ts` data would prevent the two from drifting apart).

---

### D07
**Visual language matches the current "AI portfolio template" pattern.**

Taken individually, none of these are bad execution — the audit already confirms
the code is clean. But taken together, the specific *combination* of dark
background + one neon accent (`--accent: #c8ff3d`) + aurora blur blobs + film
grain overlay + custom lagging cursor + count-up loading screen + giant serif-free
slogan headline + scrolling tech marquee + tilt-on-hover bento grid + sticky
stacking case cards is now a widely recognized template signature, not a
distinctive one.

**Why it matters:** distinctiveness is part of what a portfolio is supposed to
sell for a developer positioning themselves as a careful, senior engineer. A
template-recognizable design undercuts that positioning before a single line of
copy is read.

**Fix:** see [§4](#4-recommended-direction) below — pick one of three concrete
alternate directions rather than subtracting elements piecemeal.

---

### D08
**Skill proficiency dots publicly advertise weakness in the target field.**

`Skills.tsx` renders a 1–5 dot scale for every tool. In the exact area the
candidate is trying to pivot into, the dots read: Python 2/5, RAG 2/5, LLM apps
2/5, MCP 2/5. The `Now` section compounds this with literal percentage bars:
"Python fundamentals 50%," "RAG & embeddings 30%," "LLM app patterns 30%."

**Why it matters:** self-rated proficiency scores are inherently soft, and here
they happen to sit directly under the section a hiring manager for an AI role
would look at first. Showing "2 out of 5" next to the exact skills a job posting
requires reads worse than not showing a number at all.

**Fix:** for the target/pivot skills, drop the numeric scale entirely and use
plain groupings instead ("Production," "Currently building with") or replace
self-rating with evidence (a shipped RAG demo, a repo) per [D09](#d09).

---

### D09
**No real AI/LLM artifact exists despite the site's stated pivot.**

`role`, `heroSubTailEmphasis`, `learning[]`, and an entire `Now` section all
message "moving into AI engineering," but no project, repo, or demo backs the
claim anywhere on the site.

**Why it matters:** an AI-focused hiring manager will not reach out on stated
intent alone. A stated pivot with zero shipped evidence reads as aspirational,
which is a weaker signal than no mention at all.

**Fix:** ship at least one small, real, public artifact before leaning on the
pivot messaging — e.g., a RAG demo over port-operations SOP documents, or an
agent that queries the terminal-operations data model. Link the repo and a short
write-up. Until that exists, consider shrinking the AI-pivot messaging to a single
understated line rather than a dedicated section with progress bars.

---

### D10
**Redundant/decorative content dilutes signal.**

- The figure "7+" (years of experience) is shown three separate times: hero
  subheading, the Skills bento "Experience" cell, and the Stats band.
- The Stats and Marquee sections add scroll length without adding information the
  rest of the page doesn't already carry.
- Loader (~2.5s on every fresh session), custom cursor, film grain, aurora blobs,
  3D tilt on every card, cursor-following spotlight glow, and a magnetic-button
  effect are all present simultaneously. None of them carry information; together
  they add real weight to first impression and page length.
- On mobile the page runs to roughly 15,800px because all 13 projects — featured
  and non-featured — render with near-equal density, leaving no fast way to scan.

**Why it matters:** every element that doesn't carry information competes for
attention with the few that do (the actual project results). For a candidate whose
pitch is "I build systems that don't break," a page with this much decorative
chrome is a mild tonal mismatch.

**Fix:** see [§4](#4-recommended-direction). Consolidate Stats into the hero as a
single inline stat row, drop or fold Marquee into the About/Skills copy, and
retain at most one restrained scroll-reveal transition sitewide.

---

## 4. Recommended direction

Ordered by leverage — earlier items matter more than later ones, and items in
Phase 1 cost no redesign work at all.

### Phase 1 — Content & proof (do this first; no visual redesign required)
1. Fill in real name everywhere ([D03](#d03)).
2. Fill in `site.github`, `site.url`, add a CV download ([D04](#d04), [D06](#d06)).
3. Add real screenshots or purpose-built architecture diagrams for the featured
   case studies ([D01](#d01)).
4. Replace every qualitative `Impact` row with a real figure, per the table
   already in `HANDOVER.md` ([D02](#d02)).
5. Cut featured case studies from 6 to 3–4 strongest (TAS, AIA, MYTOS, Power BI
   are the strongest candidates); move the rest to the compact grid.
6. Ship one real, public AI/LLM artifact before leaning further on pivot
   messaging ([D09](#d09)).

### Phase 2 — Hero & structure
- Rebuild the hero to fit one screen at 1366×768 and 1440×900: real name,
  specific role line, location/remote status, two CTAs (View Work, Download CV),
  and one piece of visual proof (best project screenshot or diagram) — replacing
  the four-line slogan headline.
- New section order: Hero → Selected Work (3–4 cases with visuals) → Experience →
  About + photo → Skills (condensed) → Contact. Fold Stats into the hero; drop or
  merge Marquee and Now.
- Replace the 1–5 dot skill scale with two plain groups ("Production," "Learning")
  and drop the percentage bars.

### Phase 3 — Visual language
Retire the loader, custom cursor, film grain, aurora blobs, marquee, magnetic
button, tilt-on-hover, and sticky-stacking cards. Keep one simple fade/slide-in
on scroll and the theme toggle. This also removes the Lenis dependency and most
of the GSAP surface area, which should help load performance.

Replace the current look with one of three directions that reads as intentional
rather than templated — **Editorial Technical (recommended)** best matches an
"operational systems engineer" positioning:

| Direction | Description |
| --- | --- |
| **Editorial Technical** (recommended) | Off-white or deep charcoal background, serif or high-contrast display type for headings, monospace for data, thin-line document-style grid, one muted accent (deep blue or terracotta, not neon). Case studies laid out like a spec document: context → decision → result, with a screenshot or diagram in a fixed side column. |
| **Clean Brutalist** | White background, thick black borders, zero border-radius, zero blur/glow. Strong contrast with the current dark-neon template pattern; reads well for backend/infra-focused engineers. |
| **Dark Minimal** | Keep dark mode and the lime accent, but strip all glow/blur/grain. Accent reserved for links and exactly one highlight per screen. |

### Phase 4 — Conversion details for HR
- Contact: add "Copy email" and, if willing, a scheduling link, plus a second CV
  link.
- Each featured case study: add a "My role" line (solo vs. team size, which part
  was owned) — a question HR consistently asks.
- Split the Experience timeline by formal position/title with exact dates instead
  of two merged blocks, and keep it consistent with LinkedIn.
- Serve the CV as a `/cv` page rendered from the same `content.ts` data (rather
  than a hand-maintained PDF) so the site and CV can never drift apart.

---

## 5. What to keep

Code quality, accessibility work, reduced-motion handling, self-hosted fonts,
centralized content in `content.ts`, and the real profile photo are all solid and
should carry over unchanged. Phase 3's visual reset removes the decorative
layer sitting on top of that foundation — it doesn't touch the foundation itself.
