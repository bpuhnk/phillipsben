import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHead from '@/components/section-head';
import Stats from '@/components/stats';
import Timeline from '@/components/timeline';
import Chip from '@/components/chip';
import { getSiteCopy, getSiteData } from '@/lib/site-content';
import { bioCareerSchema, bioSkillsSchema } from '@/lib/site-schemas';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Bio',
  description: 'Full-stack software engineer, almost twenty years in .NET. The long version of the résumé.',
  path: '/bio',
});

export default async function BioPage() {
  const [copy, careerRows, skills] = await Promise.all([
    getSiteCopy('bio'),
    getSiteData('bio-career', bioCareerSchema),
    getSiteData('bio-skills', bioSkillsSchema),
  ]);
  const fm = copy.frontmatter;

  return (
    <>
      <section className="section" style={{ paddingBottom: 64 }}>
        <div className="kicker" dangerouslySetInnerHTML={{ __html: fm.kicker }} />
        <h1
          className="display display-xl"
          style={{ marginTop: 24, marginBottom: 32, maxWidth: '14ch' }}
          dangerouslySetInnerHTML={{ __html: fm.headline }}
        />
        <div className="bio-hero">
          <div>
            <p
              className="lede"
              style={{ maxWidth: '44ch', marginBottom: 48 }}
              dangerouslySetInnerHTML={{ __html: fm.lede }}
            />
            <div className="meta" style={{ marginBottom: 12 }}>{fm.quickFactsLabel}</div>
            <ul className="bio-quick-facts">
              {fm.quickFacts.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
          <div className="bio-hero-img">
            <Image
              src={fm.heroImage.src}
              alt={fm.heroImage.alt}
              width={fm.heroImage.width}
              height={fm.heroImage.height}
              style={{ width: '100%', maxWidth: 440, maxHeight: 880, objectFit: 'contain', objectPosition: 'center top', display: 'block', height: 'auto' }}
              priority
            />
            <div className="meta" style={{ position: 'absolute', bottom: 4, right: 8, textTransform: 'uppercase' }}>
              {fm.heroImage.caption}
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 0 }}>
        <Stats
          items={fm.stats.map((s) => ({
            num: <span dangerouslySetInnerHTML={{ __html: s.num }} />,
            lbl: s.lbl,
          }))}
        />
      </section>

      <section className="section">
        <SectionHead title={fm.timelineTitle} idx={fm.timelineIdx} />
        <Timeline rows={careerRows} />
      </section>

      <section className="section muted">
        <SectionHead title={fm.skillsTitle} idx={fm.skillsIdx} />
        <div className="bio-skills-grid">
          {skills.map((s) => (
            <div key={s.t} className="bio-skill">
              <h4>{s.t}</h4>
              <p>{s.d}</p>
              <div className="bio-skill-tags">
                {s.tags.map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="bio-family-band">
          <div>
            <div className="kicker" dangerouslySetInnerHTML={{ __html: fm.familyKicker }} />
            <h2 className="bio-family-band-head" dangerouslySetInnerHTML={{ __html: fm.familyHead }} />
          </div>
          <p className="bio-family-band-copy" dangerouslySetInnerHTML={{ __html: fm.familyCopy }} />
        </div>
        <div className="bio-cta-row m-cta-stack">
          <a href="/resume.pdf" className="nav-cta" download>{fm.ctaDownloadLabel}</a>
          <Link href="/now" className="nav-cta ghost">{fm.ctaNowLabel}</Link>
        </div>
      </section>
    </>
  );
}
