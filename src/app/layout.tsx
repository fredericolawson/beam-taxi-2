import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/header';
import { Metadata, Viewport } from 'next';
import { Footer } from '@/components/footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://taxi.beam.bm'),
  title: 'Beam Taxi',
  description: 'Beam Taxi',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '192x192', type: 'image/x-icon' }],
  },
  keywords: ['beam', 'taxi', 'bermuda'],
  authors: [{ name: 'Beam Taxi' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Beam Taxi',
    description: 'Beam Taxi',
    url: 'https://taxi.beam.bm',
    siteName: 'Beam Taxi',
    locale: 'en_BM',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Beam Taxi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beam Taxi',
    description: 'Beam Taxi',
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
      <body className="bg-muted/50 flex min-h-screen flex-col items-center">
        <Header />
        <main className="flex w-full max-w-6xl flex-1 flex-col items-center justify-center">{children}</main>
        <Footer />
        <Toaster richColors position="bottom-center" />
        <Analytics />
      </body>
    </html>
  );
}
