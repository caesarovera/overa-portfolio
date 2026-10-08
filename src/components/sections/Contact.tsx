import Reveal from "@/components/Reveal";
import { site } from "@/lib/content";

export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <Reveal className="eyebrow">Contact</Reveal>
        <Reveal as="div">
          <h2 id="contact-title">
            Let&apos;s build
            <br />
            something <a href={`mailto:${site.email}`}>solid.</a>
          </h2>
        </Reveal>
        <Reveal className="links">
          <a href={`mailto:${site.email}`}>✉ {site.email}</a>
          <a href={site.cv} download>
            ↓ Download CV
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            ◆ GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            in LinkedIn
          </a>
        </Reveal>
        <Reveal className="meta">
          {site.location} · {site.contactMeta}
        </Reveal>
      </div>
    </section>
  );
}
