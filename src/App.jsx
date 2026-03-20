import React, { useState, useEffect } from 'react';
import { CV_DATA, META, EDUCATION, LANGUAGES, SKILLS_DETAILED, FREELANCE_PROJECTS } from './data';

// --- Icons ---
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const GraduationIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

// --- Components ---

const Header = ({ theme, toggleTheme, lang, toggleLang, view, toggleView, t }) => (
  <header>
    <nav className="top-nav">
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); if (view !== 'portfolio') toggleView(); }}
        className="brand"
        dangerouslySetInnerHTML={{ __html: t.nav.brand }}
      />
      <div className="nav-actions">
        <div className="toggle-group">
          <button className="toggle-btn" aria-label="Toggle Theme" onClick={toggleTheme}>
            {theme === 'light' ? '☀️' : '🌙'}
          </button>
          <button className="toggle-btn lang-toggle" aria-label="Toggle Language" onClick={toggleLang}>
            {lang.toUpperCase()}
          </button>
        </div>
        <button className="btn btn-outline text-sm" style={{ fontWeight: 500 }} onClick={toggleView}>
          {view === 'portfolio'
            ? (lang === 'en' ? 'Cover Letter' : 'Carta')
            : (lang === 'en' ? '← Portfolio' : '← Portafolio')}
        </button>
        <a
          href={`https://wa.me/${META.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp"
        >
          <WhatsAppIcon />
          <span>{t.nav.letsTalk}</span>
        </a>
      </div>
    </nav>
  </header>
);

const ProfileCard = ({ t }) => (
  <div className="card col-span-4 row-span-2 profile-card-content">
    <div className="profile-img-container">
      <img src="./assets/img/profile.png" alt="Erick Bárcenas" className="profile-img" />
      <div className="status-badge">
        <div className="status-dot"></div>
        <span>{t.hero.profile.status}</span>
      </div>
    </div>

    <h2 className="profile-name">{t.hero.profile.title} 👋</h2>
    <div className="text-accent font-mono text-sm mb-2">{t.hero.profile.subtitle}</div>

    <div className="profile-meta">
      <span className="profile-meta-item">
        <LocationIcon />
        {META.location}
      </span>
    </div>

    <p className="text-secondary text-sm profile-bio">{t.hero.profile.description}</p>

    <div className="profile-socials">
      <a href={META.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
        {t.hero.profile.linkedin}
      </a>
      <a href={META.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
        {t.hero.profile.github}
      </a>
    </div>
    <a
      href={`https://wa.me/${META.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-whatsapp btn-sm w-full"
      style={{ marginTop: '0.75rem', justifyContent: 'center' }}
    >
      <WhatsAppIcon />
      {t.hero.profile.whatsapp}
    </a>
  </div>
);

const HeroStats = ({ t }) => (
  <div className="card col-span-8">
    <div className="hero">
      <h1 dangerouslySetInnerHTML={{ __html: t.hero.title }} />
      <div className="flex flex-wrap gap-4" style={{ marginTop: '1rem' }}>
        {t.hero.chips.map((chip, i) => (
          <span key={i} className="chip">{chip}</span>
        ))}
      </div>
    </div>
  </div>
);

