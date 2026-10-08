// ---------------------------------------------------------------------------
// Typography. All three families are served from our own origin at runtime.
//
// This replaces two render-blocking <link rel="stylesheet"> tags pointing at
// api.fontshare.com and fonts.googleapis.com. Those cost two extra DNS + TLS
// handshakes before any text could paint, leaked every visitor's IP and
// user-agent to two third parties, and made a strict style-src CSP impossible.
//
// next/font emits the @font-face rules inline, self-hosts the files with hashed
// filenames, preloads them, and generates a metric-matched fallback so swapping
// from the fallback to the real face doesn't shift layout.
//
// Each family carries ONLY the weights the stylesheet actually asks for — see
// the note above each one. Adding a weight to globals.css means adding the file
// here too, otherwise the browser will synthesise it and it will look wrong.
// ---------------------------------------------------------------------------

import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/** Headings, buttons, display numerals.
 *  500 → .btn, .wc-title, .tl .role, .marquee .it
 *  600 → h1–h4, .brand, .stat .n, .big-n, loader wordmark  */
// NOTE: next/font/local derives the generated font-family name from the exported
// binding, so these are named after the typefaces — `display`/`body` would ship
// as font-family:"display", which is unreadable in devtools and needlessly
// generic. Tailwind v4 also declares --font-sans/--font-mono in @layer theme;
// next/font's are unlayered, so they win the cascade regardless of order.
export const clashDisplay = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/** Running text.
 *  400 → body default
 *  700 → <strong> in About.tsx / Hero.tsx  */
export const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
});

/** Eyebrows, meta, section indices. Nothing in globals.css sets a mono weight,
 *  so 400 is the only one shipped. Fetched from Google at BUILD time and then
 *  served locally — there is no runtime request to fonts.gstatic.com. */
export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

/** Applied to <html> in layout.tsx — this is what defines --font-display,
 *  --font-body and --font-mono for the whole document. */
export const fontVariables = `${clashDisplay.variable} ${satoshi.variable} ${jetBrainsMono.variable}`;
