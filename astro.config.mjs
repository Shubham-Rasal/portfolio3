// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';
import remarkToc from 'remark-toc';
// import rehypeAccessibleEmojis from 'rehype-accessible-emojis';

import vercel from '@astrojs/vercel';

import mdx from '@astrojs/mdx';
import cursorTracesThemeRaw from './src/themes/cursor-traces.json';
/** @type {any} */
const cursorTracesTheme = cursorTracesThemeRaw;

// https://astro.build/config
export default defineConfig({
  site: 'https://shubhamrasal.com', // Replace with your actual domain
  integrations: [tailwind(), react(), mdx()],
  output: 'static',

  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: cursorTracesTheme,
      },
    },
    remarkPlugins: [remarkToc],
  },

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});