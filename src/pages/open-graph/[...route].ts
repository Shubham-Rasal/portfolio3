import { OGImageRoute } from 'astro-og-canvas';

export const { getStaticPaths, GET } = OGImageRoute({
  // Tell us the name of your dynamic route segment.
  // In this case it’s `route`, because the file is named `[...route].ts`.
  param: 'route',

  // A collection of pages to generate images for.
  // The keys of this object are used to generate the path for that image.
  // In this example, we generate one image at `/open-graph/example.png`.
  pages: {
   // Blog pages
   'writing/agentic-browser': {
     title: 'Agentic Browsers',
     description: 'Exploring the concept of agentic browsers.',
   },
   'writing/ai-manga-translator': {
     title: 'AI Manga Translator',
     description: 'Translating manga with AI.',
   },
   'writing/blog-1': {
    title: 'Blog Post 1',
    description: 'My first blog post.',
   },
   'writing/database-choice-for-toy-blockchain': {
     title: 'Database Choice for Toy Blockchain',
     description: 'Choosing a database for a toy blockchain project.',
   },
   'writing/devlog-1': {
    title: 'Devlog 1',
    description: 'My first devlog entry.',
   },
   'writing/devlog-2': {
    title: 'Devlog 2',
    description: 'My second devlog entry.',
   },
   'writing/devlog-3': {
    title: 'Devlog 3',
    description: 'My third devlog entry.',
   },
   'writing/devlog-4': {
    title: 'Devlog 4',
    description: 'My fourth devlog entry.',
   },
   'writing/guide-to-engineering-colleges': {
     title: 'Guide to Engineering Colleges',
     description: 'A guide to engineering colleges.',
   },
   'writing/memetic-desire': {
    title: 'Memetic Desire',
    description: 'Exploring memetic desire.',
   },
   'writing/mit-hackathon-experience': {
     title: 'MIT Hackathon Experience',
     description: 'My experience at the MIT hackathon.',
   },
   'writing/on-reasoning': {
    title: 'On Reasoning',
    description: 'Thoughts on reasoning.',
   },
   'writing/programming-is-doomed': {
     title: 'Programming is Doomed',
     description: 'Why programming might be doomed.',
   },
   'writing/the-final-objective-function': {
     title: 'The Final Objective Function',
     description: 'Exploring the final objective function.',
   },
   'writing/working-hard': {
    title: 'Working Hard',
    description: 'The importance of working hard.',
   },
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
  },

  // For each page, this callback will be used to customize the OpenGraph image.
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/og.png',
    },
    
    // There are a bunch more options you can use here!
  }),
});