"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Aurora() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(".blob.a", {
        yPercent: 18,
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 },
      });
      gsap.to(".blob.b", {
        yPercent: -22,
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="aurora" aria-hidden="true">
      <div className="blob a" />
      <div className="blob b" />
      <div className="blob c" />
    </div>
  );
}
