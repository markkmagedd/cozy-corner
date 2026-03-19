"use client";

import React from "react";
import { MoveDown } from "lucide-react";

export default function LoadMoreButton({
  onClick,
  isLoading,
  hasMore
}: {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}) {
  if (!hasMore) return null;

  return (
    <div className="mt-12 flex justify-center">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="group relative flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden backdrop-blur-sm shadow-xl"
      >
        <span className="relative z-10 flex items-center gap-3">
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" />
          ) : (
            <MoveDown size={14} className="group-hover:translate-y-1 transition-transform" />
          )}
          {isLoading ? "Loading..." : "Load More Experience"}
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
    </div>
  );
}
