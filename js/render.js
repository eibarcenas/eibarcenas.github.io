/**
 * Renders a list of chips for skills
 * @param {Array<string>} skills 
 * @returns {string} HTML string
 */
const renderChips = (skills) => {
    return skills.map(skill => `<span class="chip">${skill}</span>`).join('');
};

/**
 * Renders the technical skills section
 * @param {Array<Object>} skillGroups 
 * @returns {string} HTML string
 */
export const renderSkills = (skillGroups) => {
    return skillGroups.map(group => `
        <div class="skill-group">
            <h3>${group.title}</h3>
            <div class="skill-list">
                ${renderChips(group.skills)}
            </div>
        </div>
    `).join('');
};

/**
 * Renders the experience dictionary timeline
 * @param {Array<Object>} experienceList 
 * @returns {string} HTML string
 */
export const renderExperience = (experienceList) => {
    return experienceList.map(role => `
        <div class="timeline-item">
            <div class="role-header">
                <div class="role-title">${role.role} @ ${role.company}</div>
                <div class="role-meta">${role.period}</div>
            </div>
            <p class="role-desc">${role.description}</p>
            <ul class="text-secondary text-sm" style="list-style: disc; padding-left: 1rem; margin-top: 0.5rem; display: grid; gap: 0.5rem;">
                ${role.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        </div>
    `).join('');
};

/**
 * Renders public projects grid
 * @param {Array<Object>} projectList 
 * @returns {string} HTML string
 */
export const renderProjects = (projectList) => {
    return projectList.map(project => `
        <article class="card project-card">
            <h3>${project.title}</h3>
            <p class="text-secondary text-sm">${project.description}</p>
            <a href="${project.link}" target="_blank">View Live →</a>
        </article>
    `).join('');
};

/**
 * Renders the current year into elements with specific ID
 * @param {string} elementId 
 */
export const renderYear = (elementId = 'year') => {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = new Date().getFullYear();
    }
};

/**
 * Renders current formatted date for cover letter
 * @param {string} elementId 
 */
export const renderDate = (elementId = 'date') => {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
};
