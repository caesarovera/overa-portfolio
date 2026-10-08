"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Headings are in this union so a section's eyebrow can BE its heading rather
   *  than sit next to one — see About.tsx. */
  as?: "div" | "p" | "span" | "article" | "li" | "h2" | "h3";
  /** For `aria-labelledby` on the wrapping <section>. */
  id?: string;
};

/**
 * Scroll-triggered fade + translate-up reveal.
 * Uses GSAP (not framer-motion) so there is zero SSR/hydration mismatch:
 * the server renders the element normally (visible), and GSAP sets the
 * initial hidden state only on the client inside useEffect.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
  as: Tag = "div",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, [delay, y]);

  const TagEl = Tag as React.ElementType;

  return (
    <TagEl id={id} className={className} ref={ref as React.Ref<HTMLDivElement>}>
      {children}
    </TagEl>
  );
}
