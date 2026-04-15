import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hotelindo — Directory Hotel Terbaik di Indonesia",
    template: "%s | Hotelindo",
  },
  description:
    "Temukan dan bandingkan hotel terbaik di seluruh Indonesia. Jelajahi hotel berdasarkan kota, kategori, dan landmark. Booking via Traveloka, tiket.com, dan Agoda.",
  keywords: [
    "hotel indonesia",
    "directory hotel",
    "hotel murah",
    "hotel bali",
    "hotel jakarta",
    "hotel yogyakarta",
    "hotel bandung",
    "hotel keluarga",
    "hotel bisnis",
    "staycation indonesia",
  ],
  authors: [{ name: "Hotelindo" }],
  creator: "Hotelindo",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Hotelindo",
    title: "Hotelindo — Directory Hotel Terbaik di Indonesia",
    description:
      "Temukan dan bandingkan hotel terbaik di seluruh Indonesia. Booking via Traveloka, tiket.com, dan Agoda.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
