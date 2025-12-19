'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WordPressPost, WordPressCategory, getFeaturedImageUrl, generateExcerpt } from '@/lib/wordpress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogContentProps {
  posts: WordPressPost[];
  categories: WordPressCategory[];
}

const FILTER_CATEGORIES = [
  { name: 'All', slug: 'all' },
  { name: 'Text Tools', slug: 'text-tools' },
  { name: 'Image Tools', slug: 'image-tools' },
  { name: 'PDF Tools', slug: 'pdf-tools' },
  { name: 'Color Tools', slug: 'color-tools' },
  { name: 'Developer Tools', slug: 'developer-tools' },
  { name: 'Product Updates', slug: 'product-updates' },
];

export default function BlogContent({ posts, categories }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Create a map of category id to category object
  const categoryMap = useMemo(() => {
    const map = new Map<number, WordPressCategory>();
    categories.forEach(cat => map.set(cat.id, cat));
    return map;
  }, [categories]);

  // Filter categories to only those in FILTER_CATEGORIES
  const availableCategories = useMemo(() => {
    return FILTER_CATEGORIES.filter(fc => {
      if (fc.slug === 'all') return true;
      return categories.some(cat => cat.slug === fc.slug);
    });
  }, [categories]);

  // Get category id for selected slug
  const selectedCategoryId = useMemo(() => {
    if (selectedCategory === 'all') return null;
    const cat = categories.find(c => c.slug === selectedCategory);
    return cat ? cat.id : null;
  }, [selectedCategory, categories]);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter(post => post.categories.includes(selectedCategoryId!));
  }, [posts, selectedCategory, selectedCategoryId]);

  // Function to get primary category name for a post
  const getPrimaryCategoryName = (post: WordPressPost): string => {
    if (post.categories.length === 0) return 'General';
    // Find the first category that is in our filter list
    for (const catId of post.categories) {
      const cat = categoryMap.get(catId);
      if (cat && FILTER_CATEGORIES.some(fc => fc.slug === cat.slug)) {
        return cat.name;
      }
    }
    // If none match, use the first category or General
    const firstCat = categoryMap.get(post.categories[0]);
    return firstCat ? firstCat.name : 'General';
  };

  // Local function to format post date
  const formatPostDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover helpful articles about online tools, productivity tips, and web development insights.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {availableCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.slug
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No blog posts available for this category. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const featuredImageUrl = getFeaturedImageUrl(post);
            const excerpt = generateExcerpt(post);
            const formattedDate = formatPostDate(post.date);
            const categoryName = getPrimaryCategoryName(post);

            return (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.slug}`} className="block">
                  {featuredImageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={featuredImageUrl}
                        alt={post.title.rendered}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {categoryName}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title.rendered}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {formattedDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                      {excerpt}
                    </p>
                    <div className="mt-4 text-blue-600 font-medium">
                      Read more →
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}