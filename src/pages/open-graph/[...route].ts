import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

// Dynamically generate pages object from blog collections
const blogEntries = await getCollection('blog');
const interactiveBlogEntries = await getCollection('interactiveBlog');
const allBlogEntries = [...blogEntries, ...interactiveBlogEntries];

// Create pages object dynamically
const pages: Record<string, { title: string; description: string }> = {
  // Other pages
  'writing': {
    title: 'Writing',
    description: 'My blog page',
  },
  'index': {
    title: 'Home Page',
    description: 'Welcome to my home page.',
  },
  'projects': {
    title: 'Projects',
    description: 'My projects page.',
  }
};

// Add all blog posts dynamically
for (const entry of allBlogEntries) {
  const slug = entry.id;
  pages[`writing/${slug}`] = {
    title: entry.data.title,
    description: entry.data.tags.join(', '),
  };
}

export const { getStaticPaths, GET } = OGImageRoute({
  // Tell us the name of your dynamic route segment.
  // In this case it's `route`, because the file is named `[...route].ts`.
  param: 'route',

  // A collection of pages to generate images for.
  // The keys of this object are used to generate the path for that image.
  pages,

  // For each page, this callback will be used to customize the OpenGraph image.
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[24, 24, 27]], // Dark background similar to site
    border: { color: [63, 63, 70], width: 20 }, // Subtle border
    padding: 60,
    font: {
      title: {
        color: [255, 255, 255],
        size: 72,
        families: ['sans-serif'],
        weight: 'Bold',
      },
      description: {
        color: [161, 161, 170],
        size: 36,
        families: ['sans-serif'],
        weight: 'Normal',
      },
    },
    fonts: [], // Empty to avoid external font loading
  }),
});
