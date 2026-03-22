// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';
import remarkToc from 'remark-toc';
// import rehypeAccessibleEmojis from 'rehype-accessible-emojis';

import vercel from '@astrojs/vercel';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://shubhamrasal.com', // Replace with your actual domain
  integrations: [tailwind(), react(), mdx()],
  output: 'static',

  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-light',
    },
    remarkPlugins: [remarkToc],
  },

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});