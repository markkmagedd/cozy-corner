import React from "react";
import { Product } from "@/src/types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({ 
  products, 
  isLoading,
  onToggleFavorite,
  onAddToCart
}: { 
  products: Product[]; 
  isLoading?: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
}) {
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-3/4 bg-zinc-900 animate-pulse rounded-lg shadow-inner border border-zinc-800" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/20">
        <p className="text-lg font-medium opacity-50">No products found in this category.</p>
        <p className="text-sm mt-2 opacity-30">Try selecting a different category from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          {...product} 
          onToggleFavorite={onToggleFavorite} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
}
