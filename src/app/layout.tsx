import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hotel Shop | Premium Clothing & Equipment",
  description: "Explore our curated collection of high-quality clothing and premium equipment for your next adventure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
