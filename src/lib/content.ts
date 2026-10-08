// ---------------------------------------------------------------------------
// SITE CONTENT — edit everything here. The [BRACKET] fields are placeholders
// you should personalize before deploying.
// ---------------------------------------------------------------------------

export const site = {
  name: "Overa Caesar", // page title, JSON-LD, footer
  /** The nav's stylised lockup, rendered as O/era with the slash in accent
   *  colour. It is NOT a decomposition of the wordmark: `sep` is a slash
   *  standing in for the letter "v", so `left + right` spells "Oera", not
   *  "Overa". Use `wordmark` below when you need the readable name. */
  brandMark: { left: "O", sep: "/", right: "era" },
  /** The brand name spelled out, for the loading screen's animated letters.
   *  Separate from `name` on purpose: `name` also feeds JSON-LD and the page
   *  title with the full name, and the wordmark animation spells the short
   *  brand. */
  wordmark: "Overa",
  tagline: "Senior PHP / Laravel Developer", // loading screen, hero name line, <title> suffix
  role: "Senior PHP / Laravel Developer, Backend & Full Stack", // JSON-LD Person.jobTitle
  location: "Bogor, West Java, Indonesia",
  availability: "Open to remote and onsite roles",
  heroSub:
    "7+ years of backend and full-stack PHP work in digital media and port logistics.",
  /** Second half of the hero subheading. Split from `heroSub` because the last
   *  phrase is emphasised in the markup. */
  heroSubTail: "Since 2021 I have been building",
  heroSubTailEmphasis: "port operations systems for Pelabuhan Tanjung Priok",
  heroStackHint: "Laravel 12 · CodeIgniter 3 · Vue 3 · PostgreSQL · Oracle",
  /** Footnote under the Contact heading, rendered after `location`. */
  contactMeta: "Remote or onsite · Replies within 24h",
  /** Footer sign-off. The year is not stored here — it is computed at build time. */
  footerNote: "built with care, hardened by habit.",
  seoDescription:
    "Senior PHP / Laravel developer with 7+ years of backend and full-stack work in digital media and port logistics: Laravel 12, CodeIgniter 3, Vue 3, PostgreSQL, and Oracle.",
  ogDescription:
    "Backend and full-stack PHP / Laravel work for digital media and port logistics, including terminal operations systems at Tanjung Priok.",
  email: "caesarovera@gmail.com",
  github: "https://github.com/caesarovera",
  linkedin: "https://www.linkedin.com/in/overa-caesar/",
  /** Served from /public. */
  cv: "/CV_Overa_Caesar_EN.pdf",
  url: "https://your-domain.com", // used for SEO / OpenGraph / sitemap
};

export const heroLines: string[] = [
  "I build",
  "systems",
  "that {don't}", // {…} = rendered in accent color
  "{break.}",
];

// The About prose is NOT here. It lives inline in components/sections/About.tsx
// because each paragraph carries its own <strong>/<span class="dim"> emphasis,
// and a plain string array cannot express that. A `bio[]` export used to sit at
// this spot holding a second, drifting copy of the same three paragraphs that
// nothing rendered — edit About.tsx instead.

export type Stat = { value: number; suffix: string; label: string };
export const stats: Stat[] = [
  { value: 7, suffix: "+", label: "years architecting production backend systems" },
  // No "+" here on purpose: work[] below holds exactly 13 entries, and claiming
  // more than the page actually shows is the kind of thing a reader checks.
  { value: 13, suffix: "", label: "enterprise systems shipped in media, port & logistics" },
  { value: 5, suffix: "", label: "years building port & logistics operational systems" },
];

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

/** The proficiency scale — single source of truth.
 *  The Skills section renders BOTH the per-tag dots and the legend from this
 *  array, so the legend can no longer drift out of sync with what the dots mean
 *  (it previously hard-coded 4-of-5 filled dots for every level). */
