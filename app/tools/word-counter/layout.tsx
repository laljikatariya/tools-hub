import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Word Counter - Character, Sentence & Paragraph Counter | Utilo',
  description: 'Count words, characters, sentences, and paragraphs instantly. Free online word counter tool with detailed statistics including reading time, unique words, and keyword density analysis.',
  keywords: ['word counter', 'character counter', 'sentence counter', 'paragraph counter', 'reading time calculator', 'text statistics', 'word count tool'],
  openGraph: {
    title: 'Free Word Counter Tool - Utilo',
    description: 'Count words, characters, sentences, and paragraphs with detailed statistics.',
    type: 'website',
  },
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
