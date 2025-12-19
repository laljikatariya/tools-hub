import { cache } from 'react';

const WORDPRESS_API_BASE =
  'https://public-api.wordpress.com/wp/v2/sites/utiloblog.wordpress.com';

export interface WordPressPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
  categories: number[];
  _embedded?: {
    media?: Array<{
      media_details?: {
        sizes?: {
          full?: {
            source_url?: string;
          };
        };
      };
      source_url?: string;
    }>;
  };
}

export const getAllPosts = cache(async (): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(
      `${WORDPRESS_API_BASE}/posts?_embed&per_page=100&status=publish`,
      {
        cache: 'force-cache',
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts from WordPress:', error);
    return [];
  }
});

export const getPostBySlug = cache(
  async (slug: string): Promise<WordPressPost | null> => {
    try {
      const response = await fetch(
        `${WORDPRESS_API_BASE}/posts?slug=${encodeURIComponent(
          slug
        )}&_embed&status=publish`,
        {
          cache: 'force-cache',
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const posts: WordPressPost[] = await response.json();
      return posts.length ? posts[0] : null;
    } catch (error) {
      console.error(`Error fetching post "${slug}":`, error);
      return null;
    }
  }
);

export const getFeaturedImageUrl = (post: WordPressPost): string | null => {
  const media = post._embedded?.media?.[0];
  return (
    media?.media_details?.sizes?.full?.source_url ||
    media?.source_url ||
    null
  );
};

export const generateExcerpt = (
  post: WordPressPost,
  maxLength = 160
): string => {
  const text = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
  return text.length <= maxLength
    ? text
    : text.slice(0, maxLength).trim() + '…';
};

export const formatPostDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

export const getAllCategories = cache(async (): Promise<WordPressCategory[]> => {
  try {
    const response = await fetch(
      `${WORDPRESS_API_BASE}/categories?per_page=100`,
      {
        cache: 'force-cache',
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories from WordPress:', error);
    return [];
  }
});
