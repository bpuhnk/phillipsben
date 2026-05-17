import type { Metadata } from 'next';

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const fullTitle = path === '/' ? 'Ben Phillips — Engineer' : `${title} · Ben Phillips`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}
