# Erick Bárcenas - Personal Portfolio

This repository contains the source code for my personal portfolio and professional cover letter, designed for hosting on [GitHub Pages](https://pages.github.com/).

It features a clean, static architecture separating content, styling, and logic without relying on heavy frameworks or build tools.

## Structure

The project has been refactored for maintainability:

- **`/index.html`**: Main shell for the portfolio (layout only).
- **`/cover-letter.html`**: Main shell for the cover letter (layout only).
- **`/css/`**: Styling modules (Base variables, Layout, Components).
- **`/js/`**:
    - `data.js`: **EDIT THIS FILE** to update content (Experience, Projects, Skills).
    - `render.js`: Pure functions that generate HTML.
    - `main.js`: Application entry point.

## Quick Start (Developer Guide)

Because this project uses modern ES Modules (`import/export`), you cannot simply double-click `index.html` to open it. Browsers block local file system imports for security.

### 1. Prerequisites
- **Python 3** (pre-installed on most Linux/macOS systems)
- **Git**

### 2. Run Locally
To preview your changes locally, start a simple HTTP server in the project root:

```bash
# Run this in the repo root
python3 -m http.server
```

Then open your browser to [http://localhost:8000](http://localhost:8000).

### 3. Making Changes

#### Updating Content
Go to `js/data.js`. You can add new array items to `experience` or `projects` objects. The site will automatically render them.

#### Updating Styles
- **`css/base.css`**: Global variables, colors, fonts.
- **`css/layout.css`**: Grid systems, header/footer spacing.
- **`css/components.css`**: Card designs, buttons, chips.

### 4. Code Quality & Pre-commit
This project uses `pre-commit` to ensure code quality and consistent formatting.

**Install pre-commit:**
```bash
pip install pre-commit
pre-commit install
```

Now, every time you `git commit`, it will automatically:
- Fix trailing whitespace.
- Format HTML/JS/CSS files with Prettier.
- Check for basic syntax errors.

## Deployment

This site is statically generated at runtime.

1. **Push to GitHub**: Just push your changes to the `main` branch.
2. **GitHub Pages settings**:
   - Source: `Deploy from a branch`
   - Branch: `main` / Folder: `/(root)`
3. **View**: `https://<your-username>.github.io/`

## Technology Stack

- **HTML5**: Semantic structure.
- **CSS3** (Variables + Flexbox/Grid): Custom design system.
- **Vanilla JavaScript (ES6+)**: Module-based architecture.
- **No Build Tools**: Runs directly in the browser.
