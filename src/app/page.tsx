"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/ui/Footer";
import { HeroBanner } from "@/src/components/feature/HeroBanner";
import { CategoryGrid } from "@/src/components/feature/CategoryGrid";
import { DealsSection } from "@/src/components/feature/DealsSection";
import { mockCategories } from "@/src/data/mock/categories";
import { mockProducts } from "@/src/data/mock/products";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated delay for skeleton loader demonstration (Q2)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <HeroBanner 
        headline="Gear up for adventure"
        tagline="Premium collections for the bold explorer, curated for performance and style."
        ctaText="Shop the new collection"
        ctaLink="/new-arrivals"
      />

      <CategoryGrid categories={mockCategories} />
      
      <DealsSection 
        products={mockProducts} 
        isLoading={isLoading} 
      />

      <Footer />
    </main>
  );
}
