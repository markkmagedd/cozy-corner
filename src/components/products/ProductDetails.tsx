'use client';

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/src/types/product";
import { ShoppingBag, ChevronLeft, Star, Share2, Heart, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <Link 
        href="/products" 
        className="inline-flex items-center gap-3 text-muted-foreground hover:text-black transition-all mb-16 group"
      >
        <div className="p-2.5 rounded-2xl bg-muted group-hover:bg-black group-hover:text-white transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </div>
        <span className="text-sm font-black uppercase tracking-widest italic leading-none">Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Gallery */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square w-full bg-muted rounded-[3.5rem] overflow-hidden border-4 border-muted/30 shadow-2xl"
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-1000 hover:scale-[1.05]"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            
            {/* Overlay Gradient for high-end look */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-[2rem] bg-muted overflow-hidden cursor-pointer hover:border-4 border-black transition-all"
              >
                 <Image src={product.imageUrl} alt={`${product.title} ${i}`} fill className="object-cover group-hover:scale-110 transition-transform" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-5 py-2 bg-black border-none text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl italic shadow-black/10">
                Premium Boutique
              </span>
              <div className="flex items-center gap-2 text-black">
                <Star className="w-4 h-4 fill-black" strokeWidth={0} />
                <span className="text-sm font-black italic tracking-tighter">4.9</span>
                <span className="text-xs text-muted-foreground font-bold tracking-widest ml-1">(124 REVIEWS)</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] uppercase max-w-xl text-black">
              {product.title}
            </h1>

            <div className="flex items-center gap-8 pt-4">
              <span className="text-5xl font-black text-black">
                {product.price} <span className="text-[14px] not-italic font-black text-muted-foreground uppercase tracking-widest ml-1">EGP</span>
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-muted-foreground line-through decoration-black/20 italic font-medium">
                  {product.originalPrice} EGP
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-xl max-w-lg font-medium">
            {product.description} Built for performance and styled for the modern athlete. Features breathable moisture-wicking technology.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between max-w-sm">
              <h3 className="text-sm font-black text-black uppercase tracking-widest italic">Select Size</h3>
              <button className="text-[10px] text-muted-foreground hover:text-black border-b-2 border-transparent hover:border-black transition-all font-black uppercase tracking-widest">Size Guide</button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-20 h-16 rounded-3xl border-2 transition-all flex items-center justify-center font-black text-sm uppercase italic",
                    selectedSize === size
                      ? "bg-black text-white border-black shadow-2xl scale-110"
                      : "bg-muted border-transparent text-muted-foreground hover:border-black hover:text-black"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 mt-6">
            <button className="flex-1 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-xl italic uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-black/20">
              <ShoppingBag className="w-6 h-6" />
              Add to Bag
            </button>
            <div className="flex gap-4">
              <button className="h-20 w-20 bg-muted rounded-[2rem] flex items-center justify-center text-black hover:bg-black hover:text-white active:scale-[0.95] transition-all shadow-sm group">
                <Heart className="w-7 h-7 group-hover:fill-white" />
              </button>
              <button className="h-20 w-20 bg-muted rounded-[2rem] flex items-center justify-center text-black hover:bg-black hover:text-white active:scale-[0.95] transition-all shadow-sm">
                <Share2 className="w-7 h-7" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-12 py-10 border-t-4 border-black">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-muted text-black shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-black uppercase tracking-widest leading-none">Free Shipping</p>
                <p className="text-[10px] text-muted-foreground font-bold leading-none">ORDERS OVER 1000 EGP</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-muted text-black shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-black uppercase tracking-widest leading-none">Warranty</p>
                <p className="text-[10px] text-muted-foreground font-bold leading-none">2 YEAR QUALITY GUARANTEE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
