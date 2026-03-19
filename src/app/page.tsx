import React, { Suspense } from 'react';
import { InfiniteProductGrid } from '@/src/components/feature/InfiniteProductGrid';
import { CategoryNav } from '@/src/components/ui/CategoryNav';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          The Hotel Shop
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-500">
          Curated essentials from our resort collective, handcrafted for your lifestyle and adventures after your stay.
        </p>
      </div>

      <CategoryNav />

      <section aria-labelledby="products-heading">
        <h2 id="products-heading" className="sr-only">Products</h2>
        <Suspense fallback={
          <div className="flex min-h-[400px] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-neutral-300" />
          </div>
        }>
          <InfiniteProductGrid />
        </Suspense>
      </section>
    </main>
  );
}
