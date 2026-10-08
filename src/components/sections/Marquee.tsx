"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { marquee } from "@/lib/content";

/**
 * Infinite-loop ticker driven by GSAP (not CSS animation), because the loop
 * distance has to be measured after the display font loads.
 */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // Duplicate items so the loop is seamless: when the track slides -50%,
  // it lands on the identical second copy → instant reset is invisible.
  const items = [...marquee, ...marquee];

  useEffect(() => {
    const el = track.current;
    const container = root.current;
    if (!el || !container) return;

    // Purely decorative (aria-hidden): every item already appears in the Skills
    // section. Reduced motion asks not to see an endlessly moving band, so stop it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = 30;

    let tween: gsap.core.Tween;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const halfWidth = el.scrollWidth / 2;
      if (!halfWidth) return;

      tween = gsap.fromTo(
        el,
        { x: 0 },
        { x: -halfWidth, duration, ease: "none", repeat: -1 }
      );
    };

    // Measure AFTER fonts load — display-font glyphs are wider than the fallback,
    // so measuring early gives a too-small width and the loop visibly jumps.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => requestAnimationFrame(start));
    } else {
      requestAnimationFrame(start);
    }

    // Pause on hover (matches the CSS `.marquee:hover` behaviour we removed).
    const onEnter = () => tween?.pause();
    const onLeave = () => tween?.play();
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      cancelled = true;
      tween?.kill();
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="marquee" ref={root} aria-hidden="true">
      <div className="track" ref={track}>
        {items.map((it, i) => (
          <span className="it" key={`${it}-${i}`}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
