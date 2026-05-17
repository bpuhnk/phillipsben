import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import Nav from '@/components/nav';
import MNav from '@/components/m-nav';
import Footer from '@/components/footer';
import MFoot from '@/components/m-foot';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const siteUrl = process.env.SITE_URL || 'https://phillipsben.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ben Phillips — Engineer',
    template: '%s · Ben Phillips',
  },
  description:
    'Full-stack software engineer, twenty years deep in .NET. Building desktop apps, services, and agentic systems for the factory floor.',
  openGraph: {
    title: 'Ben Phillips — Engineer',
    description: 'Software for things that actually have to work.',
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Phillips — Engineer',
    description: 'Software for things that actually have to work.',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF8F4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <MNav />
        <main id="main">{children}</main>
        <Footer />
        <MFoot />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
