"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/lib/content";
// Statically imported (rather than referenced as "/profile.jpg") so the build
// knows the intrinsic size, can generate the blur placeholder, and fails loudly
// if the file ever goes missing instead of 404-ing at runtime.
import profile from "@/assets/profile.jpg";

/**
 * Profile photo with a layered treatment that matches the dark + lime theme:
 *  - clip-path wipe reveal when scrolled into view
 *  - grayscale → full colour + subtle zoom on hover
 *  - gentle vertical parallax on scroll (image is taller than the frame)
 *  - accent gradient + film-grain overlays, corner bracket, location badge
 */
export default function ProfilePhoto() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const fr = frame.current;
    if (!el || !fr) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(el, { clipPath: "inset(0% 0 0 0)" });
        return;
      }
      // Wipe-up reveal on first enter.
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
      // Subtle parallax: the (taller) frame drifts within the clip.
      gsap.fromTo(
        fr,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="photo" ref={root} data-cursor>
      <div className="photo-frame" ref={frame}>
        {/* `fill` because .photo-frame is deliberately taller than .photo (inset
            -8%) to give the parallax room; the frame is the positioned ancestor.
            Not `priority` — this sits in the second section, so it should stay
            lazy and out of the way of the hero. */}
        <Image
          src={profile}
          alt={`Portrait of ${site.name}`}
          className="photo-img"
          fill
          sizes="(max-width: 860px) 340px, 480px"
          placeholder="blur"
        />
      </div>
      <div className="photo-tint" aria-hidden="true" />
      <div className="photo-grain" aria-hidden="true" />
      <span className="photo-corner" aria-hidden="true" />
      <span className="photo-badge">
        <span className="ok" /> {site.location}
      </span>
    </div>
  );
}
