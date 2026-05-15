import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="foot no-print">
      <div>
        <div className="nav-brand" style={{ marginBottom: 14 }}>
          <span className="dot" />
          <span style={{ fontSize: 18 }}>ben phillips</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: '24ch' }}>
          Engineer, tinkerer, husband, dad. Building from a small town in the Southeast.
        </p>
      </div>
      <div>
        <h5>Sections</h5>
        <ul>
          <li><Link href="/bio">Bio</Link></li>
          <li><Link href="/projects">Projects</Link></li>
          <li><Link href="/now">Now</Link></li>
          <li><Link href="/hobbies">Hobbies</Link></li>
          <li><Link href="/uses">Uses</Link></li>
        </ul>
      </div>
      <div>
        <h5>Around the web</h5>
        <ul>
          <li><a href="https://github.com/bPuhnk" target="_blank" rel="noreferrer">GitHub ↗</a></li>
          <li><a href="https://www.linkedin.com/in/ben-phillips-332a4826/" target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
        </ul>
      </div>
      <div>
        <h5>Working</h5>
        <ul>
          <li><a href="mailto:contact@phillipsben.com">contact@phillipsben.com</a></li>
          <li><a href="/resume.pdf" download>Download résumé (PDF)</a></li>
          <li><Link href="/contact">Book a 30-min chat</Link></li>
        </ul>
      </div>
      <div className="foot-bottom">
        <span>© {new Date().getFullYear()} Ben Phillips · phillipsben.com</span>
        <span>Colophon · Hand-built, no tracking</span>
      </div>
    </footer>
  );
}
