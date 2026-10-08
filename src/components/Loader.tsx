"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/lib/content";
import { introAlreadyPlayed, markIntroPlayed } from "@/lib/intro";

/** The centred wordmark, animated one letter at a time.
 *
 *  Uses `site.wordmark`, not `site.name` (which also feeds JSON-LD and the page
 *  title, and may become a full legal name) and NOT a concatenation of
 *  `brandMark` — its `sep` is a slash standing in for the letter "v", so
 *  `left + right` spells "Oera". That exact bug shipped on 2026-07-27. */
const NAME = site.wordmark;

/** Count-up loading screen with an animated centred brand, wipes away to reveal the hero.
 *
 *  Deliberately renders the same markup on the server and on the client's first
 *  render — no sessionStorage during render. On a repeat visit the pre-paint
 *  script in layout.tsx has already stamped html[data-intro="played"], so CSS
 *  keeps this off screen and the effect below unmounts it. See lib/intro.ts. */
export default function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const loader = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const brand = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);

  // Entrance animation for the centred brand (runs once on mount).
  useEffect(() => {
    if (introAlreadyPlayed()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = brand.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>(".lname .ch");
    const fades = el.querySelectorAll<HTMLElement>("[data-lfade]");

    const tl = gsap.timeline();
    // Draw the ring (circumference ≈ 2π·54 ≈ 339).
    if (ring.current) {
      const len = 2 * Math.PI * 54;
      gsap.set(ring.current, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(ring.current, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0);
    }
    // Mask-reveal the name letters.
    tl.fromTo(
      chars,
      { yPercent: 120 },
      { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.05 },
      0.25
    );
    // Fade in the monogram + tagline.
    tl.fromTo(fades, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.5);
  }, []);

  // Count-up + wipe-away.
  useEffect(() => {
    // Already played this session, or reduced motion → resolve immediately.
    if (introAlreadyPlayed() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markIntroPlayed();
      setDone(true);
      // Defer so Hero's "loaded" listener (registered in its own effect) is
      // guaranteed to be attached before the event fires.
      const id = window.setTimeout(() => window.dispatchEvent(new Event("loaded")), 0);
      return () => window.clearTimeout(id);
    }
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 14 + 4);
      setPct(Math.floor(p));
      if (p >= 100) {
        clearInterval(t);
        gsap
          .timeline({
            onComplete: () => {
              markIntroPlayed();
              setDone(true);
              window.dispatchEvent(new Event("loaded"));
            },
          })
          .to(loader.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut", delay: 0.45 })
          .fromTo(
            wipe.current,
            { scaleY: 1, transformOrigin: "top" },
            { scaleY: 0, duration: 0.7, ease: "power4.inOut" },
            "<"
          );
      }
    }, 120);
    return () => clearInterval(t);
  }, []);

  if (done) return null;

  return (
    <>
      <div className="loader" ref={loader} aria-hidden="true">
        {/* Centred animated brand */}
        <div className="loader-brand" ref={brand}>
          <div className="loader-mono" data-lfade>
            <svg viewBox="0 0 120 120">
              <circle ref={ring} cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            </svg>
            <span>
              {site.brandMark.left}
              <i>{site.brandMark.sep}</i>
            </span>
          </div>
          <div className="lname">
            {[...NAME].map((ch, i) => (
              <span className="line" key={i}>
                <span className="ch">{ch}</span>
              </span>
            ))}
          </div>
          <div className="loader-tag" data-lfade>
            {site.tagline}
          </div>
        </div>

        {/* Bottom corners */}
        <span className="lbl">Compiling portfolio</span>
        <span className="count">
          <b>{String(pct).padStart(2, "0")}</b>
        </span>
        <div className="loader-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="wipe" ref={wipe} aria-hidden="true" />
    </>
  );
}
