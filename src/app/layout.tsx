import './globals.css';
import Header from '@/components/header';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Hey Buoy',
  description: 'The home of Bermuda moorings.',
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
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
