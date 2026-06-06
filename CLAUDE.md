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

Styling mixes two systems and you need both:

- **Tailwind CSS v4** wired through the Vite plugin (`@tailwindcss/vite` in [astro.config.mjs](astro.config.mjs)); the only stylesheet is [src/styles/global.css](src/styles/global.css), which is just `@import "tailwindcss";`. Tailwind v4 generates utilities on demand — e.g. `-ml-15` produces `margin-left: calc(var(--spacing) * -15)`. Used for the hero card layout/spacing and the terracotta action buttons.
- A page-specific **`<style>` block in the `<head>` of `index.astro`** holds everything else: the intro typography (`.intro-*`), the whole Projects section (`.projects-*`, `.cat-card*`), the hero scroll cue (`.scroll-cue*`), and the scroll-reveal classes (`.reveal` / `.reveal.is-visible`). It also has the `@media` breakpoints and a `prefers-reduced-motion` block. Most non-trivial visual work happens here, not in Tailwind classes.

The brand terracotta is `#DB634C` (hover `#C2503A`); the secondary gray for body/description text is `#6b6b6b`.

A small **inline `<script is:inline>` at the end of `<body>`** drives two behaviors with no framework: (1) an `IntersectionObserver` that adds `.is-visible` to every `.reveal` element as it scrolls into view (translateY + fade, staggered via `transitionDelay`), and (2) single-select card behavior — clicking/Enter/Space on a `.cat-card` toggles `.is-active` (and `aria-pressed`), clearing it from the previously selected card. There is no React/Framer Motion despite any request phrasing; keep new interactivity in this vanilla script.

Static assets (the hero GIFs `facade-*.gif`, `portrait.jpg`, favicons) live in [public/](public/) and are referenced by absolute path (e.g. `src="/portrait.jpg"`). The `compiled-content/` directory holds source design assets and is git-ignored / not served.

### Layout notes for index.astro

The page is one continuous scroll story: **hero → intro card → Projects section**, connected by `scroll-behavior: smooth` and in-page `#projects` anchors (the nav "Projects" link and the terracotta "Projects" button both target it).

- **Hero**: a half-height `<section>` (`h-[50vh]`) with a low-opacity facade GIF background and a top nav, followed by an intro `<section>` pulled up with negative top margin (`-mt-32 sm:-mt-44 lg:-mt-56`) so the white card overlaps onto the GIF's bottom edge. A floating "Scroll Down" cue sits centered below the card and links to `#projects`.
- **Intro card**: a centered `max-width: 1100px` container with a two-column CSS grid (`md:grid-cols-[2fr_3fr]` → ~40% photo / ~60% text). The text column uses a negative left margin so its bio paragraphs overlap onto the portrait.
- **Projects section** (`#projects`, `min-height: 100vh`): a deliberately **right-weighted** composition — `.projects-inner` uses `margin-left: auto` + extra left padding so the block leans right rather than centering. Inside it a left heading column (`.projects-head`) sits beside a 3×2 `.projects-grid` of `.cat-card`s. Each card is borderless: image area (`.cat-card__media` with a `.cat-card__fill` layer that zooms on `.is-active`), then the category number, then a fixed-height text block. `.cat-card__fill` is `background-image`-ready — drop the six thumbnails there.
- Fonts: body uses **Raleway** (loaded from Google Fonts in the head). The intro typography deliberately specifies Microsoft fonts (Abadi Extra Light, Impact, Arial Nova Light, Aptos Narrow) with web-safe fallbacks — non-Windows visitors will see the fallbacks, so judge final appearance accordingly.
- When the user attaches a reference slide/screenshot, that is the authoritative visual target for sizing/layout, overriding any pixel values in older specs.
