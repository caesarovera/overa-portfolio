"use client";

import { useRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  strength?: number;
  /** Save the target instead of navigating to it. */
  download?: boolean;
};

/** Button that drifts toward the cursor (magnetic micro-interaction). */
export default function MagneticButton({ href, children, variant = "ghost", strength = 0.3, download }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${
      (e.clientY - r.top - r.height / 2) * (strength + 0.1)
    }px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      download={download}
      className={`btn ${variant === "primary" ? "primary" : ""}`}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </a>
  );
}
