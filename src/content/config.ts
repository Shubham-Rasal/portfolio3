import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

// 2. Define your collection(s)
const blogCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    // type: "content",
    schema: z.object({
        title: z.string(),
        date: z.date(),
        tags: z.array(z.string())
    }),
});

const interactiveBlogCollection = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        tags: z.array(z.string())
    }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
  interactiveBlog: interactiveBlogCollection
};