export const skillScale: { level: SkillLevel; label: string }[] = [
  { level: 1, label: "Learning" },
  { level: 2, label: "Basic" },
  { level: 3, label: "Working" },
  { level: 4, label: "Proficient" },
  { level: 5, label: "Expert" },
];

/** A skill tag — either a plain concept string, or a tool with a level on `skillScale`. */
export type SkillTag = string | { name: string; level: SkillLevel };

export type SkillCell = {
  title: string;
  span: "big" | "wide" | "mid" | "feature";
  tags?: SkillTag[];
  heading?: string;
  tilt?: boolean;
  /** `feature` cells only: the caption under the counter. The figure itself is
   *  read from `stats[0]`, never repeated here — Skills.tsx used to hard-code
   *  its own `7`, so bumping the years in one place left the other stale. */
  counterLabel?: string;
};
export const skills: SkillCell[] = [
  {
    title: "Architecture & craft",
    span: "big",
    heading: "Production hardening as a default, not an afterthought.",
    tilt: true,
    // Concept tags (patterns/practices) — no level dots, these aren't "tools".
    tags: [
      "Decoupled API + SPA",
      "DTOs / Actions / Repositories",
      "Idempotency",
      "Pessimistic locking",
      "Queue reliability",
      "Redis caching",
      "Automated tests · Pest & PHPUnit",
    ],
  },
  // Rendered as the counter cell; the number comes from stats[0].
  { title: "Experience", span: "feature", counterLabel: "years shipping enterprise software" },
  {
    title: "Languages",
    span: "mid",
    tilt: true,
    tags: [
      { name: "PHP", level: 5 },
      { name: "TypeScript", level: 3 },
      { name: "SQL", level: 4 },
    ],
  },
  {
    title: "Backend",
    span: "wide",
    tilt: true,
    tags: [
      { name: "Laravel", level: 5 },
      { name: "CodeIgniter", level: 5 },
      { name: "CakePHP", level: 3 },
      { name: "REST API design", level: 5 },
      { name: "Sanctum", level: 4 },
    ],
  },
  {
    title: "Frontend",
    span: "mid",
    tilt: true,
    tags: [
      { name: "Vue 3", level: 3 },
      { name: "Inertia.js", level: 3 },
      { name: "Tailwind CSS", level: 3 },
    ],
  },
  {
    title: "Databases",
    span: "mid",
    tilt: true,
    tags: [
      { name: "PostgreSQL", level: 4 },
      { name: "Oracle", level: 3 },
      { name: "MySQL", level: 4 },
    ],
  },
  {
    title: "Data / BI",
    span: "mid",
    tilt: true,
    tags: [
      { name: "Power BI", level: 3 },
      { name: "DAX", level: 3 },
    ],
  },
  {
    title: "Tooling",
    span: "wide",
    tilt: true,
    tags: ["Git & GitHub", "Docker", "CI/CD · GitHub Actions", "PHPStan", "Postman"],
  },
];

