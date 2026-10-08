"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { heroLines, site } from "@/lib/content";
import { introAlreadyPlayed } from "@/lib/intro";
import MagneticButton from "@/components/MagneticButton";

/** The headline as one readable sentence, for the h1's accessible name — the
 *  visible markup is one <span> per character, which assistive tech would
 *  otherwise announce letter by letter. Derived from `heroLines` rather than
 *  written out again: a hard-coded copy of this sentence used to sit on the h1,
 *  so editing the headline in content.ts left screen readers on the old one. */
const headline = heroLines.join(" ").replace(/[{}]/g, "");

/**
 * Splits a headline line into character <span>s. Segments wrapped in {curly}
 * braces in content.ts are rendered inside <em> (accent colour). Spaces become
 * non-breaking so the overflow-clip reveal keeps word spacing intact.
 */
function renderLine(line: string, keyBase: string) {
  const segments = line.split(/(\{[^}]*\})/g).filter(Boolean);
  let charIndex = 0;

  return segments.map((seg, si) => {
    const isAccent = seg.startsWith("{") && seg.endsWith("}");
    const text = isAccent ? seg.slice(1, -1) : seg;
    const chars = [...text].map((ch) => {
      const node = (
        <span className="ch" key={`${keyBase}-${charIndex++}`}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      );
      return node;
    });
    return isAccent ? (
      <em key={`${keyBase}-em-${si}`}>{chars}</em>
    ) : (
      <span key={`${keyBase}-seg-${si}`}>{chars}</span>
    );
  });
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // FIX: use relative selectors — el IS .hero, so we search inside it, not for .hero inside it.
    const chars = el.querySelectorAll<HTMLElement>("h1 .ch");
    const fades = el.querySelectorAll<HTMLElement>("[data-hero-fade]");

    if (reduced) {
      gsap.set(chars, { yPercent: 0 });
      gsap.set(fades, { opacity: 1, y: 0 });
      return;
    }

    // Hide chars below overflow:hidden line clips; hide fade elements.
    gsap.set(chars, { yPercent: 115 });
    gsap.set(fades, { opacity: 0, y: 22 });

    const play = () => {
      const tl = gsap.timeline();
      tl.to(chars, {
        yPercent: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.025,
        delay: 0.1,
      });
      tl.to(
        fades,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
        0.45
      );
    };

    // Wait for Loader to finish its wipe before animating the hero.
    let played = false;
    const onLoaded = () => {
      if (played) return;
      played = true;
      play();
    };

    // If the intro already ran this session the Loader unmounts itself immediately
    // and may have dispatched "loaded" before this listener attached — play now.
    if (introAlreadyPlayed()) {
      onLoaded();
      return;
    }

    window.addEventListener("loaded", onLoaded, { once: true });
    // Fallback: animate anyway if loader finishes faster than listener registration,
    // or in production builds where the loader fires quickly.
    const fallback = window.setTimeout(onLoaded, 2800);

    return () => {
      window.removeEventListener("loaded", onLoaded);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={root} aria-labelledby="hero-title">
      <div className="wrap">
        <div className="pill" data-hero-fade>
          <span className="ok" /> {site.availability} · {site.location}
        </div>

        <p className="hero-id" data-hero-fade>
          <span className="nm">{site.name}</span>
          <span className="rl">{site.tagline}</span>
        </p>

        <h1 id="hero-title" aria-label={headline}>
          {heroLines.map((line, i) => (
            <span className="line" key={i}>
              {renderLine(line, `l${i}`)}
            </span>
          ))}
        </h1>

        <p className="sub" data-hero-fade>
          <span className="vp">{site.heroSub}</span> {site.heroSubTail}{" "}
          <strong>{site.heroSubTailEmphasis}</strong>.
        </p>

        <div className="cta-row" data-hero-fade>
          <MagneticButton href="#work" variant="primary">
            View Work <span className="arr">↗</span>
          </MagneticButton>
          <MagneticButton href={site.cv} download>
            Download CV <span className="arr down">↓</span>
          </MagneticButton>
        </div>

        <div className="hero-foot">
          <div className="scroll-hint" data-hero-fade>
            <span className="ln" /> Scroll to explore
          </div>
          <div className="scroll-hint mono" data-hero-fade>
            {site.heroStackHint}
          </div>
        </div>
      </div>
    </section>
  );
}
