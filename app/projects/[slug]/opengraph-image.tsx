import { ImageResponse } from 'next/og';
import { getAllProjects, getProjectBySlug } from '@/lib/content';
import { loadInstrumentSerif } from '@/lib/og-font';

export const alt = 'Project — Ben Phillips';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.frontmatter.slug }));
}

export default async function ProjectOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const { regular, italic } = await loadInstrumentSerif();

  const title = project?.frontmatter.title ?? 'Project';
  const summary = project?.frontmatter.summary ?? '';
  const status = project?.frontmatter.status?.toUpperCase() ?? '';
  const year = project?.frontmatter.startDate.slice(0, 4) ?? '';
  const stack = project?.frontmatter.techStack.slice(0, 4).join(' · ') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FAF8F4',
          color: '#1A1816',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'Instrument Serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: 18,
            letterSpacing: '0.08em',
            color: '#8A8275',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: '#C2410C' }} />
            <span style={{ color: '#1A1816' }}>ben phillips</span>
            <span>/ projects</span>
          </div>
          <span>{[status, year].filter(Boolean).join(' · ')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {summary && (
            <div
              style={{
                fontStyle: 'italic',
                color: '#4A453E',
                fontSize: 32,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                maxWidth: 980,
                display: 'flex',
              }}
            >
              {summary}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: 16,
            letterSpacing: '0.06em',
            color: '#8A8275',
            textTransform: 'uppercase',
            borderTop: '1px solid #D9D3C5',
            paddingTop: 20,
          }}
        >
          <span>{stack}</span>
          <span>phillipsben.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: regular, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: italic, style: 'italic', weight: 400 },
      ],
    }
  );
}
