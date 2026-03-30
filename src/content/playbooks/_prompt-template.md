# Playbook Generation Prompt Template

Use this prompt in Claude or ChatGPT to generate a new module playbook in the exact same format as the existing ones.

---

## The Prompt (copy-paste and fill in the variables)

```
You are helping me create an instructor playbook for a technical course module.

Course: {{COURSE_NAME}}
Module: {{MODULE_NUMBER}} — {{MODULE_TITLE}}
Level: {{LEVEL}}
Topics covered: {{TOPICS_LIST}}
Audience: software engineers with {{PREREQUISITE_KNOWLEDGE}}

Generate a markdown playbook file with this EXACT structure:

---

# Module {{MODULE_NUMBER}} — {{MODULE_TITLE}}

## Overview
- (3 bullet points: what students will learn, written as outcomes starting with a verb)

---

## [Main Concept Name — e.g., "Request Lifecycle" or "Architecture Diagram"]

(ASCII diagram using ONLY these box-drawing characters: ┌─┐│└┘├─┤┬┴┼▼▲→←)
(Diagram must be minimum 20 lines, clearly labeled, well-aligned)
(Add brief explanation paragraph after the diagram)

---

## [Second Key Concept or Comparison]

(Second ASCII diagram OR comparison table using ASCII)
(If a comparison table: use ┌─┬─┐ │ │ └─┴─┘ style)

---

## Key Concepts

(5-7 bullet points. Format: **Bold concept name**: explanation in one sentence)

---

## Code Example

(Realistic, production-quality code snippet. Language: {{PRIMARY_LANGUAGE}})
(Use triple backticks with language hint)
(Max 30 lines, focused on the most important pattern)

---

## Teaching Notes

(4-5 bullet points covering:)
- **Common mistake**: [what beginners always get wrong]
- **Gotcha**: [non-obvious behavior that trips people up]
- **Performance/cost tip**: [real-world optimization]
- **Testing tip**: [how to test this in isolation]

---

## Practice Exercise

(1 main exercise with 4 numbered steps, increasing difficulty)
(+ 1 Bonus challenge that goes beyond the module scope)

---

IMPORTANT RULES for the ASCII diagrams:
1. ONLY use: ┌─┐│└┘├─┤┬┴┼▼▲→← and regular alphanumeric text
2. Every box must be properly closed (all 4 corners)
3. All lines in a row must have the same width (use spaces to pad)
4. Label every component, arrow, and section
5. Show data/control flow direction with arrows (→ ▼ ▲ ←)
6. Add a 1-line explanation of the diagram AFTER it
```

---

## Example Filled-In Prompt

```
Course: Backend Architecture with Python
Module: 5 — Async Task Queues
Level: Intermediate
Topics covered: Celery, Redis, task states, retry strategies, periodic tasks
Audience: Python developers familiar with FastAPI and basic async concepts
Primary Language: Python
```

---

## Tips for Better Results

- **Be specific about the audience** — "Python devs who know FastAPI" gives much better code than "developers"
- **Name the exact tools** — "Celery 5.3 with Redis backend" vs just "task queues"
- **Request specific diagrams** — "include a task state machine diagram" if you need it
- **Ask for anti-patterns** — add "include 2 anti-pattern examples to avoid" to Teaching Notes
- **Iterate on diagrams** — if the ASCII is misaligned, say "redraw the diagram ensuring all rows are exactly 56 chars wide"
- **Validate with a student** — after generating, ask a student to read it cold and report confusion points

---

## Folder Naming Convention

```
src/content/playbooks/
├── {course-key}/
│   ├── m1-{slug}.md
│   ├── m2-{slug}.md
│   ├── m3-{slug}.md
│   └── m4-{slug}.md
```

Course keys: `backend-python`, `aws`, `gcp`, `genai`, `devsecops`, `event-driven`

After creating the file, add the `playbookKey` field to the course in `src/data.json` and import the file in `src/App.jsx`.
