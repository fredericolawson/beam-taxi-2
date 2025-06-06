import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/header';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Hey Buoy',
  description: 'The home of Bermuda moorings.',
  openGraph: {
    images: [
      {
        url: '/heybuoy.png', // Absolute or relative URL
        width: 900,
        height: 900,
        alt: 'Hey Buoy OG Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: '/heybuoy.png',
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
        <main className="container mx-auto flex max-w-6xl flex-grow flex-col p-4">{children}</main>
        <footer className="mt-auto border-t py-6 md:py-8">
          <div className="text-muted-foreground text-center text-sm">
            © {new Date().getFullYear()} Beam Bermuda Ltd. All rights reserved.
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
