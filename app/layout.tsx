import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "單字聽讀｜Dani's English",
  description: "依自己的節奏，聽英文單字、中文解釋與補充資訊。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Dani's English｜單字聽讀",
    description: "依自己的節奏，聽英文單字、中文解釋與補充資訊。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
