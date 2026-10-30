import { heroLines, site } from "@/lib/content";

/** A headline line, with segments wrapped in {curly} braces in content.ts
 *  rendered inside <em> (accent colour). */
function renderLine(line: string) {
  return line
    .split(/(\{[^}]*\})/g)
    .filter(Boolean)
    .map((seg, i) =>
      seg.startsWith("{") && seg.endsWith("}") ? <em key={i}>{seg.slice(1, -1)}</em> : seg
    );
}

/** Entrance order for the CSS `rise` animation (globals.css). The animation runs
 *  from the first paint, so it needs no JS and cannot flash after hydration. */
const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="pill rise" style={rise(0)}>
          <span className="ok" /> {site.availability} · {site.location}
        </div>

        <p className="hero-id rise" style={rise(1)}>
          <span className="nm">{site.name}</span>
          <span className="rl">{site.tagline}</span>
        </p>

        <h1 id="hero-title" className="rise" style={rise(2)}>
          {heroLines.map((line, i) => (
            <span className="line" key={i}>
              {renderLine(line)}{" "}
            </span>
          ))}
        </h1>

        <p className="sub rise" style={rise(3)}>
          <span className="vp">{site.heroSub}</span> {site.heroSubTail}{" "}
          <strong>{site.heroSubTailEmphasis}</strong>.
        </p>

        <div className="cta-row rise" style={rise(4)}>
          <a href="#work" className="btn primary">
            View Work <span className="arr">↗</span>
          </a>
          <a href={site.cv} download className="btn">
            Download CV <span className="arr down">↓</span>
          </a>
        </div>

        <div className="hero-foot rise" style={rise(5)}>
          <div className="scroll-hint">
            <span className="ln" /> Scroll to explore
          </div>
          <div className="scroll-hint mono">{site.heroStackHint}</div>
        </div>
      </div>
    </section>
  );
}
