"use client";

import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { ProductCardProps } from "@/src/types/product";
import { cn } from "@/src/lib/utils";

export default function ProductCard({
  id,
  title,
  image,
  currentPrice,
  originalPrice,
  badges,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col group transition-transform hover:-translate-y-1 duration-300 shadow-lg">
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {badges?.map((badge) => (
            <span key={badge} className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              {badge}
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-300",
            isFavorite ? "bg-amber-400 text-black scale-110" : "bg-black/40 text-white hover:bg-black/60"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Add to Cart Overlay (Mobile/Desktop hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(id);
          }}
          className="lg:opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 p-2.5 bg-zinc-800 text-zinc-100 rounded-lg border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-all shadow-xl flex items-center gap-2"
          aria-label="Add to cart"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      <div className="p-4 flex flex-col grow bg-zinc-900/40 backdrop-blur-sm">
        <h3 className="text-sm text-zinc-300 mb-3 line-clamp-2 h-10 leading-tight group-hover:text-white transition-colors capitalize">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-lg text-amber-400">
            {currentPrice} <span className="text-[10px] font-normal uppercase opacity-70">egp</span>
          </span>
          {originalPrice && (
            <span className="text-zinc-500 line-through text-xs decoration-zinc-600 italic">
              {originalPrice} <span className="text-[10px] uppercase">egp</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