export type CaseStudy = {
  no: string;
  glyph: string;
  title: string;
  client: string;
  period: string;
  /** Role on the project, from the source record (Backend / Full-stack / Data / BI). */
  role: string;
  stack: string[];
  rows: { k: string; v: string }[];
  /** Optional: path to a processed screenshot in /public (e.g. "/work/tas.webp").
   *  Ideal size: 1200×800px WebP. Blur/crop sensitive data before using.
   *  Only used by featured cards — a missing image falls back to the glyph visual,
   *  so projects with no screenshot are fine. */
  image?: string;
  /** Featured → rendered as a large sticky case card. Non-featured → shown in the
   *  compact "More work" grid (no visual needed). Flip this flag to re-tune. */
  featured?: boolean;
  /** Public URL, for the few projects that can actually be inspected. Most of
   *  this work is internal enterprise software behind a login, so this is rare
   *  and deliberately optional — only set it where the source record carries a
   *  verified URL.
   *
   *  TRAP: currently rendered by the compact "More work" cards only, because no
   *  featured project is public. Setting this on a `featured` entry does nothing
   *  until Work.tsx's case-card branch renders it too. */
  url?: string;
};
export const work: CaseStudy[] = [
  // sorted ascending by period start date
  {
    no: "01 / Okezone CMS",
    glyph: "OKZ",
    title: "Okezone CMS",
    client: "Okezone",
    period: "November 2018 – July 2019",
    role: "Backend",
    url: "https://www.okezone.com",
    stack: ["PHP", "CodeIgniter 3", "MySQL", "jQuery"],
    rows: [
      { k: "Context", v: "Backend development and maintenance of the CMS for the Okezone.com news portal — one of Indonesia's major online news platforms." },
      { k: "Approach", v: "Backend modules for content publishing and article management pipelines using PHP and CodeIgniter 3. Collaborated with frontend teams for CMS-frontend integration." },
      { k: "Impact", v: "Continuous CMS availability and editorial workflow continuity for Okezone.com." },
    ],
  },
  {
    no: "02 / MNC Energy",
    glyph: "ENR",
    title: "MNC Energy Website",
    client: "PT. Media Nusantara Citra Tbk",
    period: "February 2019 – September 2020",
    role: "Full-stack",
    url: "https://mncenergy.com",
    stack: ["Laravel", "PHP", "MySQL", "jQuery"],
    rows: [
      { k: "Context", v: "Corporate website platform for MNC Energy — CMS, REST API, and fullstack frontend." },
      { k: "Approach", v: "Laravel CMS for dynamic content management, RESTful API endpoints for frontend consumption, and responsive Blade frontend." },
      { k: "Impact", v: "Production corporate website for MNC Energy (mncenergy.com)." },
    ],
  },
  {
    no: "03 / Spinpay",
    glyph: "SPY",
    title: "Spinpay Website",
    client: "PT. Media Nusantara Citra Tbk",
    period: "July 2019 – July 2020",
    role: "Full-stack",
    stack: ["Laravel", "PHP", "MySQL", "jQuery"],
    rows: [
      { k: "Context", v: "Fullstack platform for the Spinpay digital payment brand — CMS, REST API, and public-facing frontend." },
      { k: "Approach", v: "Laravel CMS and documented RESTful API endpoints for frontend rendering and third-party service integrations. Laravel Blade frontend with jQuery-driven interactive components." },
      { k: "Impact", v: "Production CMS and API powering the Spinpay digital payment platform (spinpay.id)." },
    ],
  },
  {
    no: "04 / Carpool",
    glyph: "CAR",
    title: "Carpool Unit",
    client: "PT. Media Nusantara Citra Tbk",
    period: "November 2019 – November 2020",
    role: "Backend",
    stack: ["CakePHP 2", "PHP", "MySQL"],
    rows: [
      { k: "Context", v: "Internal corporate car-booking application for fleet management — vehicle booking requests, approval workflows, and fleet assignment." },
      { k: "Approach", v: "CakePHP 2 backend covering booking request, multi-step approval workflow, and fleet assignment. CMS interface for admin and fleet-management staff daily operations." },
      { k: "Impact", v: "Streamlined corporate car booking and fleet management for MNC Group staff." },
    ],
  },
  {
    no: "05 / MNCTV",
    glyph: "MNC",
    title: "MNCTV Website Revamp",
    client: "PT. Media Nusantara Citra Tbk",
    period: "March 2020 – November 2020",
    role: "Full-stack",
    stack: ["Laravel", "PHP", "MySQL", "jQuery"],
    rows: [
      { k: "Context", v: "Full revamp of the MNCTV public website — WebCMS development and frontend rebuild." },
      { k: "Approach", v: "WebCMS enabling editorial teams to manage news, programs, and broadcast content independently. Laravel Blade frontend with responsive layouts and dynamic CMS-to-public content rendering." },
      { k: "Impact", v: "Real-time content updates between CMS backend and the public-facing broadcast portal." },
    ],
  },
  {
    no: "06 / MDM",
    glyph: "MDM",
    title: "Master Data Management",
    client: "PT. Media Nusantara Citra Tbk",
    period: "July 2020 – November 2020",
    role: "Backend",
    stack: ["CakePHP", "PHP", "MySQL", "Oracle DB"],
    rows: [
      { k: "Context", v: "Internal Master Data Management (MDM) system for IT Application MNC Holding — centralizing and synchronizing master records across data sources." },
      { k: "Approach", v: "Backend services with CakePHP, data validation and synchronization logic bridging MySQL and Oracle DB, and a CMS interface for authorized master record management." },
      { k: "Impact", v: "Consistent, centralized master data across multiple MNC Group systems." },
    ],
  },
  {
    no: "07 / NPKTOS",
    glyph: "NPK",
    featured: true,
    title: "NPKTOS — Non-Container Terminal Operations",
    client: "PT Pelabuhan Tanjung Priok",
    period: "February 2021 – August 2023",
    role: "Full-stack",
    stack: ["CodeIgniter 3", "PHP", "PostgreSQL"],
    rows: [
      { k: "Context", v: "Non-container (bulk/general cargo) terminal operations system — cargo data entry, operational transactions, and multi-department reporting." },
      { k: "Approach", v: "Fullstack features with RESTful backend using CodeIgniter 3 + PostgreSQL. User access control and operational workflows tailored to terminal staff and supervisory roles." },
      { k: "Impact", v: "Digitized non-container cargo operations across multiple departments at the terminal." },
    ],
  },
  {
    no: "08 / MYTOS",
    glyph: "MYT",
    featured: true,
    title: "MYTOS — Container Terminal Operations",
    client: "PT Pelabuhan Tanjung Priok",
    period: "July 2021 – Present",
    role: "Full-stack",
    stack: ["CodeIgniter 3", "PHP", "MySQL"],
    rows: [
      { k: "Context", v: "Fullstack terminal operations system for yard container movement tracking and operational reporting at the port." },
      { k: "Approach", v: "Yard operation entry forms, container movement tracking, and real-time operational status monitoring. Role-based views for staff, supervisors, and management." },
      { k: "Hardened", v: "Backend business logic with MySQL for multi-user concurrent operational data management." },
      { k: "Impact", v: "Reliable container yard operations tracking and reporting across operational roles." },
    ],
  },
  {
    no: "09 / AIA",
    glyph: "AIA",
    featured: true,
    title: "Audit Internal Application",
    client: "PT Pelabuhan Tanjung Priok",
    period: "April 2024 – November 2025",
    role: "Full-stack",
    // image: "/work/aia.webp",
    stack: ["CodeIgniter 3", "PHP", "PostgreSQL", "QR signatures"],
    rows: [
      { k: "Problem", v: "A major Indonesian port operator needed traceable, multi-level audit workflows." },
      { k: "Approach", v: "Multi-level approval flows, QR-code digital signatures, role-based access control across 3 roles (auditee, auditor, lead auditor)." },
      { k: "Hardened", v: "Atomic transaction processing + race-condition prevention on the approval chain." },
      { k: "Impact", v: "Auditable, tamper-resistant approvals with one-click PDF reporting." },
    ],
  },
  {
    no: "10 / SIMONGKA",
    glyph: "SMG",
    featured: true,
    title: "SIMONGKA",
    client: "PT Pelabuhan Tanjung Priok",
    period: "August 2024 – Present",
    role: "Full-stack",
    stack: ["CodeIgniter 3", "PHP", "MySQL"],
    rows: [
      { k: "Context", v: "Internal operational monitoring and performance management platform for port operations." },
      { k: "Approach", v: "Real-time dashboards, KPI tracking modules, and departmental performance reporting with role-based views for staff, supervisors, and management." },
      { k: "Hardened", v: "Optimized database queries for performant reporting and real-time data visualization across multiple operational units." },
      { k: "Impact", v: "Unified operational visibility across departments for monitoring and performance accountability." },
    ],
  },
  {
    no: "11 / TallyHBT",
    glyph: "THB",
    title: "TallyHBT",
    client: "PT Pelabuhan Tanjung Priok",
    period: "September 2025 – June 2026",
    role: "Full-stack",
    stack: ["Laravel", "PHP", "MySQL"],
    rows: [
      { k: "Context", v: "Cargo tally recording and verification system at the port terminal — covering tally entry, supervisor review, and discrepancy reporting." },
      { k: "Approach", v: "Real-time supervisor review flow with automated discrepancy detection between planned and actual cargo counts. Role-based access for tally operators, supervisors, and administrators." },
      { k: "Impact", v: "Accurate, auditable tally records with compliance-ready summary reports." },
    ],
  },
  {
    no: "12 / Power BI",
    glyph: "PBI",
    featured: true,
    title: "Power BI Dashboards",
    client: "PT Pelabuhan Tanjung Priok",
    period: "September 2025 – April 2026",
    role: "Data / BI",
    // image: "/work/powerbi.webp",
    stack: ["Power BI", "DAX", "Oracle SQL"],
    rows: [
      { k: "Problem", v: "C-level stakeholders needed consolidated executive-level operational reporting." },
      { k: "Approach", v: "BI dashboards connected to Oracle databases — YoY analysis, financial-ratio metrics, and multi-source operational data in one unified view." },
      { k: "Impact", v: "Executive-level BI in one reporting picture for C-level decision-making." },
    ],
  },
  {
    no: "13 / TAS",
    glyph: "TAS",
    featured: true,
    title: "Truck Appointment System",
    client: "PT Pelabuhan Tanjung Priok",
    period: "In Progress",
    role: "Backend",
    // image: "/work/tas.webp",
    stack: ["Laravel 12", "Vue 3 SPA", "PostgreSQL", "Queues"],
    rows: [
      { k: "Problem", v: "Gate congestion and unpredictable truck wait times at a container terminal." },
      { k: "Approach", v: "Time-slot booking + real-time capacity management on a decoupled Laravel 12 REST API + Vue 3 SPA." },
      { k: "Hardened", v: "Pessimistic locking, idempotency keys, reliable queues — no double-booked slots under concurrency." },
      { k: "Impact", v: "Smoother gate flow, predictable scheduling, lower yard congestion." },
    ],
  },
];

