import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { stats } from "@/lib/content";

export default function Stats() {
  return (
    <section
      id="stats"
      aria-labelledby="stats-title"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <div className="wrap">
        {/* Visually hidden: the band is three big numbers and reads fine on
            sight, but with no heading it was neither reachable by heading
            navigation nor exposed as a named landmark. */}
        <h2 id="stats-title" className="sr-only">
          By the numbers
        </h2>
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal className="stat" key={s.label} delay={i * 0.08}>
              <div className="n">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="l">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
