'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Category } from '@/src/types';
import { CATEGORIES } from '@/src/data/mock-categories';
import { cn } from '@/src/lib/utils';

export function CategoryNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Center active tab on mobile scroll
  useEffect(() => {
    const activeTab = scrollRef.current?.querySelector(`[data-slug="${activeCategory}"]`);
    if (activeTab && scrollRef.current) {
      const scrollLeft = (activeTab as HTMLElement).offsetLeft - (scrollRef.current.offsetWidth / 2) + ((activeTab as HTMLElement).offsetWidth / 2);
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-0 z-40 -mx-4 bg-white/80 px-4 py-3 backdrop-blur-md sm:mx-0 sm:px-0">
      <div 
        ref={scrollRef}
        className="no-scrollbar flex space-x-2 overflow-x-auto pb-1 scroll-smooth"
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.slug;
          
          return (
            <button
              key={category.id}
              data-slug={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className={cn(
                "relative flex-shrink-0 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none",
                isActive 
                  ? "bg-neutral-900 text-white shadow-sm" 
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              )}
            >
              <span className="relative z-10">{category.name}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-neutral-900"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
