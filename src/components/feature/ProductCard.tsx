"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ImageOff, Loader2, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Product } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Skeleton } from "../ui/Skeleton";

interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}

export function ProductCard({ product, isLoading = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-square rounded-3xl" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group flex flex-col gap-5 overflow-hidden rounded-3xl p-2 transition-all hover:bg-muted/50"
    >
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-muted shadow-sm">
        {/* Discount Badge */}
        {product.discountBadge && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase italic tracking-widest text-white shadow-xl">
            {product.discountBadge}
          </div>
        )}

        {/* Favorite/Quick Add? - Just Quick Add for MVP */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
        >
          <Plus className="h-6 w-6" />
        </motion.button>

        {/* Media Fallback or Image */}
        {imgError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-muted/60 text-muted-foreground/30">
            <ImageOff className="h-16 w-16" strokeWidth={1} />
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">{product.name.substring(0, 10)}...</p>
          </div>
        ) : (
          <>
            {!imgLoaded && <Skeleton className="absolute inset-0 z-0 h-full w-full" />}
            {/* Using mock URL, onError handler will trigger fallback */}
            <div className={cn("relative h-full w-full flex items-center justify-center bg-white transition-opacity duration-300", !imgLoaded && "opacity-0")}>
               {/* Since images don't exist yet, we'll intentionally showcase the SVG fallback if needed or a styled placeholder */}
               <div className="h-2/3 w-2/3 rounded-full bg-muted/30 blur-3xl" />
               <ShoppingBag className="absolute h-10 w-10 text-muted-foreground/20" />
               <Image
                 src={product.imageUrl}
                 alt={product.name}
                 fill
                 className="object-cover transition-transform duration-500 group-hover:scale-110"
                 onLoad={() => setImgLoaded(true)}
                 onError={() => setImgError(true)}
               />
            </div>
          </>
        )}
      </div>

      <div className="px-2 pb-2 space-y-2">
        {/* Truncated Name - Q1 Resolved */}
        <h3 className="truncate text-lg font-bold uppercase italic tracking-tight text-black group-hover:text-muted-foreground transition-colors overflow-hidden whitespace-nowrap">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-black">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm font-medium text-muted-foreground line-through decoration-black/20">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
