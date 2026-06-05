# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — local dev server at http://localhost:4321/ (hot-reloads on save)
- `npm run build` — production build to `./dist/`
- `npm run preview` — serve the built `./dist/` locally to verify before relying on deploy
- `npm run astro check` — Astro type/diagnostic check

There is no test suite or linter configured. Requires Node >= 22.12.0.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with `withastro/action@v3` and publishes to GitHub Pages at **https://sayalilamne.github.io** (a root user site — `astro.config.mjs` sets `site` but no `base`). There is no staging environment; `main` is production. The `gh` CLI is not installed in this environment, so check deploy status via the repository's Actions tab in a browser rather than `gh run`.

## Architecture

This is a single-page Astro v6 portfolio site. The entire page lives in [src/pages/index.astro](src/pages/index.astro) — there are no components, layouts, or additional routes. When changing the page, edit that one file.

Styling is **Tailwind CSS v4** wired through the Vite plugin (`@tailwindcss/vite` in [astro.config.mjs](astro.config.mjs)); the only stylesheet is [src/styles/global.css](src/styles/global.css), which is just `@import "tailwindcss";`. Tailwind v4 generates utilities on demand — e.g. `-ml-15` produces `margin-left: calc(var(--spacing) * -15)`. Use Tailwind utility classes for layout/spacing; the `<style>` block in `index.astro` holds the page-specific intro typography (`.intro-greeting`, `.intro-name`, `.intro-credentials`, `.intro-bio`, `.intro-quote`).

Static assets (the hero GIFs `facade-*.gif`, `portrait.jpg`, favicons) live in [public/](public/) and are referenced by absolute path (e.g. `src="/portrait.jpg"`). The `compiled-content/` directory holds source design assets (untracked) and is not served.

### Layout notes for index.astro

- The page is a half-height hero `<section>` (`h-[50vh]`) with a low-opacity facade GIF background, followed by an intro `<section>` pulled up with negative top margin (`-mt-32 sm:-mt-44 lg:-mt-56`) so the white card overlaps onto the GIF's bottom edge.
- The white card is a centered, fixed-max-width container (`max-width: 1100px`) with a two-column CSS grid (`md:grid-cols-[2fr_3fr]` → ~40% photo / ~60% text). The text column uses a negative left margin so its bio paragraphs overlap onto the portrait.
- Fonts: body uses **Raleway** (loaded from Google Fonts in the head). The intro typography deliberately specifies Microsoft fonts (Abadi Extra Light, Impact, Arial Nova Light, Aptos Narrow) with web-safe fallbacks — non-Windows visitors will see the fallbacks, so judge final appearance accordingly.
- The reference slide screenshot the user prepared is the authoritative visual target for sizing/layout, overriding any pixel values in older specs.
