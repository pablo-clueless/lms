import { Figtree, Hedvig_Letters_Serif } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

import { ErrorBoundary, QueryProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib";

const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"], variable: "--font-serif" });
const figtree = Figtree({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ArcLMS",
  description: "Next generation LMS for modern schools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body className={`${hedvig.variable} ${figtree.variable} antialiased`}>
        <ErrorBoundary>
          <QueryProvider>{children}</QueryProvider>
        </ErrorBoundary>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
