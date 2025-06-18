import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { getUserServer } from '@/lib/utils/get-user-server';
import Link from 'next/link';
import { Header } from '@/components/header';

export const metadata = {
  title: 'CBTC Tennis Ladder',
  description: 'Coral Beach & Tennis Club ladder. ',
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
        <Toaster richColors position="bottom-center" />
        <Analytics />
      </body>
    </html>
  );
}

async function Footer() {
  const user = await getUserServer();
  if (user)
    return (
      <footer className="mt-auto border-t py-4 md:py-4">
        <div className="text-muted-foreground text-center text-sm">
          <Link href="/account">Account</Link>
        </div>
      </footer>
    );
  else
    return (
      <footer className="mt-auto border-t py-4 md:py-4">
        <div className="text-muted-foreground text-center text-sm">
          <Link href="/auth/login">Sign In</Link>
        </div>
      </footer>
    );
}
