"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import { work, type FeaturedCase } from "@/lib/content";

const featured = work.filter((c): c is FeaturedCase => c.featured === true);
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
          {featured.map((c) => (
            <article className="case" key={c.no}>
              <div className="case-inner">
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
                {/* The work is internal, so a diagram stands in for screenshots.
                    Real content (an ordered list), not decoration: the arrows
                    between layers are CSS, so nothing extra is announced. */}
                <figure className="case-visual arch">
                  <figcaption className="arch-cap">Architecture</figcaption>
                  <ol className="arch-layers">
                    {c.diagram.map((d) => (
                      <li className="arch-node" key={d.layer}>
                        <span className="arch-layer">{d.layer}</span>
                        <span className="arch-name">{d.node}</span>
                        {d.note && <span className="arch-note">{d.note}</span>}
                      </li>
                    ))}
                  </ol>
                </figure>
              </div>
            </article>
          ))}
        </div>

        {more.length > 0 && (
          <>
            {/* A real heading, at the same level as the featured case titles, so
                assistive tech files the compact cards under it instead of under
                the last featured project. */}
            <div className="more-head">
              <h3 className="idx">Also shipped</h3>
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
