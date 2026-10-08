"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [data-cursor], .cell, input, textarea";

/**
 * Custom cursor: instant dot + lagging ring.
 *
 * FIX: JS uses compound transforms so centering is always correct:
 *   translateX(mx) translateY(my) translateX(-50%) translateY(-50%)
 * The -50% references the element's own current size, so it stays
 * centred even when the ring grows on hover (38px → 74px).
 */
export default function Cursor() {
  const ref  = useRef<HTMLDivElement>(null);
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = innerWidth / 2,
        my = innerHeight / 2,
        rx = mx,
        ry = my,
        raf = 0;

    /** Build a transform that positions the element centred on (x, y). */
    const centred = (x: number, y: number) =>
      `translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = centred(mx, my);
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = centred(rx, ry);
      raf = requestAnimationFrame(loop);
    };

    const over = (e: Event) => {
      if ((e.target as Element).closest?.(INTERACTIVE))
        ref.current?.classList.add("hover");
    };
    const out = (e: Event) => {
      if ((e.target as Element).closest?.(INTERACTIVE))
        ref.current?.classList.remove("hover");
    };

    addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    loop();

    return () => {
      removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <div className="ring" ref={ring} />
      <div className="dot"  ref={dot}  />
    </div>
  );
}
