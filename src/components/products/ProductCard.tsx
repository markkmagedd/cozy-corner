'use client';

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/src/types/product";
import { ShoppingBag, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white flex flex-col gap-5 overflow-hidden rounded-3xl p-2 transition-all hover:bg-muted/50 h-full border-2 border-transparent hover:border-black/5"
    >
      {/* Link Overlay */}
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-20" aria-label={`View ${product.title} details`} />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-muted shadow-sm shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Floating Labels */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-30">
            <span className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase italic tracking-widest rounded-full shadow-2xl">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black opacity-0 shadow-xl transition-opacity group-hover:opacity-100 border border-muted"
        >
          <Plus className="h-6 w-6" />
        </motion.button>

        <div className="absolute inset-0 bg-linear-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      </div>

      {/* Content */}
      <div className="px-3 pb-4 flex flex-col gap-3 justify-between flex-1">
        <div className="space-y-1">
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-black group-hover:text-muted-foreground transition-all leading-tight">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-black">
              {product.price} <span className="text-xs not-italic font-bold text-muted-foreground uppercase opacity-50 tracking-widest">EGP</span>
            </span>
            {product.originalPrice && (
              <span className="text-sm font-medium text-muted-foreground line-through decoration-black/20 italic">
                {product.originalPrice} EGP
              </span>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-muted text-black group-hover:bg-black group-hover:text-white transition-all shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
