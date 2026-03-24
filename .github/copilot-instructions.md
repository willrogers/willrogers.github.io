# Copilot Instructions for this repository

This repository is a static site built with Eleventy (11ty). These instructions help Copilot sessions quickly understand how to build, run, and navigate the project.

---

## 1) Build, test, and lint commands

- Dev server (live reload, writes to `docs/`):
  npx @11ty/eleventy --serve

- Production build (generates `docs/`):
  npx @11ty/eleventy

- Tests: none configured in package.json by default. `npm test` prints an error by design.
  This repository now includes an example Playwright setup (dev dependency + scaffold).

- Playwright E2E (added):
  - Dev server: npm run start:dev # runs Eleventy dev server on http://localhost:8080
  - Run all e2e tests: npm run test:e2e
  - Run a single test file: npx playwright test tests/example.spec.js
  - Run a single test by name: npx playwright test -g "homepage responds with status < 400"
  - To install Playwright browsers locally (after npm install): npx playwright install

- Linting: no linter configured. Do not assume lint commands exist.

Note: You can run the e2e tests locally by starting the dev server in one terminal and running the Playwright test command in another.

---

## 2) High-level architecture (big picture)

- Generator: Eleventy (dependency: @11ty/eleventy in package.json).
- Source content directory: `content/` (Eleventy `dir.input`).
- Template includes: the project uses `_includes/` at the repository root; Eleventy config sets `includes: "../_includes"` relative to `content/` — this is a key layout/layouts placement detail.
- Global data: `_data/` at repo root (referenced as `../_data` from `content/`).
- Static assets: `static/`, `css/`, and `js/` are passthrough-copied (see `.eleventy.js`). Keep public assets here; they land unchanged in `docs/`.
- Output directory: `docs/` — this is the built site and is deployed via GitHub Pages from the main branch.
- Small code addition: `.eleventy.js` registers a `postDate` filter backed by Luxon for date formatting.

Workflow summary: authors add Markdown/templated pages to `content/` (using front matter), layouts/partials live under `_includes/`, build with `npx @11ty/eleventy`, and commit `docs/` for GitHub Pages deployment.

---

## 3) Key conventions and repository-specific quirks

- Directory layout is intentionally split: `content/` holds source files while `_includes/` and `_data/` live outside `content/`. When editing templates or data, open `_includes/` and `_data/` at the repo root (not under `content/`).

- Passthrough copy: static resources placed in `static/`, `css/`, or `js/` are copied verbatim to the output. Keep CSS/JS here if they should be served as static files.

- Date handling: use `postDate` Eleventy filter for consistent formatting in templates — it expects a JS Date object in front matter or collection items.

- Output is authoritative for deployment: `docs/` is the published directory. CI or manual deploys take the generated `docs/` content as the site root. Avoid making manual edits directly in `docs/` unless they are generated or intended for deployment.

- package.json is minimal: add scripts (e.g., `build`, `start`, `test`) if toolchains (CI, local tooling) expect them. Currently only dependency is `@11ty/eleventy`.

---

## 4) Files and AI assistant integration checks

- No existing .github/copilot-instructions.md (this file created).
- No CLAUDE.md, .cursorrules, AGENTS.md, or other AI assistant rule files were found when these instructions were created. If such files are added later, merge important rules into this file.

---

## 5) Quick pointers for Copilot sessions

- Primary entry points: `.eleventy.js`, `content/`, `_includes/`, and `_data/`.
- When asked to add content pages, place them in `content/` and reference includes in `_includes/`.
- When asked to change deployment, check GitHub Pages settings and `docs/` output.
- Prefer running `npx @11ty/eleventy` locally to validate builds before suggesting deploy changes.

---

If this repo later gains testing, linting, or CI workflows, include exact commands and examples here (how to run a single test, test filters, and lint rules).
