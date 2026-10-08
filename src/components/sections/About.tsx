import Reveal from "@/components/Reveal";
import ProfilePhoto from "@/components/ProfilePhoto";

// This section's prose is the one piece of copy that does NOT live in
// content.ts: each paragraph carries its own <strong>/<span class="dim">
// emphasis, which a plain string array cannot express. content.ts used to hold a
// `bio[]` export with a second, drifting copy that nothing rendered — it is gone,
// and this is the only source. Edit here.
export default function About() {
  return (
    <section id="about" aria-labelledby="about-title">
      <div className="wrap">
        {/* The eyebrow IS the heading: this section carried substantial prose
            with no heading at all, so it was invisible to heading navigation and
            unnamed as a landmark. Styling is unchanged — `.eyebrow` wins on
            specificity over the base h2 rule. */}
        <Reveal as="h2" id="about-title" className="eyebrow">
          About
        </Reveal>
        <div className="about-grid">
          <div>
            <Reveal as="p">
              Full-stack developer with <strong>7+ years</strong> building enterprise systems in the media, port
              &amp; logistics domains — CMS and company profile sites, internal corporate car-booking apps, terminal
              operations, container/yard management, and audit platforms.
            </Reveal>
            <Reveal as="p" delay={0.06}>
              I specialize in robust, concurrency-safe backend architecture —{" "}
              <strong>Laravel 12 decoupled APIs + Vue 3 SPAs</strong>, and{" "}
              <strong>CodeIgniter 3 MVC stacks</strong> for long-running enterprise systems — and the unglamorous things that keep systems
              alive under load: <span className="dim">idempotency, database locking, queue reliability, Redis caching.</span>
            </Reveal>
            <Reveal as="p" delay={0.12}>
              I handle the work end to end, from database design and automated tests to{" "}
              <strong>Docker deployments and CI/CD with GitHub Actions</strong>.
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ProfilePhoto />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
