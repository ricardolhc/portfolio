import { usePreferences } from '../preferences/PreferencesProvider';
import { ContactForm } from './ContactForm';
import { Icon } from './Icon';
import { Reveal, SectionHeading } from './Section';
import awsLogo from '../../assets/aws-logo.svg';

export const SOCIAL = {
  github: 'https://github.com/ricardolhc',
  linkedin: 'https://www.linkedin.com/in/ricardo-costa-7a97a3254/',
};

const AWS_CERTIFICATION_URL =
  'https://cp.certmetrics.com/amazon/en/public/verify/credential/f844a9917d974a3bb153aeb58edf6d2c';

export function Hero() {
  const { t } = usePreferences();
  return (
    <section id="home" className="hero container" aria-labelledby="hero-title">
      <div className="hero-overline">
        <p className="eyebrow">
          <span className="tiny-square" />
          {t.hero.eyebrow}
        </p>
        <span className="mono hero-code" aria-hidden="true">
          &lt;rc /&gt;
        </span>
      </div>
      <h1 id="hero-title">
        Ricardo Costa
        <span className="hero-period" aria-hidden="true">
          .
        </span>
      </h1>
      <div className="hero-main">
        <div>
          <p className="hero-role">{t.hero.role}</p>
          <p className="hero-statement">{t.hero.statement}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              {t.hero.projects}
              <Icon name="arrow" />
            </a>
            <a className="button button-secondary" href="#contact">
              {t.hero.contact}
              <Icon name="arrow" />
            </a>
          </div>
        </div>
        <div className="hero-socials">
          <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <Icon name="arrow" />
            <span className="sr-only"> ({t.controls.external})</span>
          </a>
          <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <Icon name="arrow" />
            <span className="sr-only"> ({t.controls.external})</span>
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <span className="mono">{t.hero.index}</span>
        <span className="mono hero-location">{t.hero.location}</span>
        <a className="scroll-link" href="#about" aria-label={t.hero.scroll}>
          <Icon name="down" />
        </a>
      </div>
    </section>
  );
}

export function About() {
  const { t } = usePreferences();
  return (
    <section
      id="about"
      className="section container"
      aria-labelledby="about-title"
    >
      <Reveal className="about-grid">
        <div>
          <SectionHeading
            id="about"
            eyebrow={t.about.eyebrow}
            title={t.about.title}
          />
          <p className="about-note whitespace-pre-line">
            <Icon name="code" />
            {t.about.note}
          </p>
        </div>
        <div className="about-copy">
          <p className="lead">{t.about.lead}</p>
          <p>{t.about.body}</p>
          <p>{t.about.closing}</p>
        </div>
      </Reveal>
    </section>
  );
}

interface ExperienceRoleContent {
  title: string;
  details: string;
  description: string;
  bullets: string[];
  technologies: string[];
}

