# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server on port 8005
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run deploy    # Build + publish to GitHub Pages via gh-pages
```

The legacy `make up` target (`uv run python3 -m http.server 8005`) serves the old vanilla JS build from the project root — it is not used for the React/Vite version.

## Architecture

This is a **personal portfolio and courses site** built with React 18 + Vite, deployed to GitHub Pages using `HashRouter` (required for static hosting with client-side routes).

### Routes

| Path | View |
|---|---|
| `/` | Portfolio (bento-grid CV layout) |
| `/cover-letter` | Cover letter page |
| `/courses` | Course catalog |
| `/instructor` | Password-protected playbook viewer |

### Data layer

All content lives in **[src/data.json](src/data.json)**. The file [src/data.js](src/data.js) re-exports named slices (`CV_DATA`, `META`, `EDUCATION`, `COURSES`, `SKILLS_DETAILED`, etc.). The JSON is the single source of truth for bio, experience, skills, projects, courses, and contact info. To update site content, edit `data.json`.

### Translations

`data.json` contains parallel `en` / `es` keys under `CV_DATA`. The active language is stored in `localStorage` and toggled by the `lang` button in the header. Components receive a `lang` prop and a `t` translation object derived from `CV_DATA[lang]`.

### Playbooks (instructor portal)

Markdown playbooks live under [src/content/playbooks/](src/content/playbooks/) organized by course (`aws/`, `gcp/`, `backend-python/`, `genai/`) with 4 modules each (`m1-`–`m4-`). They are **lazy-loaded** via `import('...?raw')` — not bundled in the main chunk. A custom `MarkdownRenderer` component in `App.jsx` handles rendering (no external markdown library). The instructor password is gated by comparing a SHA-256 hash client-side (`sha256Hex` in `App.jsx`) against `VITE_INSTRUCTOR_PASS_HASH` in `.env` (see `.env.example`) — the plaintext password is never stored in the repo or the built bundle. This is a soft gate for course content only, not real access control.

### Styling

Three CSS files imported in `main.jsx`:
- **[src/css/base.css](src/css/base.css)** — CSS custom properties (colors, fonts, theme variables via `data-theme` attribute)
- **[src/css/layout.css](src/css/layout.css)** — grid systems, header/footer, page-level layout
- **[src/css/components.css](src/css/components.css)** — cards, buttons, chips, course cards, instructor UI

Themes are toggled via `document.documentElement.setAttribute('data-theme', theme)`.

### Print/CV mode

The `PrintHeader` component renders only for `@media print` (class `print-only`). The print button sets `document.title` to the candidate name before calling `window.print()`, producing a clean PDF filename.

### Legacy files

The `/js/` and `/css/` directories at the repo root are the original vanilla JS implementation. The active codebase is entirely under `/src/`. The `index.html` at the root is the Vite entry point — it references `src/main.jsx`.
