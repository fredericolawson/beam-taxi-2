import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Hey Buoy",
  description: "The home of moorings in Bermuda. ",
  openGraph: {
    images: [
      {
        url: "/heybuoy.png", // Absolute or relative URL
        width: 900,
        height: 900,
        alt: "Hey Buoy OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: "/heybuoy.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-muted/50">
        <Header />
        <main className="container mx-auto flex flex-col flex-grow max-w-5xl p-4 ">
          {children}
        </main>
        <footer className="border-t py-6 md:py-8 mt-auto">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Beam Bermuda Ltd. All rights reserved.
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
