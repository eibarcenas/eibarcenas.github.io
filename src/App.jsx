import React, { useState, useEffect } from 'react';
import { CV_DATA, META, EDUCATION, LANGUAGES, COURSES, SKILLS_DETAILED, FREELANCE_PROJECTS, INDUSTRIES } from './data';

// Instructor playbooks (raw markdown, imported at build time)
import bpM1 from './content/playbooks/backend-python/m1-fastapi-foundations.md?raw';
import bpM2 from './content/playbooks/backend-python/m2-api-design.md?raw';
import bpM3 from './content/playbooks/backend-python/m3-clean-architecture.md?raw';
import bpM4 from './content/playbooks/backend-python/m4-microservices-eda.md?raw';
import awsM1 from './content/playbooks/aws/m1-foundations.md?raw';
import awsM2 from './content/playbooks/aws/m2-serverless-containers.md?raw';
import awsM3 from './content/playbooks/aws/m3-messaging-data.md?raw';
import awsM4 from './content/playbooks/aws/m4-iac-cicd.md?raw';
import gcpM1 from './content/playbooks/gcp/m1-foundations.md?raw';
import gcpM2 from './content/playbooks/gcp/m2-serverless-containers.md?raw';
import gcpM3 from './content/playbooks/gcp/m3-data-messaging.md?raw';
import gcpM4 from './content/playbooks/gcp/m4-iac-cicd.md?raw';
import genM1 from './content/playbooks/genai/m1-llm-fundamentals.md?raw';
import genM2 from './content/playbooks/genai/m2-rag-pipelines.md?raw';
import genM3 from './content/playbooks/genai/m3-multi-agent.md?raw';
import genM4 from './content/playbooks/genai/m4-production-ai.md?raw';

const PLAYBOOKS = {
  'backend-python': { m1: bpM1, m2: bpM2, m3: bpM3, m4: bpM4 },
  aws: { m1: awsM1, m2: awsM2, m3: awsM3, m4: awsM4 },
  gcp: { m1: gcpM1, m2: gcpM2, m3: gcpM3, m4: gcpM4 },
  genai: { m1: genM1, m2: genM2, m3: genM3, m4: genM4 },
};

// Build a wa.me link with a pre-filled message
const waUrl = (msg) =>
  `https://wa.me/${META.whatsapp}?text=${encodeURIComponent(msg)}`;

// --- Icons ---
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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

const PrintIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

// --- Instructor: Markdown Renderer ---

const INSTRUCTOR_PASS = 'Admin360!';

const parseBold = (text) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
};

const MarkdownRenderer = ({ content }) => {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(<pre key={i} className="md-code">{codeLines.join('\n')}</pre>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="md-h3">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="md-h2">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="md-h1">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={i} className="md-li">{parseBold(line.slice(2))}</li>);
    } else if (/^\d+\. /.test(line)) {
      elements.push(<li key={i} className="md-li md-oli">{parseBold(line.replace(/^\d+\. /, ''))}</li>);
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="md-hr" />);
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="md-spacer" />);
    } else {
      elements.push(<p key={i} className="md-p">{parseBold(line)}</p>);
    }
    i++;
  }
  return <div className="md-content">{elements}</div>;
};

const InstructorLogin = ({ onAuth }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === INSTRUCTOR_PASS) {
      sessionStorage.setItem('instructor_auth', '1');
      onAuth();
    } else {
      setErr(true);
      setPw('');
    }
  };

  return (
    <div className="instructor-login">
      <div className="instructor-login-card">
        <div className="instructor-login-icon">⚙</div>
        <h2 className="instructor-login-title">Instructor Access</h2>
        <p className="instructor-login-sub">This area is for course instructors only.</p>
        <form onSubmit={submit} className="instructor-login-form">
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(false); }}
            placeholder="Enter password"
            className={`instructor-pw-input${err ? ' error' : ''}`}
            autoFocus
          />
          {err && <p className="instructor-pw-err">Incorrect password. Try again.</p>}
          <button type="submit" className="btn btn-outline instructor-login-btn">Enter →</button>
        </form>
      </div>
    </div>
  );
};

