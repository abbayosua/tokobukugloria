import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toko Buku Gloria - Toko Buku Kristen Terlengkap",
  description: "Toko Buku Gloria menyediakan berbagai buku Kristen berkualitas termasuk Alkitab, buku Katolik, renungan harian, teologi, dan perlengkapan ibadah. Melayani dengan kasih untuk kebutuhan rohani Anda.",
  keywords: ["toko buku kristen", "alkitab", "buku katolik", "renungan", "teologi", "buku rohani", "toko buku online"],
  authors: [{ name: "Toko Buku Gloria" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Toko Buku Gloria - Toko Buku Kristen Terlengkap",
    description: "Toko buku Kristen terlengkap dengan koleksi Alkitab, buku Katolik, renungan harian, teologi, dan perlengkapan ibadah.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toko Buku Gloria - Toko Buku Kristen Terlengkap",
    description: "Toko buku Kristen terlengkap dengan koleksi Alkitab, buku Katolik, renungan harian.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
