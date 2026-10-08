"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

/** useLayoutEffect logs a warning when React renders a client component on the
 *  server, where only useEffect exists anyway. Aliasing keeps the pre-paint
 *  timing on the client without the console noise. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Snapshot, not a subscription — the same check the other eight animated
 *  components make. Framer's `useReducedMotion` reacted to the OS setting
 *  changing mid-session; nothing else here does, and one idiom beats two. */
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animated count-up. Driven by GSAP, which this project already loads — it used
 * to pull in framer-motion for this one component (F28).
 *
 * Seeded with the FINAL value, not 0. This component is server-rendered, so
 * whatever the first render returns is what ships in the static HTML — and what
 * every reader without a working bundle sees: the <noscript> path, text
 * extractors, link unfurlers, `curl`. Starting the state at 0 meant the page
 * shipped reading "0+ years architecting production backend systems", which
 * undercut the whole point of making the page render without JS (DECISIONS D02).
 *
 * The count-up is decoration; the number is a claim, and the claim has to
 * survive JS not arriving. So the reset to 0 happens on the client only, in a
 * layout effect, which lands before the browser paints the hydrated tree.
 * See DECISIONS D11.
 */
export default function Counter({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to);

  useIsomorphicLayoutEffect(() => {
    // Under reduced motion the seeded value is already the right answer.
    if (prefersReducedMotion()) return;
    setVal(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let tween: gsap.core.Tween | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect(); // fire once, then stop watching

        // GSAP tweens a plain object and we mirror it into state, rather than
        // writing textContent directly: this text node belongs to React, and
        // mutating it behind React's back breaks the moment a parent re-renders.
        const box = { v: 0 };
        tween = gsap.to(box, {
          v: to,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => setVal(Math.floor(box.v)),
          onComplete: () => setVal(to), // never let float drift land on to-1
        });
      },
      // The element must be 10% into the viewport before it counts as visible.
      { rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}
