import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.tagline}`,
  description: site.seoDescription,
  keywords: [
    "Laravel developer",
    "CodeIgniter developer",
    "PHP developer",
    "Senior Laravel developer",
    "backend developer",
    "Vue 3",
    "PostgreSQL",
    "Indonesia",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.ogDescription,
    siteName: site.name,
    // Add /public/og.png (1200×630) for a custom social card.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.ogDescription,
    images: ["/og.png"],
  },
  alternates: { canonical: site.url },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data (Person)
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  // Profiles that are this same person, so a search for the name can connect them.
  sameAs: [site.github, site.linkedin],
  address: { "@type": "PostalAddress", addressRegion: "West Java", addressCountry: "ID" },
  knowsAbout: [
    "Laravel",
    "CodeIgniter 3",
    "PHP",
    "Vue 3",
    "REST API design",
    "PostgreSQL",
    "Oracle",
    "CMS",
  ],
};

// Runs before first paint, so the theme cannot flash. A static string: nothing
// in it comes from user input or request data.
const noFlashScript = `(function(){var d=document.documentElement;
try{d.setAttribute('data-theme',localStorage.getItem('theme')||'dark');}catch(e){d.setAttribute('data-theme','dark');}
})();`;

// Applied only when scripting is disabled. Everything here is !important because
// this stylesheet's position relative to the compiled globals.css is not
// guaranteed, and a fallback must not lose on source order.
const noScriptCss = `
/* The burger and theme toggle do nothing without JS — hide the dead controls
   and restore the plain inline links, or mobile is left with no navigation. */
.nav-burger, .theme-toggle { display: none !important; }
/* Nothing adds .scrolled without JS, so the nav keeps its background throughout. */
nav.site {
  background: color-mix(in srgb, var(--bg) 88%, transparent) !important;
  backdrop-filter: blur(14px) !important;
  border-bottom-color: var(--border) !important;
}
@media (max-width: 760px) {
  .nav-links { gap: 16px !important; }
  .nav-links a:not(.icon-only) { display: inline-block !important; font-size: 13px !important; }
}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Fonts are self-hosted and preloaded by next/font — see lib/fonts.ts.
            No third-party font origins, so no preconnects are needed here. */}
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noScriptCss }} />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a href="#top" className="skip-link">Skip to main content</a>
        <Providers>
          <ScrollProgress />
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
