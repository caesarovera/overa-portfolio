"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { navLinks, site } from "@/lib/content";

/** Keep in sync with the `max-width: 760px` breakpoint in globals.css — this is
 *  the width below which the inline links are hidden and the menu takes over. */
const MOBILE_QUERY = "(max-width: 760px)";

const FOCUSABLE = 'a[href], button:not([disabled])';

/** Top navigation: brand mark, in-page links, light/dark toggle, and — below
 *  760px, where the inline links are hidden — a modal menu. */
export default function Nav() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  const close = useCallback(() => setOpen(false), []);

  // Sync local state with whatever the no-flash inline script already applied.
  useEffect(() => {
    const current = (document.documentElement.dataset.theme as "dark" | "light") || "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — ignore */
    }
    setTheme(next);
  };

  // Lock the page behind the menu. Lenis owns scrolling here, so this has to go
  // through the instance rather than setting overflow ourselves — lenis.stop()
  // both halts its RAF loop and adds .lenis-stopped, which lenis.css turns into
  // `overflow: clip` on <html>. (That stylesheet is imported in Providers.tsx;
  // without it the page would still scroll behind the panel.)
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [open, lenis]);

  // Modal focus behaviour: move focus in, trap Tab, Escape closes, and focus
  // returns to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const el = panel.current;
    if (!el) return;

    const opener = document.activeElement as HTMLElement | null;
    const items = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));

    items()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      // Wrap at both ends so focus can never escape to the page underneath.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open]);

  // Rotating to landscape / resizing past the breakpoint hides the button that
  // closes this, so close it ourselves rather than stranding the visitor.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => {
      if (!mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      <nav className="site">
        <a href="#top" className="brand" onClick={close}>
          {site.brandMark.left}
          <span>{site.brandMark.sep}</span>
          {site.brandMark.right}
        </a>
        <div className="nav-links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="theme-toggle icon-only"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={theme === "light"}
          >
            <div className="knob" />
          </button>
          {/* Sits above the panel (nav z-index 110 vs 105) so it stays reachable
              as the close control instead of needing a second button. */}
          <button
            ref={burger}
            type="button"
            className="nav-burger icon-only"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            // Only while the panel exists: aria-controls must point at a real
            // element, and the panel is unmounted when closed (which is also
            // what keeps its links out of the tab order).
            aria-controls={open ? "mobile-menu" : undefined}
          >
            <span className="bars" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="mobile-menu"
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <ul className="mm-links">
            {navLinks.map((l, i) => (
              <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                <a href={l.href} onClick={close}>
                  <span className="mm-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mm-foot">
            <a href={`mailto:${site.email}`} onClick={close}>
              {site.email}
            </a>
            <span>{site.location}</span>
          </div>
          {/* The burger doubles as the visible close control, but it lives outside
              this dialog — and aria-modal hides everything outside from assistive
              tech. So the dialog carries its own close action, last in tab order,
              revealed on focus exactly like the skip link. Escape works too. */}
          <button type="button" className="mm-close" onClick={close}>
            Close menu
          </button>
        </div>
      )}
    </>
  );
}
