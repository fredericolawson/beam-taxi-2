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
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-muted/50">
        <Header />
        <main className="container mx-auto flex flex-col flex-grow max-w-5xl ">
          {children}
        </main>
        <footer className="border-t py-6 md:py-8 mt-auto">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bermuda Moorings. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
