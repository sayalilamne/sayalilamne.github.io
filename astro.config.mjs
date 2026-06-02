// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: replace USERNAME with your GitHub username (root user site, no `base` needed).
  site: 'https://USERNAME.github.io',
  vite: {
    plugins: [tailwindcss()]
  }
});