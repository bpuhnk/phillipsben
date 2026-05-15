import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectFilters from '@/components/project-filters';
import { getAllProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Active and shipped work — professional and personal — with write-ups, constraints, and what broke.',
  alternates: { canonical: '/projects' },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <section className="section" style={{ paddingBottom: 48 }}>
        <div className="kicker">§ 01 &nbsp;·&nbsp; PROJECTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64, marginTop: 24, alignItems: 'end' }}>
          <h1 className="display" style={{ fontSize: 104 }}>
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
