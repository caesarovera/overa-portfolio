import { site } from "@/lib/content";

/**
 * Server component — the footer ships no client JS at all.
 *
 * "Back to top" is an <a href="#top">, not a button with an onClick. It is
 * navigation, not an action, so a link is the honest element: it works with the
 * keyboard, it works with JS disabled, and Lenis picks it up through
 * `anchors: true` (Providers.tsx) so the scroll is smooth and driven by the same
 * RAF loop as everything else. The previous button called window.scrollTo, which
 * wrote scrollTop underneath Lenis; routing it through useLenis instead would
 * have fixed the conflict but pulled the whole lenis client bundle into the
 * page's graph for one control.
 *
 * The year is computed here, at build time, so it lands in the static HTML.
 * Computing it in a client component would make a page built in one year
 * hydrate to the next one and mismatch.
 */
export default function Footer() {
  return (
    <footer className="site">
      <span className="c">
        © {new Date().getFullYear()} {site.name} — {site.footerNote}
      </span>
      <a href="#top" className="totop">
        Back to top ↑
      </a>
    </footer>
  );
}
