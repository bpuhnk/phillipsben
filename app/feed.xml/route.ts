import { getAllProjects } from '@/lib/content';

const SITE_URL = process.env.SITE_URL || 'https://phillipsben.com';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const dynamic = 'force-static';

export async function GET() {
  const projects = await getAllProjects();
  const updated = projects[0]?.frontmatter.startDate
    ? new Date(projects[0].frontmatter.startDate).toUTCString()
    : new Date().toUTCString();

  const items = projects
    .map((p) => {
      const fm = p.frontmatter;
      const url = `${SITE_URL}/projects/${fm.slug}`;
      const pubDate = new Date(fm.startDate).toUTCString();
      return `    <item>
      <title>${escapeXml(fm.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(fm.summary)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben Phillips — Projects</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Software for things that actually have to work.</description>
    <language>en</language>
    <lastBuildDate>${updated}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
