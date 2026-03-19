import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/src/lib/api';
import { ImageGallery } from '@/src/components/feature/ImageGallery';
import { SelectionFeedback } from '@/src/components/feature/SelectionFeedback';
import { ChevronLeft, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 transition-colors hover:bg-neutral-200"
          aria-label="Back to listing"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex space-x-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 transition-colors hover:bg-neutral-200" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 transition-colors hover:bg-neutral-200" aria-label="Add to wishlist">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
        {/* Left: Image Gallery */}
        <section aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="sr-only">Product Images</h2>
          <ImageGallery images={product.images} />
        </section>

        {/* Right: Product Details */}
        <section aria-labelledby="details-heading" className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h2 id="details-heading" className="sr-only">Details</h2>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              {product.category.replace('-', ' ')}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Description</h3>
            <p className="text-base leading-relaxed text-neutral-600">
              {product.description}
            </p>
          </div>

          {/* Selections */}
          <div className="flex flex-col space-y-6 pt-4">
            {product.availableColors.length > 0 && (
              <SelectionFeedback 
                label="Available Colors" 
                options={product.availableColors} 
                type="color" 
              />
            )}
            
            {product.availableSizes.length > 0 && (
              <SelectionFeedback 
                label="Select Size" 
                options={product.availableSizes} 
                type="size" 
              />
            )}
          </div>

          {/* Store Info / Action (Browsing only context) */}
          <div className="mt-8 rounded-xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
            <h4 className="mb-2 text-sm font-bold text-neutral-900 uppercase tracking-wide">Visiting the Resort?</h4>
            <p className="text-xs leading-relaxed text-neutral-500">
              This item is available for immediate pickup at our onsite boutique located in the North Wing lobby. Consult your concierge for availability and fitting.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
