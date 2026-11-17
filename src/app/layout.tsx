import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Segmenta — Toko online dengan segmentasi pelanggan otomatis",
    template: "%s · Segmenta",
  },
  description:
    "Toko online dengan panel admin analitik: segmentasi pelanggan RFM otomatis, cohort retention, tren penjualan, dan produk best-seller.",
  applicationName: "Segmenta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
