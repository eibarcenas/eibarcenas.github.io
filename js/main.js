import { translations } from "./translations.js";
import {
  renderSkills,
  renderExperience,
  renderProjects,
  renderYear,
  renderDate,
} from "./render.js";

document.addEventListener("DOMContentLoaded", () => {
  // State
  const state = {
    lang: localStorage.getItem("lang") || "en",
    theme: localStorage.getItem("theme") || "dark",
  };

  // DOM Elements
  const elements = {
    themeToggle: document.getElementById("theme-toggle"),
    langToggle: document.getElementById("lang-toggle"),
    skillsContainer: document.getElementById("skills-container"),
    experienceContainer: document.getElementById("experience-container"),
    projectsContainer: document.getElementById("projects-container"),
    year: document.getElementById("year"),
    date: document.getElementById("date"),
    i18n: document.querySelectorAll("[data-i18n]"),
  };

  // Initialize
  const init = () => {
    applyTheme(state.theme);
    applyLanguage(state.lang);
    setupEventListeners();
    renderYear("year");
    if (elements.date) renderDate("date");
    console.log(
      "Site initialized with Theme:",
      state.theme,
      "Lang:",
      state.lang,
    );
  };

  // Theme Logic
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    updateToggleIcon(theme);
    localStorage.setItem("theme", theme);
  };

  const updateToggleIcon = (theme) => {
    if (!elements.themeToggle) return;
    const icon = theme === "light" ? "🌙" : "☀️";
    elements.themeToggle.innerHTML = icon;
  };

  // Language Logic
  const applyLanguage = (lang) => {
    const t = translations[lang];
    if (!t) return;

    // Update static text
    elements.i18n.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNestedValue(t, key);
      if (value) {
        if (el.tagName === "META") {
          el.content = value;
        } else {
          el.innerHTML = value;
        }
      }
    });

    // Update dynamic content
    if (elements.skillsContainer)
      elements.skillsContainer.innerHTML = renderSkills(t.data.skills);
    if (elements.experienceContainer)
      elements.experienceContainer.innerHTML = renderExperience(
        t.data.experience,
      );
    if (elements.projectsContainer)
      elements.projectsContainer.innerHTML = renderProjects(t.data.projects);

    if (elements.langToggle)
      elements.langToggle.textContent = lang.toUpperCase();
    localStorage.setItem("lang", lang);
  };

  // Helper
  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((prev, curr) => (prev ? prev[curr] : null), obj);
  };

  // Listeners
  const setupEventListeners = () => {
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener("click", () => {
        state.theme = state.theme === "dark" ? "light" : "dark";
        applyTheme(state.theme);
      });
    }

    if (elements.langToggle) {
      elements.langToggle.addEventListener("click", () => {
        state.lang = state.lang === "en" ? "es" : "en";
        applyLanguage(state.lang);
      });
    }
  };

  init();
});
