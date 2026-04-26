'use client'

import { useState } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

interface ProductGalleryProps {
  images: {
    id: string;
    url: string;
    altText?: string | null;
  }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-slate-100 aspect-[4/5] rounded-xl flex items-center justify-center text-slate-400">
         No Image Available
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative bg-slate-100 aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
        <Image 
          src={activeImage.url} 
          alt={activeImage.altText || 'Product image'} 
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={twMerge(
                "relative flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900",
                activeIndex === index ? "border-slate-900 shadow-md transform -translate-y-1" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image 
                src={image.url} 
                alt={image.altText || `Thumbnail ${index + 1}`} 
                fill
                sizes="96px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
