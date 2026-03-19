'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../ui/ProductCard';
import { Product } from '@/src/types';
import { getProducts } from '@/src/lib/api';
import { Loader2 } from 'lucide-react';

export function InfiniteProductGrid() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '200px', // start loading before user hits bottom
  });

  const fetchProducts = useCallback(async (pageNum: number, category: string, reset: boolean = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await getProducts({
        categorySlug: category,
        page: pageNum,
        limit: 8,
      });

      if (reset) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
      
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading]);

  // Handle category changes
  useEffect(() => {
    fetchProducts(1, categorySlug, true);
  }, [categorySlug]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading && !initialLoading) {
      fetchProducts(page + 1, categorySlug);
    }
  }, [inView, hasMore, loading, initialLoading, page, categorySlug, fetchProducts]);

  if (initialLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-300" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[400px] w-full flex-col items-center justify-center space-y-4 px-4 text-center"
      >
        <p className="text-xl font-medium text-neutral-900">No products found</p>
        <p className="text-sm text-neutral-500">We couldn't find any products in this category at the moment.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {products.map((product, idx) => (
            <motion.div
              layout
              key={`${product.slug}-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              <ProductCard 
                product={product} 
                index={idx % 8}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trigger for infinite scroll */}
      <div ref={ref} className="mt-12 flex h-20 w-full items-center justify-center">
        {loading && hasMore && (
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        )}
      </div>
    </div>
  );
}