const InstructorView = ({ lang }) => {
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedMod, setSelectedMod] = useState(null);

  const courses = COURSES.filter(c => c.playbookKey && PLAYBOOKS[c.playbookKey]);
  const content = selectedKey && selectedMod ? PLAYBOOKS[selectedKey][selectedMod] : null;

  return (
    <div className="instructor-view">
      <aside className="instructor-sidebar">
        <div className="instructor-sidebar-title">📚 Playbooks</div>
        {courses.map((c, i) => (
          <div key={i} className="instructor-course-group">
            <button
              className={`instructor-course-btn${selectedKey === c.playbookKey ? ' active' : ''}`}
              style={{ borderLeftColor: c.color }}
              onClick={() => { setSelectedKey(c.playbookKey); setSelectedMod(null); }}
            >
              <span>{c.icon}</span>
              <span>{lang === 'en' ? c.title : c.titleEs}</span>
            </button>
            {selectedKey === c.playbookKey && c.modules && (
              <div className="instructor-modules">
                {c.modules.map((mod, mi) => {
                  const key = `m${mi + 1}`;
                  return (
                    <button
                      key={mi}
                      className={`instructor-module-btn${selectedMod === key ? ' active' : ''}`}
                      onClick={() => setSelectedMod(key)}
                    >
                      {lang === 'en' ? mod.title : mod.titleEs}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </aside>
      <div className="instructor-content">
        {content
          ? <MarkdownRenderer content={content} />
          : (
            <div className="instructor-empty">
              <span>📖</span>
              <p>Select a course and module from the sidebar to view its playbook.</p>
            </div>
          )
        }
      </div>
    </div>
  );
};

// --- Components ---

const PrintHeader = ({ t }) => (
  <div className="print-only print-header">
    <h1 className="print-name">{META.name}</h1>
    <p className="print-role">{t.hero.profile.subtitle}</p>
    <div className="print-contact">
      <span>{META.email}</span> • <span>{META.phone}</span> • <span>{META.location}</span> • <span>{META.linkedin.replace('https://www.linkedin.com/in/', 'linkedin.com/in/')}</span>
    </div>
  </div>
);

const Header = ({ theme, toggleTheme, lang, toggleLang, view, toggleView, toggleCoverLetter, goToCourses, goToPortfolio, goToInstructor, t }) => (
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
          <button className="toggle-btn" aria-label="Print" onClick={() => {
            const oldTitle = document.title;
            const name = t.hero.profile.title || "Erick_Barcenas";
            document.title = `${name.replace(/\s+/g, '_')}_CV`;
            window.print();
            document.title = oldTitle;
          }}>
            <PrintIcon />
          </button>
          <button className="toggle-btn lang-toggle" aria-label="Toggle Language" onClick={toggleLang}>
            {lang.toUpperCase()}
          </button>
        </div>
        {view !== 'portfolio' ? (
          <button className="btn btn-outline nav-cv-btn" onClick={goToPortfolio}>
            <span className="cv-btn-label">{lang === 'en' ? '← Back' : '← Volver'}</span>
            <span className="cv-btn-short">←</span>
          </button>
        ) : (
          <>
            <button className="btn btn-outline nav-cv-btn" onClick={toggleCoverLetter}>
              <span className="cv-btn-label">{lang === 'en' ? 'Cover Letter' : 'Carta'}</span>
              <span className="cv-btn-short">CV</span>
            </button>
            <button className="btn btn-outline nav-cv-btn" onClick={goToCourses}>
              <span className="cv-btn-label">{t.nav.courses}</span>
              <span className="cv-btn-short">📚</span>
            </button>
            <button className="btn btn-outline nav-cv-btn instructor-nav-btn" onClick={goToInstructor} title="Instructor area">
              <span>⚙</span>
            </button>
          </>
        )}
        <a
          href={waUrl(t.nav.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp nav-cta"
        >
          <WhatsAppIcon />
          <span className="nav-cta-text">{t.nav.letsTalk}</span>
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

    <div className="profile-card-right">
      <h2 className="profile-name">{t.hero.profile.title} 👋</h2>
      <div className="text-accent font-mono text-sm mb-2">{t.hero.profile.subtitle}</div>

      <div className="profile-meta">
        <span className="profile-meta-item">
          <LocationIcon />
          {META.location}
        </span>
        <span className="profile-meta-item">
          <GraduationIcon />
          {EDUCATION.degree.replace("Bachelor's in ", '')} · {EDUCATION.school} &rsquo;{EDUCATION.graduation.slice(-2)}
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
        href={waUrl(t.nav.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp btn-sm w-full"
        style={{ marginTop: '0.75rem', justifyContent: 'center' }}
      >
        <WhatsAppIcon />
        {t.hero.profile.whatsapp}
      </a>
    </div>
  </div>
);

const HeroStats = ({ t }) => (
  <div className="card col-span-8 hero-card">
    <div className="hero">
      <div className="hero-eyebrow">Senior Backend &amp; GenAI Engineer · 8+ years</div>
      <h1 dangerouslySetInnerHTML={{ __html: t.hero.title }} />
      <p className="hero-tagline">{t.hero.profile.description}</p>
      <div className="flex flex-wrap gap-3" style={{ marginTop: '1.25rem' }}>
        {t.hero.chips.map((chip, i) => (
          <span key={i} className="chip">{chip}</span>
        ))}
      </div>
      <div className="hero-industries">
        <span className="industries-label">{t.hero.industriesLabel}</span>
        {INDUSTRIES.map((ind, i) => (
          <span key={i} className="industry-chip">{ind.icon} {ind.name}</span>
        ))}
      </div>
    </div>
  </div>
);

const STAT_ICONS = ['🚀', '🏢', '☁️', '🌐'];

const StatsBar = ({ t }) => (
  <div className="card col-span-8 stats-bar-card">
    <div className="stats-bar">
      {t.stats.map((stat, i) => (
        <div key={i} className="stat-item">
          <span className="stat-icon">{STAT_ICONS[i]}</span>
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
    <div className="card col-span-8 skills-section">
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
  <div className="card col-span-4 experience-section" style={{ gridRow: 'span 3', alignSelf: 'stretch' }}>
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
      <a href={waUrl(t.nav.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </a>
      <a href={META.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span>LinkedIn</span>
      </a>
      <a href={META.github} target="_blank" rel="noopener noreferrer" className="contact-link">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <span>GitHub</span>
      </a>
      <a href={waUrl(t.nav.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp contact-cta">
        <WhatsAppIcon />
        {t.actions.whatsappCta}
      </a>
    </div>
  </div>
);

const FloatingWhatsApp = ({ t }) => (
  <a
    href={waUrl(t.nav.whatsappMessage)}
    target="_blank"
    rel="noopener noreferrer"
    className="fab-whatsapp"
    aria-label="Chat on WhatsApp"
    title={t.nav.letsTalk}
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

const CourseCard = ({ c, lang }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="course-card" style={{ borderTopColor: c.color }}>
      <div className="course-card-header">
        <span className="course-icon">{c.icon}</span>
        <div className="course-meta">
          <span className="course-level-badge" style={{ color: c.color, borderColor: c.color }}>
            {lang === 'en' ? c.level : c.levelEs}
          </span>
          {c.status === 'coming-soon' && (
            <span className="course-status-badge">
              {lang === 'en' ? 'Coming Soon' : 'Próximamente'}
            </span>
          )}
        </div>
      </div>
      <div className="course-title">{lang === 'en' ? c.title : c.titleEs}</div>
      <div className="course-description">{lang === 'en' ? c.description : c.descriptionEs}</div>
      <div className="course-topics">
        {c.topics.map((topic, j) => (
          <span key={j} className="chip-sm">{topic}</span>
        ))}
      </div>
      {c.modules && c.modules.length > 0 && (
        <div className="temario">
          <button
            className="temario-toggle"
            style={{ color: c.color, borderColor: c.color }}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open
              ? lang === 'en' ? '▲ Hide syllabus' : '▲ Ocultar temario'
              : lang === 'en' ? '▼ View syllabus' : '▼ Ver temario'}
          </button>
          {open && (
            <div className="temario-body">
              {c.modules.map((mod, mi) => (
                <div key={mi} className="temario-module">
                  <div className="temario-module-title" style={{ color: c.color }}>
                    {lang === 'en' ? mod.title : mod.titleEs}
                  </div>
                  <ul className="temario-lessons">
                    {(lang === 'en' ? mod.lessons : mod.lessonsEs).map((lesson, li) => (
                      <li key={li}>{lesson}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {c.status === 'available' && (
        <a
          href={waUrl(lang === 'en' ? c.whatsappMessage : c.whatsappMessageEs)}
          target="_blank"
          rel="noopener noreferrer"
          className="course-cta"
          style={{ borderColor: c.color, color: c.color }}
        >
          {lang === 'en' ? 'Get in touch →' : 'Contáctame →'}
        </a>
      )}
    </div>
  );
};

const CoursesView = ({ t, lang }) => (
  <div className="courses-view">
    <div className="courses-hero">
      <h1 className="courses-title">{t.sections.courses}</h1>
      <p className="courses-subtitle">
        {lang === 'en'
          ? "Practical courses on topics I've built production systems with — designed to help you learn by doing, not just by watching."
          : 'Cursos prácticos sobre temas con los que he construido sistemas en producción — diseñados para aprender haciendo, no solo viendo.'}
      </p>
    </div>
    <div className="courses-grid">
      {COURSES.map((c, i) => (
        <CourseCard key={i} c={c} lang={lang} />
      ))}
    </div>
  </div>
);

const PortfolioView = ({ t, lang }) => (
  <>
    <PrintHeader t={t} />
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
  </>
);

const CoverLetterView = ({ t, lang }) => (
  <div className="letter-wrap">

    {/* ── Hero banner ── */}
    <div className="letter-hero">
      <div className="letter-hero-img">
        <img src="./assets/img/profile.png" alt="Erick Bárcenas" />
      </div>
      <div className="letter-hero-info">
        <h1 className="letter-name">Erick Iván Bárcenas Martínez</h1>
        <p className="letter-role">Senior MLOps · DevSecOps · Cloud/Data Architect</p>
        <div className="letter-chips">
          <span className="chip">GCP</span>
          <span className="chip">AWS</span>
          <span className="chip">Python</span>
          <span className="chip">Terraform</span>
          <span className="chip">MLOps</span>
        </div>
        <div className="letter-contacts">
          <a href={`mailto:${META.email}`} className="letter-contact-item">
            <MailIcon />{META.email}
          </a>
          <a href={waUrl(t.nav.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="letter-contact-item whatsapp">
            <WhatsAppIcon />{META.phone}
          </a>
          <a href={META.linkedin} target="_blank" rel="noopener noreferrer" className="letter-contact-item">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            linkedin/erickbarcenas
          </a>
          <span className="letter-contact-item">
            <LocationIcon />{META.location}
          </span>
        </div>
      </div>
      {/* Quick stats sidebar */}
      <div className="letter-sidebar">
        <div className="letter-stat"><span className="letter-stat-val">8+</span><span className="letter-stat-lbl">{lang === 'en' ? 'Years Exp.' : 'Años Exp.'}</span></div>
        <div className="letter-stat"><span className="letter-stat-val">4+</span><span className="letter-stat-lbl">{lang === 'en' ? 'Companies' : 'Empresas'}</span></div>
        <div className="letter-stat"><span className="letter-stat-val">10+</span><span className="letter-stat-lbl">{lang === 'en' ? 'Projects' : 'Proyectos'}</span></div>
        <div className="letter-stat"><span className="letter-stat-val">2</span><span className="letter-stat-lbl">{lang === 'en' ? 'Clouds' : 'Nubes'}</span></div>
      </div>
    </div>

    {/* ── Body ── */}
    <div className="letter-body">
      {/* Date */}
      <p className="letter-date">
        {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {lang === 'en' ? (
        <div className="letter-content">
          <p className="letter-salutation">Dear Hiring Team,</p>

          <p>
            My name is <strong>Erick Bárcenas</strong>, a <strong>Senior Cloud Architect and Python Engineer</strong> based in Mexico City with over <strong>8 years of experience</strong> designing and deploying large-scale distributed systems. I started my career building full-stack applications for clients across Mexico, and over time I specialized in cloud infrastructure — the layer that determines whether a product survives real traffic or collapses under it.
          </p>

          <p>
            I am what you might call a <strong>builder-architect</strong>: I don&apos;t just design on whiteboards — I write the Terraform, ship the pipelines, and stay through the incidents. At <strong>CXC</strong>, I was the first engineer on the team. I designed the GCP architecture from scratch, built end-to-end MLOps workflows with <strong>MLflow, LlamaIndex, and LangGraph</strong>, and established DevSecOps standards that are now the company&apos;s engineering foundation. At <strong>Rombo Logística</strong>, I led the AWS infrastructure modernization — migrating to microservices on ECS/EKS, implementing event-driven patterns with SQS/SNS, and cutting deployment times significantly with CodePipeline automation.
          </p>

          <p>
            What sets me apart is my <strong>full-stack cloud fluency</strong>: I move fluidly between Python backend services, Terraform infrastructure, CI/CD pipelines, data engineering with BigQuery and Dataflow, and ML model deployment. I don&apos;t need to hand off to three different specialists — I can own the problem end to end. I also care deeply about <strong>engineering culture</strong>: I mentor teams, write documentation, and raise engineering maturity through standards and blueprints, not just code.
          </p>

          <div className="letter-highlights">
            <div className="highlight-item"><span className="highlight-icon">⚡</span><span>Built MVPs from <strong>0→1</strong> at 3 different companies as first engineer</span></div>
            <div className="highlight-item"><span className="highlight-icon">🏗️</span><span>Deep expertise in <strong>GCP + AWS</strong> cloud architecture (8 years AWS, 2 years GCP)</span></div>
            <div className="highlight-item"><span className="highlight-icon">🤖</span><span>Delivered production <strong>MLOps + AI agent</strong> systems (LlamaIndex, LangGraph, MLflow)</span></div>
            <div className="highlight-item"><span className="highlight-icon">🔐</span><span>Strong <strong>DevSecOps</strong> background — IaC governance, secret rotation, SAST/DAST</span></div>
            <div className="highlight-item"><span className="highlight-icon">🧑‍🏫</span><span>Mentor and technical leader — raised engineering maturity at every team I&apos;ve joined</span></div>
          </div>

          <p>
            I thrive in environments with hard problems and high ownership expectations. If your team is building something that needs to scale reliably and securely, I would love to be part of that conversation.
          </p>

          <p>Thank you for your time.</p>
          <p className="letter-closing">Sincerely,</p>
        </div>
      ) : (
        <div className="letter-content">
          <p className="letter-salutation">Estimado equipo de contratación,</p>

          <p>
            Mi nombre es <strong>Erick Bárcenas</strong>, soy <strong>Arquitecto Cloud Senior e Ingeniero Python</strong> con sede en Ciudad de México y más de <strong>8 años de experiencia</strong> diseñando y desplegando sistemas distribuidos a gran escala. Comencé mi carrera construyendo aplicaciones full-stack para clientes en México y con el tiempo me especialicé en infraestructura cloud — la capa que determina si un producto sobrevive el tráfico real o colapsa bajo él.
          </p>

          <p>
            Soy lo que se podría llamar un <strong>arquitecto-constructor</strong>: no solo diseño en pizarrones, también escribo el Terraform, entrego los pipelines y me quedo durante los incidentes. En <strong>CXC</strong> fui el primer ingeniero del equipo. Diseñé la arquitectura GCP desde cero, construí flujos MLOps end-to-end con <strong>MLflow, LlamaIndex y LangGraph</strong>, y establecí estándares DevSecOps que hoy son la base de ingeniería de la empresa. En <strong>Rombo Logística</strong> lideré la modernización de infraestructura AWS — migrando a microservicios en ECS/EKS, implementando patrones event-driven con SQS/SNS, y automatizando despliegues con CodePipeline.
          </p>

          <p>
            Lo que me distingue es mi <strong>fluidez cloud full-stack</strong>: me muevo sin fricción entre servicios backend en Python, infraestructura Terraform, pipelines CI/CD, ingeniería de datos con BigQuery y Dataflow, y despliegue de modelos ML. No necesito delegar a tres especialistas distintos — puedo ser dueño del problema de extremo a extremo. También me importa profundamente la <strong>cultura de ingeniería</strong>: hago mentoría, escribo documentación y elevo la madurez del equipo a través de estándares y blueprints.
          </p>

          <div className="letter-highlights">
            <div className="highlight-item"><span className="highlight-icon">⚡</span><span>Construí MVPs de <strong>0→1</strong> en 3 empresas distintas como primer ingeniero</span></div>
            <div className="highlight-item"><span className="highlight-icon">🏗️</span><span>Expertise profundo en <strong>GCP + AWS</strong> (8 años AWS, 2 años GCP)</span></div>
            <div className="highlight-item"><span className="highlight-icon">🤖</span><span>Sistemas <strong>MLOps + agentes IA</strong> en producción (LlamaIndex, LangGraph, MLflow)</span></div>
            <div className="highlight-item"><span className="highlight-icon">🔐</span><span>Sólido background en <strong>DevSecOps</strong> — IaC governance, rotación de secretos, SAST/DAST</span></div>
            <div className="highlight-item"><span className="highlight-icon">🧑‍🏫</span><span>Mentor y líder técnico — elevé la madurez de ingeniería en cada equipo</span></div>
          </div>

          <p>
            Prospero en entornos con problemas difíciles y expectativas de alta responsabilidad. Si tu equipo está construyendo algo que necesita escalar de manera confiable y segura, me encantaría ser parte de esa conversación.
          </p>

          <p>Gracias por tu tiempo.</p>
          <p className="letter-closing">Atentamente,</p>
        </div>
      )}

      {/* Signature block */}
      <div className="letter-signature">
        <img src="./assets/img/profile.png" alt="Erick" className="sig-avatar" />
        <div>
          <strong className="sig-name">Erick Iván Bárcenas Martínez</strong>
          <span className="sig-title">Senior Cloud Architect · MLOps · DevSecOps</span>
          <div className="sig-links">
            <a href={`mailto:${META.email}`} className="contact-link">{META.email}</a>
            <a href={waUrl(t.nav.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
              <WhatsAppIcon /> WhatsApp
            </a>
            <a href={META.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [view, setView] = useState('portfolio');
  const [instructorAuth, setInstructorAuth] = useState(
    () => sessionStorage.getItem('instructor_auth') === '1'
  );

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
  const toggleCoverLetter = () => setView('coverLetter');
  const goToCourses = () => setView('courses');
  const goToPortfolio = () => setView('portfolio');
  const goToInstructor = () => setView('instructor');

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
        toggleCoverLetter={toggleCoverLetter}
        goToCourses={goToCourses}
        goToPortfolio={goToPortfolio}
        goToInstructor={goToInstructor}
        t={t}
      />
      <main>
        {view === 'portfolio' && <PortfolioView t={t} lang={lang} />}
        {view === 'coverLetter' && <CoverLetterView t={t} lang={lang} />}
        {view === 'courses' && <CoursesView t={t} lang={lang} />}
        {view === 'instructor' && (
          instructorAuth
            ? <InstructorView lang={lang} />
            : <InstructorLogin onAuth={() => setInstructorAuth(true)} />
        )}
      </main>
      {view !== 'instructor' && <Footer t={t} />}
      <FloatingWhatsApp t={t} />
    </div>
  );
};

export default App;
