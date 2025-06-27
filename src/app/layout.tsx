import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CBTC Tennis Ladder',
  description: 'Coral Beach & Tennis Club ladder. ',
  openGraph: {
    title: 'CBTC Tennis Ladder',
    description: 'Coral Beach & Tennis Club ladder. ',
    url: 'https://tennis.beam.com',
    siteName: 'CBTC Tennis Ladder',
    locale: 'en_US',
    type: 'website',
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
          <div className="flex h-full w-full flex-1 flex-col items-center px-4 py-12">{children}</div>
        </main>
        <Toaster richColors position="bottom-center" />
        <Analytics />
      </body>
    </html>
  );
}
