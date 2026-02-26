# Plan: Set Up Vite + React Study App

## Context
The repository is empty (just a README.md) on branch `claude/finance-study-app-nEgCt`. The user provided a complete single-file React component — a study notes app for Tarullo's "Regulation of International Finance" course with 24 sessions of notes, readings, and exam tips. We need to scaffold a Vite + React project and add this component as the main app.

## Files to Create

### 1. `.gitignore`
Standard Node/Vite ignores: `node_modules`, `dist`, `.DS_Store`, `*.local`

### 2. `package.json`
- `"type": "module"` (required for Vite 7.x)
- Dependencies: `react`, `react-dom`
- Dev dependencies: `vite`, `@vitejs/plugin-react`
- Scripts: `dev`, `build`, `preview`

### 3. `vite.config.js`
Minimal config with `@vitejs/plugin-react` plugin.

### 4. `index.html`
- Vite entry point at project root
- Google Fonts link for **IBM Plex Mono** (weights 400, 500, 600, 700)
- `<script type="module" src="/src/main.jsx">`

### 5. `src/main.jsx`
Standard React 19 entry: `ReactDOM.createRoot` rendering `<App />` in `StrictMode`.

### 6. `src/App.jsx`
The user's component with these fixes applied:
- **Fix `window.storage`** → Replace with `localStorage.getItem` / `localStorage.setItem` wrapped in try/catch helpers
- **Fix spread operators** → Replace Unicode ellipsis `…` (U+2026) with three ASCII dots `...`
- **Validate JSX** — ensure all tags, imports, and handlers are correct

## Execution Steps

1. `mkdir -p src`
2. Write all 6 files
3. `npm install` — generates `node_modules/` and `package-lock.json`
4. `npm run build` — verify the app compiles without errors; fix any issues
5. Stage files explicitly: `.gitignore`, `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`
6. Commit and push to `claude/finance-study-app-nEgCt`

## Verification
- `npm run build` succeeds with no errors
- Build output in `dist/` contains bundled JS and HTML
