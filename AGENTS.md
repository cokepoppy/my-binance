# Repository Guidelines

## Project Structure & Module Organization
- Root contains static pages (e.g., `index.html`, `markets.html`, `trade.html`, `wallet.html`).
- `css/` holds styles: `styles.css` (global) plus page-specific files (e.g., `markets.css`, `trade.css`). Use hyphenated class names.
- `js/` holds scripts: `main.js` (global UI behavior) plus page-specific files (e.g., `markets.js`, `trade.js`). ES6 classes and utilities live here.
- `doc/` contains reference docs and guides. Logs like `*.log` are development artifacts.

## Build, Test, and Development Commands
- Serve locally (recommended):
  - Python: `python3 -m http.server 8080` then visit `http://localhost:8080`.
  - Node (if installed): `npx http-server`.
- Quick check: open `index.html` directly in a browser, but prefer a server for correct relative paths.
- Manual test pages: open `navigation_test.html` to verify nav behavior; review `server.log` only for local debug.

## Coding Style & Naming Conventions
- Indentation: 4 spaces; UTF‑8; Unix newlines.
- HTML: semantic elements; accessible attributes; consistent section ordering (header → main → footer).
- CSS: use variables from `:root`; hyphen-case selectors; keep selectors shallow; group related rules; one page stylesheet per page.
- JavaScript: ES6+; camelCase for variables/functions; PascalCase for classes (e.g., `BinanceApp`); group DOM queries and event bindings in setup methods (see `setupEventListeners` in `main.js`). Avoid leaking globals.
- Filenames: keep page/style/script names aligned (e.g., `markets.html`, `css/markets.css`, `js/markets.js`).

## Testing Guidelines
- Primary: manual UI checks in latest Chrome/Firefox/Safari/Edge.
- Smoke checklist per page: load without console errors; nav highlights active link; market filters animate; ticker/sparkline update; mobile breakpoints render cleanly.
- Optional tooling (if available): `npx htmlhint` for HTML, `npx stylelint "css/**/*.css"`, `npx eslint "js/**/*.js"`.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.
- Commits: small, focused, present-tense imperative (e.g., `fix: correct active nav highlight`).
- PRs: include summary, linked issue, before/after screenshots for UI changes, test notes (browsers/devices checked), and any risk/rollback notes.

## Security & Configuration Tips
- Do not commit secrets or tokens; this is a static site—keep it dependency‑free where possible.
- Avoid committing large logs; add to `.gitignore` if needed.
- Sanitize any future user input and keep third‑party links pinned and minimal.

