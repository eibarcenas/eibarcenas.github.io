import { technicalSkills, experience, projects } from './data.js';
import { renderSkills, renderExperience, renderProjects, renderYear, renderDate } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    // Common Logic
    renderYear('year');

    // Index Page Logic
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = renderSkills(technicalSkills);
    }

    const experienceContainer = document.getElementById('experience-container');
    if (experienceContainer) {
        experienceContainer.innerHTML = renderExperience(experience);
    }

    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        projectsContainer.innerHTML = renderProjects(projects);
    }

    // Cover Letter Logic
    const dateContainer = document.getElementById('date');
    if (dateContainer) {
        renderDate('date');
    }
    
    console.log('Site initialized successfully.');
});
