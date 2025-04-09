import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
