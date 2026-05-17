import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectFilters from '@/components/project-filters';
import { getAllProjects } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Projects',
  description: 'Active and shipped work — professional and personal — with write-ups, constraints, and what broke.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <section className="section" style={{ paddingBottom: 48 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; PROJECTS</div>
        <div className="projects-header">
          <h1 className="display display-xl">
            The work — <i>professional,<br />personal,</i> and the odd thing<br />in between.
          </h1>
          <p className="lede" style={{ maxWidth: '42ch' }}>
            Every project has a write-up: the constraint, the approach, the parts that broke,
            and what I'd do differently next time.
          </p>
        </div>
      </section>

      <Suspense fallback={<section className="section">Loading…</section>}>
        <ProjectFilters projects={projects} />
      </Suspense>
    </>
  );
}
