"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
// Ships the rules Lenis needs to own the scroll container — notably
// `.lenis-stopped { overflow: clip }`, which is what makes lenis.stop() actually
// hold the page still behind the mobile menu (Nav.tsx).
import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Must be rendered INSIDE <ReactLenis> so it can access the lenis context.
 * useLenis() subscribes to the lenis instance reactively — no ref-timing race.
 * Fires ScrollTrigger.update() on every lenis scroll event, keeping scrub
 * animations (Work stacking, Aurora parallax) in sync with smooth scroll.
 */
function LenisGsapSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Drive lenis from the GSAP ticker so both share a single RAF loop.
    // lenisRef is read dynamically each tick — works fine even though lenis
    // initialises async (via useState inside ReactLenis).
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000); // gsap time is seconds → lenis wants ms
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0); // prevents large dt jumps after tab switch

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Computed at render time. On SSR window is undefined → false (safe default).
  // On client this runs synchronously before paint so Lenis options are correct.
  const reduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false} // we drive it via gsap.ticker above
      options={{
        lerp: reduced ? 1 : 0.09,
        smoothWheel: !reduced,
        wheelMultiplier: 1,
        // Lenis intercepts in-page anchor clicks itself. Without this the
        // browser's own `scroll-behavior: smooth` drove them, writing scrollTop
        // on the same frames as Lenis's RAF loop — two owners, one scroll
        // position. globals.css now sets `scroll-behavior: auto` to match.
        // Under reduced motion lerp is 1, so this lands instantly.
        anchors: true,
      }}
    >
      {/* LenisGsapSync must be inside ReactLenis to access its context */}
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