const StatsBar = ({ t }) => (
  <div className="card col-span-8 stats-bar-card">
    <div className="stats-bar">
      {t.stats.map((stat, i) => (
        <div key={i} className="stat-item">
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const SkillsSection = ({ t, lang }) => {
  const [activeTab, setActiveTab] = useState('domains');

  return (
    <div className="card col-span-8">
      <div className="section-title flex justify-between items-center">
        <h3>{t.sections.skills}</h3>
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'domains' ? 'active' : ''}`}
            onClick={() => setActiveTab('domains')}
          >
            {lang === 'es' ? 'Dominios' : 'Domains'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            {lang === 'es' ? 'Por Tecnología' : 'By Tech'}
          </button>
        </div>
      </div>

      {activeTab === 'domains' ? (
        <div className="grid-2">
          {t.data.skills.map((skill, i) => (
            <div key={i} className="skill-item">
              <h4 className="font-semibold text-primary mb-2">{skill.title}</h4>
              <p className="text-sm text-secondary mb-3">{skill.description}</p>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, j) => (
                  <span key={j} className="chip-sm">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="skills-tech-grid">
          {SKILLS_DETAILED.map((group, gi) => (
            <div key={gi} className="skill-group">
              <h4 className="skill-group-title">{group.category}</h4>
              <div className="skill-bars">
                {group.items.map((item, ii) => (
                  <div key={ii} className="skill-bar-row">
                    <div className="skill-bar-info">
                      <span className="skill-name">{item.name}</span>
                      <span className="skill-years">{item.years}yr</span>
                    </div>
                    <div className="skill-bar-wrap">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${Math.min((item.years / 8) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExperienceSection = ({ t }) => (
  <div className="card col-span-4 row-span-3">
    <div className="section-title">
      <h3>{t.sections.experience}</h3>
    </div>
    <div className="flex flex-col gap-4">
      {t.data.experience.map((exp, i) => (
        <div key={i} className="exp-item">
          <div className="flex justify-between items-start mb-1 flex-wrap gap-1">
            <h4 className="font-semibold text-primary">{exp.role}</h4>
            <span className="period-badge">{exp.period}</span>
          </div>
          <div className="text-accent text-sm font-medium mb-1">{exp.company}</div>
          <p className="text-sm text-secondary mb-2 italic">{exp.description}</p>
          <ul className="exp-list">
            {exp.details.map((detail, j) => (
              <li key={j}>{detail}</li>
            ))}
          </ul>
          {exp.techStack && (
            <div className="tech-stack-row">
              <span className="tech-stack-label">Stack:</span>
              <span className="tech-stack-text">{exp.techStack}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const EducationSection = ({ t, lang }) => (
  <div className="card col-span-4 edu-card">
    <div className="section-title">
      <h3>{t.sections.education}</h3>
    </div>
    <div className="edu-content">
      <div className="edu-icon">
        <GraduationIcon />
      </div>
      <div>
        <div className="edu-degree">{EDUCATION.degree}</div>
        <div className="edu-school">{EDUCATION.school}</div>
        <div className="edu-year">{lang === 'es' ? 'Egresado' : 'Graduated'} {EDUCATION.graduation}</div>
      </div>
    </div>
    <div className="lang-list">
      <div className="lang-list-title">{lang === 'es' ? 'Idiomas' : 'Languages'}</div>
      {LANGUAGES.map((l, i) => (
        <div key={i} className="lang-item">
          <span className="lang-name">{l.name}</span>
          <span className="lang-level">{l.level}</span>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsSection = ({ t }) => (
  <div className="col-span-8 grid-2">
    {t.data.projects.map((project, i) => (
      <a key={i} href={project.link} target="_blank" rel="noopener noreferrer" className="card project-card group">
        <div className="flex justify-between items-start mb-4">
          <div className="project-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-secondary group-hover:text-primary transition-colors">
            <ExternalLinkIcon />
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
        <p className="text-secondary text-sm mb-4 flex-grow">{project.description}</p>
        <div className="text-accent text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          {t.actions.viewProject} →
        </div>
      </a>
    ))}
  </div>
);

const FreelanceSection = ({ t }) => (
  <div className="card col-span-12">
    <div className="section-title">
      <h3>{t.sections.freelance}</h3>
    </div>
    <div className="freelance-grid">
      {FREELANCE_PROJECTS.map((proj, i) => (
        <div key={i} className="freelance-item">
          {proj.url ? (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="freelance-name link">
              {proj.name} <ExternalLinkIcon />
            </a>
          ) : (
            <span className="freelance-name">{proj.name}</span>
          )}
          <span className="freelance-work">{proj.work}</span>
        </div>
      ))}
    </div>
  </div>
);

const ContactSection = ({ t }) => (
  <div className="card col-span-12 contact-card">
    <div className="section-title">
      <h3>{t.sections.contact}</h3>
    </div>
    <div className="contact-grid">
      <a href={`mailto:${META.email}`} className="contact-link">
        <MailIcon />
        <span>{META.email}</span>
      </a>
      <a href={`tel:${META.phone}`} className="contact-link">
        <PhoneIcon />
        <span>{META.phone}</span>
      </a>
      <a href={`https://wa.me/${META.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </a>
      <a href={META.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span>LinkedIn</span>
      </a>
      <a href={META.github} target="_blank" rel="noopener noreferrer" className="contact-link">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
      </a>
      <a href={`https://wa.me/${META.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp contact-cta">
        <WhatsAppIcon />
        {t.actions.whatsappCta}
      </a>
    </div>
  </div>
);

const FloatingWhatsApp = ({ label }) => (
  <a
    href={`https://wa.me/${META.whatsapp}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fab-whatsapp"
    aria-label="Chat on WhatsApp"
    title={label}
  >
    <WhatsAppIcon />
  </a>
);

const Footer = ({ t }) => (
  <footer>
    <p>
      © {new Date().getFullYear()} Erick Iván Bárcenas Martínez.<br />
      <span style={{ opacity: 0.6, fontSize: '0.8em' }}>{t.sections.footer}</span>
    </p>
  </footer>
);

const PortfolioView = ({ t, lang }) => (
  <div className="bento-grid">
    <ProfileCard t={t} />
    <HeroStats t={t} />
    <StatsBar t={t} />
    <SkillsSection t={t} lang={lang} />
    <ExperienceSection t={t} />
    <EducationSection t={t} lang={lang} />
    <ProjectsSection t={t} />
    <FreelanceSection t={t} />
    <ContactSection t={t} />
  </div>
);

const CoverLetterView = ({ t, lang }) => (
  <div className="letter-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '3rem', backdropFilter: 'blur(12px)' }}>
    <header className="letter-header mb-8 text-center">
      <div>
        <h1>Erick Iván Bárcenas</h1>
        <p className="text-accent font-mono text-sm">Senior Cloud & Software Architect</p>
      </div>
      <div className="text-secondary text-sm mt-2">
        {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </header>

    <section className="content text-secondary" style={{ lineHeight: 1.8, maxWidth: '800px', margin: '0 auto' }}>
      {lang === 'en' ? (
        <>
          <p className="mb-4">Dear Hiring Team,</p>
          <p className="mb-4">
            <strong>Architecture is about balance</strong> — between speed and stability, innovation and reliability. With over eight years of experience building cloud-native systems, I specialize in finding that balance for complex, distributed platforms on AWS and GCP.
          </p>
          <p className="mb-4">
            My career has been defined by end-to-end ownership. From designing event-driven microservices at <em>Rombo Logística</em> to orchestrating multi-region MLOps pipelines at <em>CXC</em>, I don&apos;t just write code; I design systems that scale. I have extensive experience with <strong>Python (FastAPI), Terraform, and Serverless architectures</strong>, ensuring that infrastructure is as agile as the application code it supports.
          </p>
          <p className="mb-4">
            I am particularly passionate about the intersection of <strong>DevSecOps and Data Engineering</strong>. I believe that security and observability should be first-class citizens, not afterthoughts. Whether it&apos;s implementing zero-trust security controls or building lineage-aware data pipelines with BigQuery and Dataflow, I build systems that engineering teams can trust.
          </p>
          <p className="mb-4">
            As a technical leader, I prioritize mentorship and clarity. I have successfully led migration efforts, established engineering standards, and bridged the gap between product requirements and technical reality.
          </p>
          <p className="mb-8">
            I look forward to discussing how my architectural background and engineering mindset can contribute to your team&apos;s goals.
          </p>
          <p>Sincerely,</p>
        </>
      ) : (
        <>
          <p className="mb-4">Estimado equipo de contratación,</p>
          <p className="mb-4">
            <strong>La arquitectura trata sobre el equilibrio</strong> — entre velocidad y estabilidad, innovación y confiabilidad. Con más de ocho años de experiencia construyendo sistemas nativos de la nube, me especializo en encontrar ese equilibrio para plataformas complejas y distribuidas en AWS y GCP.
          </p>
          <p className="mb-4">
            Mi carrera se ha definido por la responsabilidad de extremo a extremo. Desde diseñar microservicios orientados a eventos en <em>Rombo Logística</em> hasta orquestar pipelines de MLOps en <em>CXC</em>, no solo escribo código; diseño sistemas que escalan. Tengo amplia experiencia con <strong>Python (FastAPI), Terraform y arquitecturas Serverless</strong>.
          </p>
          <p className="mb-4">
            Me apasiona la intersección de <strong>DevSecOps e Ingeniería de Datos</strong>. Creo que la seguridad y la observabilidad deben ser ciudadanos de primera clase, no ocurrencias tardías.
          </p>
          <p className="mb-4">
            Como líder técnico, priorizo la mentoría y la claridad. He liderado exitosamente esfuerzos de migración, establecido estándares de ingeniería y cerrado la brecha entre los requisitos del producto y la realidad técnica.
          </p>
          <p className="mb-8">
            Espero poder conversar sobre cómo mi experiencia arquitectónica puede contribuir a los objetivos de su equipo.
          </p>
          <p>Atentamente,</p>
        </>
      )}

      <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <b className="block text-primary text-lg">Erick Iván Bárcenas</b>
        <span className="text-sm opacity-80">Cloud Architect & Engineer</span>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href={`mailto:${META.email}`} className="contact-link">{META.email}</a>
          <a href={`https://wa.me/${META.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  </div>
);

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [view, setView] = useState('portfolio');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'es' : 'en');
  const toggleView = () => setView(prev => prev === 'portfolio' ? 'coverLetter' : 'portfolio');

  const t = CV_DATA[lang];

  return (
    <div className="container">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        view={view}
        toggleView={toggleView}
        t={t}
      />
      <main>
        {view === 'portfolio' ? (
          <PortfolioView t={t} lang={lang} />
        ) : (
          <CoverLetterView t={t} lang={lang} />
        )}
      </main>
      <Footer t={t} />
      <FloatingWhatsApp label={t.actions.whatsappCta} />
    </div>
  );
};

export default App;
