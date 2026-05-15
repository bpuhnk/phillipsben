import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Résumé',
  robots: { index: false, follow: false },
};

// Stripped layout — no global nav or footer, intended for Playwright PDF capture.
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
