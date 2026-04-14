import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://diff-viewer.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'Text Diff Viewer — Compare Text Online Free',
    template: '%s | Text Diff Viewer',
  },
  description:
    'Free online text diff tool. Paste two texts and instantly see what changed — line, word, or character level. Unified and side-by-side views. No signup, no server, 100% client-side.',
  keywords: [
    'text diff',
    'diff viewer',
    'compare text online',
    'text comparison tool',
    'unified diff',
    'side by side diff',
    'text differencer',
    'diff checker',
    'code diff',
    'online diff tool',
  ],
  authors: [{ name: 'Breno Alvim', url: 'https://github.com/obrenoalvim' }],
  creator: 'Breno Alvim',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Text Diff Viewer — Compare Text Online Free',
    description:
      'Paste two texts and instantly see what changed. Free, fast, no signup required. Supports unified and side-by-side views.',
    url: siteUrl,
    siteName: 'Text Diff Viewer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Diff Viewer — Compare Text Online Free',
    description:
      'Free online diff tool — compare any two texts instantly. Unified and side-by-side views, line/word/character granularity.',
    creator: '@obrenoalvim',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  manifest: '/manifest.json',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text Diff Viewer',
  url: siteUrl,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires a modern browser with JavaScript enabled',
  description:
    'Free online text diff tool. Compare two texts in real-time with unified and side-by-side views. Supports line, word, and character-level diffing. No signup required.',
  featureList: [
    'Real-time diff calculation',
    'Unified and side-by-side views',
    'Line, word, and character granularity',
    'Ignore case and whitespace options',
    'Export as text or HTML',
    'PWA offline support',
    'English and Portuguese (Brazil) support',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Breno Alvim',
    url: 'https://github.com/obrenoalvim',
  },
  inLanguage: ['en', 'pt-BR'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#030712" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <I18nProvider>{children}</I18nProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
