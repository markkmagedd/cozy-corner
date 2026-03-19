"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Search, SlidersHorizontal, Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import CategorySidebar from "@/src/components/navigation/CategorySidebar";
import MobileDrawer, { DrawerOverlay } from "@/src/components/navigation/MobileDrawer";
import ProductGrid from "@/src/components/products/ProductGrid";
import TopActionBar from "@/src/components/products/TopActionBar";
import LoadMoreButton from "@/src/components/products/LoadMoreButton";
import { MOCK_CATEGORIES } from "@/src/lib/data-mock";
import { fetchProductsByCategory } from "@/src/lib/actions/product-actions";
import { Category, Product } from "@/src/types/product";

export default function ProductsPageClient() {
  const [activeCategoryId, setActiveCategoryId] = useState("1");
  const [products, setProducts] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("Newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeCategory = MOCK_CATEGORIES.find(c => c.id === activeCategoryId) || { name: 'All Products' };

  // Load initial products or when params change
  useEffect(() => {
    handleRefreshProducts();
  }, [activeCategoryId, sort, searchTerm]);

  const handleRefreshProducts = () => {
    setHasMore(true);
    startTransition(async () => {
      const result = await fetchProductsByCategory(activeCategoryId, 0, 6, sort, searchTerm);
      setProducts(result);
    });
  };

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    setSearchTerm(""); // Reset search on category change
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextBatch = await fetchProductsByCategory(activeCategoryId, products.length, 6, sort, searchTerm);
      if (nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setProducts([...products, ...nextBatch]);
      }
    });
  };

  const handleToggleFavorite = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const handleAddToCart = (id: string) => {
    console.log(`Added product ${id} to cart`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (option: string) => {
    setSort(option);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <DrawerOverlay onClick={() => setIsDrawerOpen(false)} />
            <MobileDrawer
              categories={MOCK_CATEGORIES}
              activeCategoryId={activeCategoryId}
              onSelectCategory={handleSelectCategory}
              onCloseDrawer={() => setIsDrawerOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex flex-col lg:row gap-8">
        <div className="flex gap-8">
          {/* Left Sidebar (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 h-full sticky top-8">
            <div className="bg-zinc-900/40 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm">
              <h2 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-6 opacity-60">Categories</h2>
              <CategorySidebar
                categories={MOCK_CATEGORIES}
                activeCategoryId={activeCategoryId}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          </aside>

          {/* Right Content */}
          <section className="flex-1">
            <TopActionBar 
              activeCategoryName={activeCategory.name}
              onSearch={handleSearch}
              onSort={handleSort}
              onMenuToggle={() => setIsDrawerOpen(true)}
            />

            <ProductGrid 
              products={products} 
              isLoading={isPending} 
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
            />

            <LoadMoreButton 
              onClick={handleLoadMore} 
              isLoading={isPending && products.length > 0} 
              hasMore={hasMore && products.length > 0} 
            />
          </section>
        </div>
      </div>
    </main>
  );
}
