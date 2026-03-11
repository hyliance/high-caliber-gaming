import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "High Caliber Gaming",
    template: "%s | High Caliber Gaming",
  },
  description:
    "The premier competitive esports platform. Compete in ladders, tournaments, and leagues. Build your clan. Book a coach. Rise through the ranks.",
  keywords: ["esports", "gaming", "competitive", "tournaments", "ladders", "coaching"],
  openGraph: {
    type: "website",
    siteName: "High Caliber Gaming",
    title: "High Caliber Gaming — Compete. Rise. Dominate.",
    description: "The premier competitive esports ecosystem.",
  },
  twitter: {
    card: "summary_large_image",
    title: "High Caliber Gaming",
    description: "The premier competitive esports ecosystem.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-hcg-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
