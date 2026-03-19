"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { Category, CategorySidebarProps } from "@/src/types/product";
import { cn } from "@/src/lib/utils";

const CategoryItem = ({ 
  category, 
  activeCategoryId, 
  onSelectCategory,
  depth = 0 
}: { 
  category: Category; 
  activeCategoryId?: string; 
  onSelectCategory: (id: string) => void;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = activeCategoryId === category.id;
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <div className="mb-1">
      <button
        onClick={() => {
          onSelectCategory(category.id);
          if (hasSubcategories) setIsOpen(!isOpen);
        }}
        className={cn(
          "w-full flex items-center justify-between py-2 px-3 rounded-md transition-colors text-sm",
          isSelected ? "bg-zinc-800 text-amber-400 font-medium" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
          depth > 0 && "pl-8"
        )}
      >
        <span className="flex items-center gap-2">
          {category.name}
        </span>
        {hasSubcategories && (
          isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
      </button>
      
      {hasSubcategories && isOpen && (
        <div className="mt-1">
          {category.subcategories?.map((sub) => (
            <CategoryItem 
              key={sub.id} 
              category={sub} 
              activeCategoryId={activeCategoryId} 
              onSelectCategory={onSelectCategory}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategorySidebar({ 
  categories, 
  activeCategoryId, 
  onSelectCategory 
}: CategorySidebarProps) {
  return (
    <nav className="flex flex-col gap-4">
      <button
        onClick={() => onSelectCategory("1")}
        className={cn(
          "w-full flex items-center gap-3 py-2 px-3 rounded-md transition-colors text-sm",
          activeCategoryId === "1" ? "bg-zinc-800 text-amber-400 font-medium" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
        )}
      >
        <LayoutGrid size={18} />
        All Categories
      </button>

      <div className="flex flex-col">
        {categories.map((category) => (
          <CategoryItem 
            key={category.id} 
            category={category} 
            activeCategoryId={activeCategoryId} 
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    </nav>
  );
}
