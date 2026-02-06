import React, { useState, useEffect } from 'react';
import { CV_DATA } from './data';

// --- Icons ---
const SunIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 21l-4.35-4.35M18.4 10a8.4 8.4 0 11-16.8 0 8.4 8.4 0 0116.8 0z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

// --- Components ---

const Header = ({ theme, toggleTheme, lang, toggleLang, view, toggleView, t }) => {
  return (
    <header>
      <nav className="top-nav">
        <a href="#" onClick={(e) => { e.preventDefault(); if (view !== 'portfolio') toggleView(); }} className="brand" dangerouslySetInnerHTML={{ __html: t.nav.brand }}></a>

        <div className="nav-actions">
          <div className="toggle-group">
            <button id="theme-toggle" className="toggle-btn" aria-label="Toggle Theme" onClick={toggleTheme}>
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
            <button id="lang-toggle" className="toggle-btn lang-toggle" aria-label="Toggle Language" onClick={toggleLang}>
              {lang.toUpperCase()}
            </button>
          </div>

          <button
            className="btn btn-outline text-sm"
            style={{ fontWeight: 500 }}
            onClick={toggleView}
          >
            {view === 'portfolio'
              ? (lang === 'en' ? 'View Cover Letter' : 'Ver Carta de Presentación')
              : (lang === 'en' ? '← Back to Portfolio' : '← Volver al Portafolio')
            }
          </button>

          <a href="https://linkedin.com/in/eibarcenas" target="_blank" className="btn btn-primary">
            <span>{t.nav.letsTalk}</span>
            <ExternalLinkIcon />
          </a>
        </div>
      </nav>
    </header>
  );
};

const ProfileCard = ({ t }) => (
  <div className="card col-span-4 row-span-2 profile-card-content">
    <div className="profile-img-container">
      <img src="/assets/img/profile.png" alt="Erick Bárcenas" className="profile-img" />
      <div className="status-badge">
        <div className="status-dot"></div>
        <span>{t.hero.profile.status}</span>
      </div>
    </div>

    <h2 className="profile-name">{t.hero.profile.title} 👋</h2>
    <div className="text-accent font-mono text-sm mb-4">{t.hero.profile.subtitle}</div>

    <p className="text-secondary text-sm profile-bio">
      {t.hero.profile.description}
    </p>

    <div className="profile-socials">
      <a href="https://linkedin.com/in/eibarcenas" target="_blank" className="btn btn-primary">
        {t.hero.profile.linkedin}
      </a>
      <a href="https://github.com/eibarcenas" target="_blank" className="btn btn-outline">
        {t.hero.profile.github}
      </a>
    </div>
  </div>
);

const HeroStats = ({ t }) => (
  <div className="card col-span-8">
    <div className="hero">
      <h1 dangerouslySetInnerHTML={{ __html: t.hero.title }}></h1>
      <div className="flex flex-wrap gap-4" style={{ marginTop: '1rem' }}>
        {t.hero.chips.map((chip, i) => (
          <span key={i} className="chip">{chip}</span>
        ))}
      </div>
    </div>
  </div>
);

const SkillsSection = ({ t }) => (
  <div className="card col-span-8">
    <div className="section-title">
      <h3>{t.sections.skills}</h3>
    </div>
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
  </div>
);

