import Reveal from "@/components/Reveal";
import { experience } from "@/lib/content";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <div className="shead">
          <Reveal as="div">
            <h2 id="experience-title">Experience.</h2>
          </Reveal>
          <Reveal as="span" className="idx" delay={0.08}>
            Timeline
          </Reveal>
        </div>
        <div className="tl">
          {experience.map((e, i) => (
            <Reveal className="item" key={e.role} delay={i * 0.06}>
              <div className="yr">{e.year}</div>
              <div>
                <div className="role">{e.role}</div>
                <div className="org">{e.org}</div>
                <div className="desc">{e.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
