import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/content";
import { INTRO_KEY, INTRO_ATTR, INTRO_ATTR_VALUE } from "@/lib/intro";
import { fontVariables } from "@/lib/fonts";
import Providers from "@/components/Providers";
import Grain from "@/components/Grain";
import Aurora from "@/components/Aurora";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import Loader from "@/components/Loader";
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

// Runs before first paint, so neither the theme nor the loading screen can flash.
//
// Two independent try/catch blocks on purpose: a blocked sessionStorage must not
// cost the visitor their saved theme, and vice versa.
//
// Only compile-time constants are interpolated below — nothing here is derived
// from user input, request data or storage contents, so the inline script cannot
// be used as an injection vector.
const noFlashScript = `(function(){var d=document.documentElement;
try{d.setAttribute('data-theme',localStorage.getItem('theme')||'dark');}catch(e){d.setAttribute('data-theme','dark');}
try{if(sessionStorage.getItem('${INTRO_KEY}')==='1')d.setAttribute('${INTRO_ATTR}','${INTRO_ATTR_VALUE}');}catch(e){}
})();`;

// Applied only when scripting is disabled.
//
// The loader + wipe overlays are server-rendered and torn down by React, so with
// no JS they would cover the (fully server-rendered) page forever. Everything
// here is !important because this stylesheet's position relative to the compiled
// globals.css is not guaranteed, and a fallback must not lose on source order.
//
// This covers JS being OFF. It does NOT cover the bundle failing to download
// while JS is on — nothing inside <noscript> renders in that case. The CSS
// failsafe timer in globals.css (`loader-failsafe`) is what handles that.
const noScriptCss = `
.loader, .wipe { display: none !important; }
/* The burger and theme toggle do nothing without JS — hide the dead controls
   and restore the plain inline links, or mobile is left with no navigation. */
.nav-burger, .theme-toggle { display: none !important; }
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
          <Aurora />
          <Grain />
          <Loader />
          <Cursor />
          <ScrollProgress />
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
