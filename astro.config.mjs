// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';
import remarkToc from 'remark-toc';
import rehypeAccessibleEmojis from 'rehype-accessible-emojis';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'hybrid',
  markdown: {
    syntaxHighlight: 'prism',
    // Applied to .md and .mdx files
    remarkPlugins: [remarkToc],
    // rehypePlugins: [rehypeAccessibleEmojis],
  },
  
});