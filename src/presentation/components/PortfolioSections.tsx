import { ProjectMedia } from './ProjectMedia';
import { projectAssets } from '../projects/catalog';
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
          {(['business', 'public'] as const).map((group) => (
            <div className="project-group" key={group}>
              <h3 className="project-group-title">{t.projects[group]}</h3>
              {group === 'business' && (
                <p className="project-continuity">{t.projects.continuity}</p>
              )}
              <div className="project-list">
                {t.projects.items
                  .filter((project) => project.group === group)
                  .map((project) => {
                    const assets = projectAssets[project.number];
                    return (
                      <article
                        key={project.number}
                        className={`project-card${assets?.images.length ? ' project-card-with-media' : ''}`}
                        aria-labelledby={`project-${project.number}`}
                      >
                        <div className="project-content">
                          <div className="project-meta">
                            <span className="project-number mono">
                              /{project.number}
                            </span>
                            <p className="eyebrow">{project.category}</p>
                          </div>
                          <p className="project-kind">
                            {group === 'business'
                              ? t.projects.privateLabel
                              : t.projects.publicLabel}
                          </p>
                          <div className="project-identity">
                            <h4 id={`project-${project.number}`}>
                              {project.title}
                            </h4>
                          </div>
                          <p className="project-description">
                            {project.description}
                          </p>
                          <p className="project-result">
                            {project.metric && (
                              <strong>{project.metric} </strong>
                            )}
                            {project.result}
                          </p>
                          <div
                            className="project-technologies"
                            role="group"
                            aria-label={t.projects.technologies}
                          >
                            <TechnologyTags
                              items={project.primaryTechnologies}
                              label={t.projects.technologies}
                            />
                          </div>
                          <details className="project-disclosure">
                            <summary>{t.projects.details}</summary>
                            {project.highlights.length > 0 && (
                              <ul
                                className="project-highlights"
                                aria-label={t.projects.highlights}
                              >
                                {project.highlights.map((highlight) => (
                                  <li key={highlight}>{highlight}</li>
                                ))}
                              </ul>
                            )}
                            <dl className="project-stack">
                              {project.technologyGroups.map((stack) => (
                                <div
                                  className="project-stack-group"
                                  key={stack.title}
                                >
                                  <dt>{stack.title}</dt>
                                  <dd>
                                    <TechnologyTags
                                      items={stack.items}
                                      label={stack.title}
                                    />
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </details>
                          {assets?.demo && (
                            <div className="project-actions">
                              <a
                                className="text-link"
                                href={assets.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {project.number === '03'
                                  ? t.projects.play
                                  : t.projects.tryIt}
                                <Icon name="arrow" />
                                <span className="sr-only">
                                  {' '}
                                  ({t.controls.external})
                                </span>
                              </a>
                              {assets.source && (
                                <a
                                  className="text-link"
                                  href={assets.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {t.projects.source}
                                  <Icon name="arrow" />
                                  <span className="sr-only">
                                    {' '}
                                    ({t.controls.external})
                                  </span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        {assets && (
                          <ProjectMedia
                            images={assets.images}
                            title={project.title}
                          />
                        )}
                      </article>
                    );
                  })}
              </div>
            </div>
          ))}
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
