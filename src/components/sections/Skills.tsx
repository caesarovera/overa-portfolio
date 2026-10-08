"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills, skillScale, stats, type SkillLevel } from "@/lib/content";
import Counter from "@/components/Counter";

/** Proficiency dots. One renderer for both the legend and the skill pills, so the
 *  two can't disagree about what a given level looks like. */
function Dots({ level }: { level: SkillLevel }) {
  return (
    <span className="dots">
      {skillScale.map((step) => (
        <i key={step.level} className={step.level <= level ? "on" : ""} />
      ))}
    </span>
  );
}

/** Pointer-driven spotlight: feed cursor position into CSS vars for the glow. */
function spotlight(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate shead
    gsap.fromTo(
      el.querySelectorAll(".shead h2, .shead .idx"),
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: el.querySelector(".shead"), start: "top 85%", once: true },
      }
    );

    // Animate each bento cell with a stagger
    const cells = gsap.utils.toArray<HTMLElement>(".cell", el);
    cells.forEach((cell, i) => {
      gsap.fromTo(
        cell,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          delay: (i % 3) * 0.06,
          scrollTrigger: { trigger: cell, start: "top 88%", once: true },
        }
      );
    });
  }, []);

  const onTilt = (e: React.MouseEvent<HTMLElement>) => {
    spotlight(e);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
    // Track the cursor instantly (transform 0s) so the tilt feels crisp instead
    // of rubber-banding against the CSS 0.35s transform transition. border-color
    // keeps its transition for the hover edge.
    t.style.transition = "border-color 0.35s, transform 0s";
    t.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLElement>) => {
    const t = e.currentTarget;
    // Smooth ease back to flat on leave.
    t.style.transition = "border-color 0.35s, transform 0.5s var(--ease)";
    t.style.transform = "";
  };

  return (
    <section id="skills" ref={root} aria-labelledby="skills-title">
      <div className="wrap">
        <div className="shead">
          <h2 id="skills-title">A stack tuned for systems that ship.</h2>
          <span className="idx">Capabilities</span>
        </div>

        {/* Rendered from `skillScale` rather than hand-written markup — the old
            version filled 4 of 5 dots for Expert, Working AND Learning alike. */}
        <div className="lvl-legend" aria-hidden="true">
          {skillScale.map((step) => (
            <span className="lvl-key" key={step.level}>
              <Dots level={step.level} />
              {step.label}
            </span>
          ))}
        </div>

        <div className="bento">
          {skills.map((cell) => {
            const isFeature = cell.span === "feature";
            const tiltProps = cell.tilt
              ? { onMouseMove: onTilt, onMouseLeave: resetTilt }
              : { onMouseMove: spotlight };

            return (
              <div
                key={cell.title}
                className={`cell ${cell.span}`}
                {...tiltProps}
              >
                <div className="ct">{cell.title}</div>

                {isFeature ? (
                  <div>
                    {/* Figure sourced from stats[0] — the same number the Stats
                        section shows. Only the caption differs, because the two
                        sit in different contexts. */}
                    <div className="big-n">
                      <Counter to={stats[0].value} suffix={stats[0].suffix} />
                    </div>
                    <div style={{ color: "var(--text-2)", marginTop: 8 }}>
                      {cell.counterLabel}
                    </div>
                  </div>
                ) : (
                  <>
                    {cell.heading && (
                      <h3 style={{ marginBottom: 18 }}>{cell.heading}</h3>
                    )}
                    <div className="tags">
                      {cell.tags?.map((t) => {
                        // Leveled tag → pill with proficiency dots.
                        if (typeof t === "object") {
                          const step = skillScale.find((s) => s.level === t.level);
                          return (
                            <span
                              className="tag-lvl"
                              key={t.name}
                              role="img"
                              aria-label={`${t.name} — ${step?.label ?? `level ${t.level}`}`}
                            >
                              {t.name}
                              <Dots level={t.level} />
                            </span>
                          );
                        }
                        // Plain concept tag (with optional dim suffix after " ·").
                        const m = t.match(/^(.*?) ·(\S.*)$/);
                        return (
                          <span key={t}>
                            {m ? m[1] : t}
                            {m && (
                              <em style={{ color: "var(--text-3)", fontStyle: "normal" }}>
                                {" "}·{m[2]}
                              </em>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
