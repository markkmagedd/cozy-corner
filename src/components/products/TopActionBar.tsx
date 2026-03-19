"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, Menu, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function TopActionBar({
  activeCategoryName,
  onSearch,
  onSort,
  onMenuToggle
}: {
  activeCategoryName: string;
  onSearch: (term: string) => void;
  onSort: (option: string) => void;
  onMenuToggle: () => void;
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Newest");

  const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 bg-zinc-900 rounded-md text-zinc-400 hover:text-white transition-colors border border-zinc-800"
          aria-label="Open categories menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">
          {activeCategoryName} <span className="text-amber-400">Section</span>
        </h1>
      </div>
      
      <div className="flex gap-2">
        {/* Sort Dropdown */}
        <div className="relative flex-1 md:flex-none">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <SlidersHorizontal size={14} className="text-amber-400" />
            <span>Sort: {selectedSort}</span>
            <ChevronDown size={14} className={cn("transition-transform", isSortOpen && "rotate-180")} />
          </button>
          
          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-30 py-1 overflow-hidden backdrop-blur-xl">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedSort(option);
                    onSort(option);
                    setIsSortOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-zinc-800",
                    selectedSort === option ? "text-amber-400 bg-zinc-800/50" : "text-zinc-400"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Find Product Search trigger */}
        <button 
          onClick={() => onSearch("")} // Placeholder for search dialog
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-sans"
        >
          <Search size={14} className="text-amber-400" /> Find product
        </button>
      </div>
    </div>
  );
}
