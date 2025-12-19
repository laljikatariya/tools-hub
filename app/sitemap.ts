import { MetadataRoute } from 'next';
import { toolsData } from '@/lib/tools-data';
import { getAllPosts } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://utilo.in';

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Add all tool pages
  toolsData.forEach((tool) => {
    routes.push({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });
  });

  // Add all blog posts
  try {
    const posts = await getAllPosts();
    posts.forEach((post) => {
      routes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    // Continue without blog posts if API fails
  }

  return routes;
}
