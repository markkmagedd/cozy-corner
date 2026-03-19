import React from "react";

export default function ProductsLoading() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex gap-8">
      <div className="hidden lg:block w-64 h-150 bg-zinc-900 animate-pulse rounded-lg" />
      <div className="flex-1">
        <div className="h-10 w-48 bg-zinc-900 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-3/4 bg-zinc-900 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
