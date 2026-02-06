/**
 * Renders a list of chips for skills
 * @param {Array<string>} skills
 * @returns {string} HTML string
 */
const renderChips = (skills) => {
  return skills.map((skill) => `<span class="chip">${skill}</span>`).join("");
};

/**
 * Renders the technical skills section as Architectural Cards
 * @param {Array<Object>} skillGroups
 * @returns {string} HTML string
 */
export const renderSkills = (skillGroups) => {
  return skillGroups
    .map(
      (group) => `
        <div class="arch-card">
            <h3 class="arch-title">${group.title}</h3>
            <p class="arch-desc">${group.description}</p>
            <div class="arch-tags">
                ${renderChips(group.tags)}
            </div>
        </div>
    `,
    )
    .join("");
};

/**
 * Renders the experience dictionary timeline
 * @param {Array<Object>} experienceList
 * @returns {string} HTML string
 */
export const renderExperience = (experienceList) => {
  return experienceList
    .map(
      (role) => `
        <div class="timeline-item">
            <div class="role-header">
                <div class="role-title">${role.role}</div>
                <div class="role-meta">${role.company} • ${role.period}</div>
            </div>
            <p class="role-desc" style="font-size: 0.9rem; margin-bottom: 0.5rem;">${
              role.description
            }</p>
            <ul class="text-secondary text-sm" style="list-style: disc; padding-left: 1rem; margin-top: 0.5rem; display: grid; gap: 0.35rem;">
                ${
                  role.details
                    ? role.details
                        .map((detail) => `<li>${detail}</li>`)
                        .join("")
                    : ""
                }
            </ul>
        </div>
    `,
    )
    .join("");
};

/**
 * Renders public projects grid
 * @param {Array<Object>} projectList
 * @returns {string} HTML string
 */
export const renderProjects = (projectList) => {
  return projectList
    .map(
      (project) => `
        <article class="card project-card">
            <div class="project-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <div>
                <h3>${project.title}</h3>
                <p class="text-secondary text-sm">${project.description}</p>
            </div>
            <div class="card-footer">
                <a href="${project.link}" target="_blank" class="text-accent text-sm flex items-center gap-2">
                    View Project
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
            </div>
        </article>
    `,
    )
    .join("");
};

/**
 * Renders the current year into elements with specific ID
 * @param {string} elementId
 */
export const renderYear = (elementId = "year") => {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = new Date().getFullYear();
  }
};

/**
 * Renders current formatted date for cover letter
 * @param {string} elementId
 */
export const renderDate = (elementId = "date") => {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
