import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  // Get both blog collections
  const blogPosts = await getCollection('blog');
  const interactiveBlogPosts = await getCollection('interactiveBlog');
  
  // Combine and sort all posts by date
  const allPosts = [...blogPosts, ...interactiveBlogPosts].sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );

  return rss({
    // RSS feed metadata
    title: 'Shubham Rasal - Portfolio & Blog',
    description: 'Technical blog posts, devlogs, and insights on AI, programming, and technology',
    site: context.site,
    // stylesheet: '/rss-styles.xsl',
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || `A blog post by ${post.data.author}`,
      link: `/writing/${post.slug}/`,
      // Include full content for RSS readers
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title', 'width', 'height']
        }
      }),
      // Include author and tags
      author: post.data.author,
      categories: post.data.tags,
    })),
    // Custom data for the RSS feed
    customData: `<language>en-us</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<managingEditor>${allPosts[0]?.data.author || 'Shubham Rasal'}</managingEditor>
<webMaster>${allPosts[0]?.data.author || 'Shubham Rasal'}</webMaster>`,
  });
}
