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
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://il-truth.vercel.app/api/og",
      button: {
        title: "Open IL Truth",
        action: {
          type: "launch_frame",
          name: "IL Truth",
          url: "https://il-truth.vercel.app",
          splashImageUrl: "https://il-truth.vercel.app/api/splash",
          splashBackgroundColor: "#030712",
        },
      },
    }),
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
