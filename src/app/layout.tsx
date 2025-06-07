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
        <footer className="mt-auto border-t py-2 md:py-4">
          <div className="text-muted-foreground text-center text-xs">
            © {new Date().getFullYear()} Beam Bermuda Ltd. All rights reserved.
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
