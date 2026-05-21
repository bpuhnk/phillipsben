import Link from 'next/link';

export default function MFoot() {
  return (
    <footer className="m-foot no-print">
      <div className="nav-brand m-foot-brand">
        <span className="dot" />
        ben phillips
      </div>
      <div className="m-foot-cols">
        <div>
          <h5>Site</h5>
          <ul>
            <li><Link href="/bio">Bio</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/now">Now</Link></li>
            <li><Link href="/hobbies">Hobbies</Link></li>
            <li><Link href="/uses">Uses</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5>Elsewhere</h5>
          <ul>
            <li><a href="https://github.com/bPuhnk" target="_blank" rel="noreferrer">GitHub ↗</a></li>
            <li><a href="https://www.linkedin.com/in/ben-phillips-332a4826/" target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
          </ul>
        </div>
      </div>
      <a href="/resume.pdf" className="m-foot-cta" download>
        Download résumé (PDF)
      </a>
      <div className="m-foot-bottom">
        <span>© {new Date().getFullYear()} BEN PHILLIPS</span>
        <span>HUMAN + AGENTS · ANONYMOUS ANALYTICS</span>
      </div>
    </footer>
  );
}
