import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "CinéTix - Đặt Vé Xem Phim Online",
  description: "Trải nghiệm đặt vé xem phim trực tuyến hiện đại, nhanh chóng.",
};

import { AuthProvider } from '@/lib/auth/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} font-sans bg-background text-foreground antialiased selection:bg-primary selection:text-white`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
