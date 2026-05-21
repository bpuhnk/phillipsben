import Image from 'next/image';
import Link from 'next/link';
import Chip from './chip';
import ImagePlaceholder from './image-placeholder';
import type { Project } from '@/lib/content';

type Variant = 'grid' | 'horizontal' | 'minimal';

export default function ProjectCard({ project, variant = 'grid' }: { project: Project; variant?: Variant }) {
  const { frontmatter } = project;
  const year = frontmatter.startDate.slice(0, 4);
  const status = frontmatter.status.toUpperCase();
  const accent = frontmatter.status === 'active';
  return (
    <Link href={`/projects/${frontmatter.slug}`} className={`proj-card ${variant === 'horizontal' ? 'horizontal' : variant === 'minimal' ? 'minimal' : ''}`}>
      <div className="img">
        {frontmatter.heroImage ? (
          <Image
            src={frontmatter.heroImage.src}
            alt={frontmatter.heroImage.alt}
            fill
            sizes="(max-width: 880px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ImagePlaceholder label={`${frontmatter.title} — hero shot`} />
        )}
      </div>
      <div className="body">
        <div className="row">
          <span>{year}</span>
          <span>·</span>
          <span style={{ color: accent ? 'var(--accent)' : 'var(--ink-3)' }}>
            {accent ? (
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: 'var(--accent)',
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
            ) : null}
            {status}
          </span>
          {frontmatter.role ? (
            <>
              <span>·</span>
              <span>{frontmatter.role.split('—')[0].trim().toUpperCase()}</span>
            </>
          ) : null}
        </div>
        <h3 className="title">{frontmatter.title}</h3>
        <p className="desc">{frontmatter.summary}</p>
        <div className="tags">
          {frontmatter.techStack.slice(0, 4).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>
    </Link>
  );
}
