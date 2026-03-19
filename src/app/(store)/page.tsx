import { getProducts } from "@/src/lib/actions/product-actions";
import { getCategories } from "@/src/lib/actions/category-actions";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/ui/Footer";
import { HeroBanner } from "@/src/components/feature/HeroBanner";
import { CategoryGrid } from "@/src/components/feature/CategoryGrid";
import { DealsSection } from "@/src/components/feature/DealsSection";

export default async function Home() {
  // Fetch live sync data
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <main className="min-h-screen selection:bg-black/10">
      <Navbar />
      
      <HeroBanner 
        headline="Gear up for adventure"
        tagline="Premium collections for the bold explorer, curated for performance and style."
        ctaText="Explore the Universe"
        ctaLink="/products"
      />

      {categories.length > 0 && (
        <CategoryGrid categories={categories as any} />
      )}
      
      <DealsSection 
        products={products as any} 
        isLoading={false} 
      />

      <Footer />
    </main>
  );
}
