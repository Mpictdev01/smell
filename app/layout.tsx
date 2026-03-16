import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
