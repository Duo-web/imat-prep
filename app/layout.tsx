import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IMAT Prep — Smarter, Cheaper IMAT Preparation",
  description:
    "Prepare for the IMAT exam with free past papers, practice questions, simulators, and performance analytics. 3.5x cheaper than the competition.",
  keywords: ["IMAT", "IMAT prep", "IMAT past papers", "study medicine Italy", "IMAT 2026"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
