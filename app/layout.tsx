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
  title: "IL Truth",
  description: "DeFi LP impermanent loss calculator for Farcaster",
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://il-truth.vercel.app/api/og",
    "fc:frame:button:1": "Open IL Truth",
    "fc:frame:post_url": "https://il-truth.vercel.app/api/frame",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
