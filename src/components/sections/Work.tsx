"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import { work } from "@/lib/content";

/** Decorative ring/dot layouts per case visual (purely aesthetic).
 *  Indexed with `i % visuals.length` so every featured card gets a distinct
 *  layout instead of all cards past #4 falling back to visuals[0]. */
const visuals = [
  { rings: [300, 180], dot: { top: "30%", left: "62%" } },
  { rings: [280], dot: { top: "60%", left: "40%" } },
  { rings: [320, 160], dot: { top: "40%", left: "55%" } },
  { rings: [260], dot: { top: "35%", left: "50%" } },
  { rings: [340, 200], dot: { top: "52%", left: "68%" } },
  { rings: [240, 140], dot: { top: "28%", left: "44%" } },
];

const featured = work.filter((c) => c.featured);
const more = work.filter((c) => !c.featured);

export default function Work() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cases = gsap.utils.toArray<HTMLElement>(".case", el);

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(cases, { opacity: 1, y: 0 });
      } else {
        // Reveal each card as it enters. once:true → fires a single time then the
        // ScrollTrigger self-destructs, so opacity is locked at 1 permanently and
        // can never be reset to 0 by a later ScrollTrigger.refresh() on scroll-back.
        cases.forEach((c) => {
          gsap.fromTo(
            c,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: c, start: "top 85%", once: true },
            }
          );
        });
        // Stacking effect as the next card covers this one.
        // IMPORTANT: dim with filter:brightness, NOT opacity — opacity is already
        // owned by the reveal tween above, and two tweens fighting over the same
        // property is why cards stayed transparent when scrolling back up.
        // Explicit fromTo + scrub guarantees a clean reverse in both directions.
        cases.forEach((c, i) => {
          if (i === cases.length - 1) return;
          gsap.fromTo(
            c,
            { scale: 1, filter: "brightness(1)" },
            {
              scale: 0.92,
              filter: "brightness(0.45)",
              ease: "none",
              scrollTrigger: { trigger: cases[i + 1], start: "top 85%", end: "top 42%", scrub: true },
            }
          );
        });
      }

      // Compact "More work" cards: simple staggered reveal (no stacking).
      const moreCards = gsap.utils.toArray<HTMLElement>(".wc", el);
      if (reduced) {
        gsap.set(moreCards, { opacity: 1, y: 0 });
      } else {
        moreCards.forEach((c, i) => {
          gsap.fromTo(
            c,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: (i % 3) * 0.06,
              scrollTrigger: { trigger: c, start: "top 90%", once: true },
            }
          );
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  // 3D hover tilt on the inner card (skipped under reduced motion / coarse pointers).
  const onTilt = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
    t.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <section id="work" ref={root} aria-labelledby="work-title">
      <div className="wrap">
        <div className="shead">
          <Reveal as="div">
            <h2 id="work-title">Selected work.</h2>
          </Reveal>
          <Reveal as="span" className="idx" delay={0.08}>
            Case studies
          </Reveal>
        </div>

        <div className="work-stack">
          {featured.map((c, i) => {
            const v = visuals[i % visuals.length];
            return (
              <article className="case" key={c.no}>
                <div className="case-inner" onMouseMove={onTilt} onMouseLeave={resetTilt}>
                  <div className="case-body">
                    <span className="no">{c.no}</span>
                    <h3>{c.title}</h3>
                    <div className="case-meta">
                      <span>{c.client}</span>
                      <span>{c.role}</span>
                      <span>{c.period}</span>
                    </div>
                    <div className="stack-row">
                      {c.stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                    <div className="paa">
                      {c.rows.map((r) => (
                        <div className="row" key={r.k}>
                          <div className="k">{r.k}</div>
                          <div className="v">{r.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="case-visual" aria-hidden="true">
                    {c.image ? (
                      <>
                        <Image
                          src={c.image}
                          alt={c.title}
                          fill
                          className="object-cover"
                          style={{ filter: "blur(3px) brightness(0.55)", transform: "scale(1.05)" }}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <span className="glyph" style={{ position: "relative", zIndex: 1 }}>{c.glyph}</span>
                      </>
                    ) : (
                      <>
                        <span className="glyph">{c.glyph}</span>
                        {v.rings.map((size) => (
                          <div className="ring" key={size} style={{ width: size, height: size }} />
                        ))}
                        <div className="accent-dot" style={{ top: v.dot.top, left: v.dot.left }} />
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {more.length > 0 && (
          <>
            <div className="more-head">
              <span className="idx">Also shipped</span>
              <span className="line" aria-hidden="true" />
            </div>
            <div className="work-more">
              {more.map((c) => (
                <article className="wc" key={c.no}>
                  <span className="wc-glyph" aria-hidden="true">{c.glyph}</span>
                  <span className="wc-no">{c.no}</span>
                  <h4 className="wc-title">{c.title}</h4>
                  <div className="wc-meta">
                    <span>{c.client}</span>
                    <span>{c.role}</span>
                    <span>{c.period}</span>
                  </div>
                  <div className="wc-stack">
                    {c.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  {/* Only a couple of these are public — most of the work is
                      internal software behind a login. aria-label names the
                      project because several cards would otherwise contribute an
                      identical "Visit site" link to the page's link list. */}
                  {c.url && (
                    <a
                      className="wc-link"
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${c.title} (opens in a new tab)`}
                    >
                      Visit site <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
