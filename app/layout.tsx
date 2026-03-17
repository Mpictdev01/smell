import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const bubblebaz = localFont({
  src: "../public/fonts/bubblebaz/bubblebaz.ttf",
  variable: "--font-bubblebaz",
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skull",
  description: "A collection of internet moments, relatable memes (me_irl), and curated funny posts from X, Instagram, and Reddit.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Skull",
    description: "A collection of internet moments, relatable memes (me_irl), and curated funny posts from X, Instagram, and Reddit.",
    images: [
      {
        url: "/Og.jpg",
        width: 1200,
        height: 630,
        alt: "Skull Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skull",
    description: "A collection of internet moments, relatable memes (me_irl), and curated funny posts from X, Instagram, and Reddit.",
    images: ["/Og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bubblebaz.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
