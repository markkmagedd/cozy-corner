'use client';

import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronRight, Layers } from 'lucide-react';
import { Database } from '@/src/types/database';

type Category = Database['public']['Tables']['categories']['Row'] & {
  subcategories?: Category[];
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategoryId?: string; // This is the Slug passed from the page
  baseUrl: string;
}

export function CategorySidebar({ categories, activeCategoryId, baseUrl }: CategorySidebarProps) {
  // 1. Build a Tree from the flat list of categories
  const categoryTree = categories
    .filter(c => !c.parent_id)
    .map(parent => ({
      ...parent,
      subcategories: categories.filter(child => child.parent_id === parent.id)
    }));

  const renderCategory = (category: Category, level: number = 0) => {
    // Match by slug for the active state in URL
    const isActive = activeCategoryId === category.slug;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <div key={category.id} className="w-full">
        <Link
          href={`${baseUrl}?category=${category.slug}`}
          className={cn(
            "flex items-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 group",
            isActive 
              ? "bg-black text-white font-black italic shadow-xl shadow-black/10 scale-[1.02] translate-x-1" 
              : "text-muted-foreground hover:text-black hover:bg-muted font-bold"
          )}
          style={{ paddingLeft: `${(level * 16) + 16}px` }}
        >
          {level === 0 && <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "rotate-90" : "group-hover:translate-x-0.5")} />}
          <span className={cn("text-base truncate uppercase tracking-tight leading-none", isActive && "italic")}>{category.name}</span>
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
    <aside className="w-full lg:w-70 flex flex-col gap-8 p-6 bg-muted/40 border-2 border-muted rounded-[2.5rem] h-fit sticky top-24 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all">
      <div className="flex items-center gap-4 px-2">
        <div className="p-3 rounded-2xl bg-black text-white shadow-xl shadow-black/10">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-black italic tracking-tighter uppercase leading-none">
          Universe <br /><span className="text-muted-foreground font-medium text-lg leading-none">Explorer</span>
        </h2>
      </div>

      <nav className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] scrollbar-none">
        {categoryTree.map(cat => renderCategory(cat as any))}
      </nav>
      
      <div className="mt-6 pt-8 border-t-2 border-muted/50">
        <div className="p-6 rounded-3xl bg-linear-to-br from-pastel-pink/20 via-white to-pastel-yellow/20 border-2 border-muted/40 shadow-inner group cursor-pointer hover:border-black/10 transition-colors">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 leading-none">Spring '26</p>
          <p className="text-sm text-black font-black italic uppercase leading-tight group-hover:translate-x-1 transition-transform">Season <br />Premiere</p>
        </div>
      </div>
    </aside>
  );
}
