import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stickmönster Plattform",
  description: "Skapa och översätt stickmönster till flera språk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
