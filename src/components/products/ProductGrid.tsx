'use client';

import { motion } from "framer-motion";
import { Product } from "@/src/types/product";
import { ProductCard } from "./ProductCard";
import { PackageOpen } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  emptyStateMessage?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export function ProductGrid({ products, emptyStateMessage = "No products found in this category" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-zinc-950 border border-zinc-900 rounded-3xl gap-6">
        <div className="p-4 rounded-3xl bg-zinc-900 text-zinc-700 shadow-inner">
          <PackageOpen className="w-12 h-12" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-zinc-300 italic tracking-tight">Nothing Found</h3>
          <p className="text-sm text-zinc-600 max-w-60 leading-relaxed italic">{emptyStateMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