function ExperienceRole({ role }: { role: ExperienceRoleContent }) {
  return (
    <>
      <h3>{role.title}</h3>
      {role.details && <p className="university">{role.details}</p>}
      <p>{role.description}</p>
      <ul>
        {role.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {role.technologies.length > 0 && (
        <p className="project-context">{role.technologies.join(' · ')}</p>
      )}
    </>
  );
}

export function Experience() {
  const { t } = usePreferences();
  return (
    <section
      id="experience"
      className="section container"
      aria-labelledby="experience-title"
    >
      <Reveal>
        <SectionHeading id="experience" {...t.experience} />
        <div className="experience-grid">
          {t.experience.items.map((item, index) => (
            <article key={item.group} className="experience-card">
              <div className="card-topline">
                <span className="eyebrow">{item.group}</span>
                <span className="mono" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <ExperienceRole role={item} />
              {item.additionalRoles.map((role) => (
                <div className="education-item" key={role.title}>
                  <ExperienceRole role={role} />
                </div>
              ))}
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function TechnologyTags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="technology-tags" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function Projects() {
  const { t } = usePreferences();
  return (
    <section
      id="projects"
      className="projects-section"
      aria-labelledby="projects-title"
    >
      <div className="container section">
        <Reveal>
          <SectionHeading id="projects" {...t.projects} />
          <div className="project-list">
            {t.projects.items.map((project) => (
              <article key={project.number} className="project-card">
                <div className="project-content">
                  <div className="project-identity">
                    <div className="project-meta">
                      <span className="project-number mono">
                        /{project.number}
                      </span>
                      <p className="eyebrow">{project.category}</p>
                    </div>
                    <h3 className="whitespace-pre-line">{project.title}</h3>
                    <p className="project-context">{project.context}</p>
                  </div>
                  <div className="project-details">
                    <div>
                      <h4 className="eyebrow">{t.projects.problem}</h4>
                      <p>{project.problem}</p>
                    </div>
                    <div>
                      <h4 className="eyebrow">{t.projects.solution}</h4>
                      <p>{project.solution}</p>
                      <p className="project-implementation">
                        {project.implementation}
                      </p>
                    </div>
                  </div>
                  <div
                    className="project-technologies"
                    role="group"
                    aria-label={t.projects.technologies}
                  >
                    <h4 className="eyebrow">{t.projects.technologies}</h4>
                    <dl className="project-stack">
                      {project.technologyGroups.map((group) => (
                        <div className="project-stack-group" key={group.title}>
                          <dt>{group.title}</dt>
                          <dd>
                            <TechnologyTags
                              items={group.items}
                              label={group.title}
                            />
                          </dd>
                        </div>
                      ))}
                      {project.practices.length > 0 && (
                        <div className="project-stack-group project-practices">
                          <dt>{t.technologies.practicesTitle}</dt>
                          <dd>{project.practices.join(' · ')}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
                <div className="project-result">
                  <span className="eyebrow">{t.projects.outcome}</span>
                  <strong>{project.metric}</strong>
                  <p>{project.result}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="project-continuity">
            <span aria-hidden="true">↳</span>
            {t.projects.continuity}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Technologies() {
  const { t } = usePreferences();
  return (
    <section
      id="technologies"
      className="section container"
      aria-labelledby="technologies-title"
    >
      <Reveal>
        <SectionHeading id="technologies" {...t.technologies} />
        <div className="technology-grid">
          {t.technologies.groups.map((group, index) => (
            <div className="technology-group" key={group.title}>
              <div className="technology-topline" aria-hidden="true">
                <span className="mono muted">0{index + 1}</span>
                <Icon
                  name={
                    (
                      [
                        'code',
                        'server',
                        'desktop',
                        'database',
                        'branch',
                        'cloud',
                        'check',
                        'activity',
                        'code',
                      ] as const
                    )[index] ?? 'code'
                  }
                />
              </div>
              <h3>{group.title}</h3>
              {'description' in group && (
                <p className="technology-description">{group.description}</p>
              )}
              <TechnologyTags items={group.items} label={group.title} />
              {group.practices && (
                <div className="technology-practices">
                  <h4 className="eyebrow">{t.technologies.practicesTitle}</h4>
                  <p>{group.practices.join(' · ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function Education() {
  const { t } = usePreferences();
  return (
    <section
      id="education"
      className="section container education-section"
      aria-labelledby="education-title"
    >
      <Reveal className="education-grid">
        <SectionHeading id="education" {...t.education} />
        <div>
          {t.education.items.map((item) => (
            <article className="education-item" key={item.title}>
              <span className="status-tag">{item.status}</span>
              <h3>{item.title}</h3>
              <p className="university">{item.institution}</p>
              <p>{item.period}</p>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function Certifications() {
  const { t } = usePreferences();
  return (
    <section
      id="certifications"
      className="section container certification-section"
      aria-labelledby="certifications-title"
    >
      <Reveal className="certification-grid">
        <SectionHeading id="certifications" {...t.certifications} />
        <article className="certification-card">
          <div className="certification-top">
            <div className="certification-brand">
              <span className="aws-mark">
                <img
                  src={awsLogo}
                  alt={t.certifications.logoAlt}
                  width="304"
                  height="182"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="certification-organization">
                {t.certifications.organization}
              </span>
            </div>
            <span className="status-tag">{t.certifications.category}</span>
          </div>
          <h3>
            AWS Certified <br />
            Cloud Practitioner
          </h3>
          <p>{t.certifications.issuer}</p>
          <a
            className="text-link"
            href={AWS_CERTIFICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.certifications.reference}
            <Icon name="arrow" />
            <span className="sr-only"> ({t.controls.external})</span>
          </a>
        </article>
      </Reveal>
    </section>
  );
}

export function Contact() {
  const { t } = usePreferences();
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="container section">
        <Reveal className="contact-grid">
          <div>
            <SectionHeading id="contact" {...t.contact} />
            <div className="contact-socials">
              <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer">
                <Icon name="github" />
                GitHub<span className="sr-only"> ({t.controls.external})</span>
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="linkedin" />
                LinkedIn
                <span className="sr-only"> ({t.controls.external})</span>
              </a>
            </div>
          </div>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