export type TimelineItem = { year: string; role: string; org: string; desc: string };
export const experience: TimelineItem[] = [
  {
    year: "2021–Present",
    role: "Software Developer, Port & Logistics Systems",
    org: "PT Integrasi Logistik Cipta Solusi (ILCS), for PT Pelabuhan Tanjung Priok · Jakarta",
    desc: "Terminal operations (NPKTOS, MYTOS), audit (AIA), monitoring (SIMONGKA), cargo tally (TallyHBT), truck appointment (TAS), and Power BI dashboards for C-level reporting — CodeIgniter 3 + PostgreSQL/MySQL, and Laravel 12 + Vue 3 SPA for TAS.",
  },
  {
    year: "2018–2020",
    role: "Web Developer, Media & Corporate Systems",
    org: "Okezone & PT. Media Nusantara Citra Tbk (MNC Group) · Inews Tower, Jakarta",
    desc: "CMS for Okezone.com news portal, corporate websites (MNC Energy, Spinpay, MNCTV revamp), and internal apps (Carpool Unit, Master Data Management) — PHP, Laravel, CodeIgniter 3, CakePHP 2, MySQL, Oracle DB.",
  },
];

export const marquee: string[] = ["Laravel", "CodeIgniter 3", "Vue 3", "PostgreSQL", "Oracle", "Sanctum", "Pest", "Docker", "Power BI"];

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];
