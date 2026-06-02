// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Root user site (https://sayalilamne.github.io) — no `base` needed.
  site: 'https://sayalilamne.github.io',
  vite: {
    plugins: [tailwindcss()]
  }
});