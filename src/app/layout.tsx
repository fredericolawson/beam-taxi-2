import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/header';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tennis.beam.bm'),
  title: 'CBTC Ladder | Coral Beach & Tennis Club',
  description: 'Tennis ladder for the Coral Beach & Tennis Club',
  keywords: ['tennis', 'ladder', 'coral beach', 'tennis club', 'bermuda', 'rankings', 'matches', 'competition'],
  authors: [{ name: 'Coral Beach & Tennis Club' }],
  robots: 'index, follow',
  openGraph: {
    title: 'CBTC Ladder | Coral Beach & Tennis Club',
    description: 'Tennis ladder for the Coral Beach & Tennis Club',
    url: 'https://tennis.beam.bm',
    siteName: 'CBTC Tennis Ladder',
    locale: 'en_BM',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'CBTC Tennis Ladder - Coral Beach & Tennis Club',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CBTC Ladder | Coral Beach & Tennis Club',
    description: 'Tennis ladder for the Coral Beach & Tennis Club',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-muted/50 flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center">
          <div className="flex h-full w-full flex-1 flex-col items-center px-4 py-12 text-sm md:text-sm">{children}</div>
        </main>
        <Toaster richColors position="bottom-center" />
        <Analytics />
      </body>
    </html>
  );
}
