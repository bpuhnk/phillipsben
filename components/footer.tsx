import Link from 'next/link';
import { getSiteData } from '@/lib/site-content';
import { footerSchema } from '@/lib/site-schemas';

export default async function Footer() {
  const data = await getSiteData('footer', footerSchema);
  const year = new Date().getFullYear();
  const copyright = data.copyright.replace('{year}', String(year));

  return (
    <footer className="foot no-print">
      <div>
        <div className="nav-brand" style={{ marginBottom: 14 }}>
          <span className="dot" />
          <span style={{ fontSize: 18 }}>{data.brand}</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: '24ch' }}>
          {data.tagline}
        </p>
      </div>
      {data.sections.map((section) => (
        <div key={section.heading}>
          <h5>{section.heading}</h5>
          <ul>
            {section.links.map((link) => {
              if (link.external) {
                return (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                  </li>
                );
              }
              if (link.download || link.href.startsWith('mailto:') || link.href.endsWith('.pdf')) {
                return (
                  <li key={link.href}>
                    <a href={link.href} {...(link.download ? { download: true } : {})}>{link.label}</a>
                  </li>
                );
              }
              return (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="foot-bottom">
        <span>{copyright}</span>
        <span>{data.colophon}</span>
      </div>
    </footer>
  );
}