const ExperienceSection = ({ t }) => (
  <div className="card col-span-4 row-span-3">
    <div className="section-title">
      <h3>{t.sections.experience}</h3>
    </div>
    <div className="flex flex-col gap-4">
      {t.data.experience.map((exp, i) => (
        <div key={i} className="exp-item">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-primary">{exp.role}</h4>
            <span className="text-xs text-secondary-light whitespace-nowrap">{exp.period}</span>
          </div>
          <div className="text-accent text-sm font-medium mb-2">{exp.company}</div>
          <p className="text-sm text-secondary mb-3 italic">{exp.description}</p>
          <ul className="exp-list">
            {exp.details.map((detail, j) => (
              <li key={j}>{detail}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsSection = ({ t }) => (
  <div className="col-span-8 grid-2">
    {t.data.projects.map((project, i) => (
      <a key={i} href={project.link} target="_blank" className="card project-card group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-surface-hover group-hover:bg-accent-subtle transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-primary group-hover:text-accent transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-secondary group-hover:text-primary transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
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

const Footer = ({ t }) => (
  <footer>
    <p>
      © {new Date().getFullYear()} Erick Iván Bárcenas Martínez.<br />
      <span style={{ opacity: 0.6, fontSize: '0.8em' }}>{t.sections.footer}</span>
    </p>
  </footer>
);

const PortfolioView = ({ t }) => (
  <div className="bento-grid">
    <ProfileCard t={t} />
    <HeroStats t={t} />
    <SkillsSection t={t} />
    <ExperienceSection t={t} />
    <ProjectsSection t={t} />
  </div>
);

const CoverLetterView = ({ t, lang }) => (
  <div className="letter-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '3rem', backdropFilter: 'blur(12px)' }}>
    <header className="letter-header mb-8 text-center">
      <div>
        <h1>Erick Iván Bárcenas</h1>
        <p className="text-accent font-mono text-sm">Senior Cloud & Software Architect</p>
      </div>
      <div className="text-secondary text-sm mt-2">{new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </header>

    <section className="content text-secondary" style={{ lineHeight: 1.8, maxWidth: '800px', margin: '0 auto' }}>
      {lang === 'en' ? (
        <>
          <p className="mb-4">Dear Hiring Team,</p>
          <p className="mb-4">
            <strong>Architecture is about balance</strong> — between speed and stability, innovation and reliability. With over eight years of experience building cloud-native systems, I specialize in finding that balance for complex, distributed platforms on AWS and GCP.
          </p>
          <p className="mb-4">
            My career has been defined by end-to-end ownership. From designing event-driven microservices at <em>Rombo Logística</em> to orchestrating multi-region MLOps pipelines at <em>CXC</em>, I don't just write code; I design systems that scale. I have extensive experience with <strong>Python (FastAPI), Terraform, and Serverless architectures</strong>, ensuring that infrastructure is as agile as the application code it supports.
          </p>
          <p className="mb-4">
            I am particularly passionate about the intersection of <strong>DevSecOps and Data Engineering</strong>. I believe that security and observability should be first-class citizens, not afterthoughts. Whether it's implementing zero-trust security controls or building lineage-aware data pipelines with BigQuery and Dataflow, I build systems that engineering teams can trust.
          </p>
          <p className="mb-4">
            As a technical leader, I prioritize mentorship and clarity. I have successfully led migration efforts, established engineering standards, and bridged the gap between product requirements and technical reality. I thrive in environments where I can solve ambiguous problems and deliver high-impact, maintainable solutions.
          </p>
          <p className="mb-8">
            I look forward to discussing how my architectural background and engineering mindset can contribute to your team's goals.
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
            Mi carrera se ha definido por la responsabilidad de extremo a extremo. Desde diseñar microservicios orientados a eventos en <em>Rombo Logística</em> hasta orquestar pipelines de MLOps multiregión en <em>CXC</em>, no solo escribo código; diseño sistemas que escalan. Tengo amplia experiencia con <strong>Python (FastAPI), Terraform y arquitecturas Serverless</strong>, asegurando que la infraestructura sea tan ágil como el código de la aplicación que soporta.
          </p>
          <p className="mb-4">
            Me apasiona especialmente la intersección de <strong>DevSecOps e Ingeniería de Datos</strong>. Creo que la seguridad y la observabilidad deben ser ciudadanos de primera clase, no ocurrencias tardías. Ya sea implementando controles de seguridad de confianza cero o construyendo pipelines de datos conscientes del linaje con BigQuery y Dataflow, construyo sistemas en los que los equipos de ingeniería pueden confiar.
          </p>
          <p className="mb-4">
            Como líder técnico, priorizo la mentoría y la claridad. He liderado exitosamente esfuerzos de migración, establecido estándares de ingeniería y cerrado la brecha entre los requisitos del producto y la realidad técnica. Prospero en entornos donde puedo resolver problemas ambiguos y entregar soluciones de alto impacto y mantenibles.
          </p>
          <p className="mb-8">
            Espero poder conversar sobre cómo mi experiencia arquitectónica y mi mentalidad de ingeniería pueden contribuir a los objetivos de su equipo.
          </p>
          <p>Atentamente,</p>
        </>
      )}

      <div className="mt-8 pt-8 border-t border-[var(--glass-border)]">
        <b className="block text-primary text-lg">Erick Iván Bárcenas</b>
        <span className="text-sm opacity-80">Cloud Architect & Engineer</span>
      </div>
    </section>
  </div>
);


const App = () => {
  // State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [view, setView] = useState('portfolio'); // 'portfolio' | 'coverLetter'

  // Effects
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Handlers
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
          <PortfolioView t={t} />
        ) : (
          <CoverLetterView t={t} lang={lang} />
        )}
      </main>

      <Footer t={t} />
    </div>
  );
};

export default App;
