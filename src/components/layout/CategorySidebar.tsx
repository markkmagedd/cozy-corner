'use client';

import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category } from '@/src/types/product';
import { ChevronRight, Layers } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategoryId?: string;
  baseUrl: string;
}

export function CategorySidebar({ categories, activeCategoryId, baseUrl }: CategorySidebarProps) {
  const renderCategory = (category: Category, level: number = 0) => {
    const isActive = activeCategoryId === category.id;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <div key={category.id} className="w-full">
        <Link
          href={`${baseUrl}?category=${category.id}`}
          className={cn(
            "flex items-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 group",
            isActive 
              ? "bg-black text-white font-black italic shadow-xl shadow-black/10 scale-[1.02]" 
              : "text-muted-foreground hover:text-black hover:bg-muted font-bold"
          )}
          style={{ paddingLeft: `${(level * 16) + 16}px` }}
        >
          {level === 0 && <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "rotate-90" : "group-hover:translate-x-0.5")} />}
          <span className={cn("text-base truncate uppercase tracking-tight", isActive && "italic")}>{category.name}</span>
        </Link>
        
        {hasSubcategories && (
          <div className="mt-2 space-y-1">
            {category.subcategories!.map((sub: Category) => renderCategory(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-full lg:w-70 flex flex-col gap-8 p-6 bg-muted/40 border-2 border-muted rounded-[2.5rem] h-fit sticky top-24">
      <div className="flex items-center gap-4 px-2">
        <div className="p-3 rounded-2xl bg-black text-white shadow-xl">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-black italic tracking-tighter uppercase leading-none">
          Category <br /><span className="text-muted-foreground font-medium text-lg leading-none">Explorer</span>
        </h2>
      </div>

      <nav className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] custom-scrollbar scrollbar-none">
        {categories.map(cat => renderCategory(cat))}
      </nav>
      
      {/* Decorative element from reference rewritten for light theme */}
      <div className="mt-6 pt-8 border-t-2 border-muted/50">
        <div className="p-6 rounded-3xl bg-linear-to-br from-pastel-pink/20 via-white to-pastel-yellow/20 border-2 border-muted/40 shadow-inner">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 leading-none whitespace-nowrap">Exclusive Season</p>
          <p className="text-sm text-black font-black italic uppercase leading-tight">'24 Winter <br />Collections</p>
        </div>
      </div>
    </aside>
  );
}
