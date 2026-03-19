import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/src/components/ui/Header";
import { cn } from "@/src/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Hotel Shop | Premium Resort Gear",
  description: "Boutique essentials from our island paradise collective.",
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
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-white font-sans text-neutral-900 antialiased"
        )}
      >
        <Header />
        {children}
        <footer className="mt-20 border-t border-neutral-100 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between space-y-6 sm:flex-row sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-xs font-black text-white italic">H</div>
                <span className="text-sm font-bold uppercase tracking-widest text-neutral-900">Hotel Shop</span>
              </div>
              <p className="text-xs text-neutral-400">
                &copy; {new Date().getFullYear()} The Hotel Shop. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {['Sustainability', 'Legacy', 'Connect'].map((link) => (
                  <span key={link} className="cursor-pointer text-xs font-medium text-neutral-500 hover:text-neutral-900">
                    {link}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
