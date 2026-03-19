'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-300 hover:shadow-md"
    >
      <Link href={`/product/${product.slug}`} className="flex-1">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>

        <div className="flex flex-col p-4">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            {product.category.replace('-', ' ')}
          </span>
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 group-hover:text-neutral-600">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            {/* We could add price here or other metadata, but spec says items browse only */}
            <span className="text-[12px] font-semibold text-accent-foreground opacity-70">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
