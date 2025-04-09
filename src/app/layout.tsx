import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Bermuda Moorings",
  description: "The home of moorings in Bermuda. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col mx-auto max-w-screen-lg p-4">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t py-6 md:py-8">
          <div className="container text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bermuda Moorings. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
