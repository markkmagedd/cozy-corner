'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [index, setIndex] = useState(0);

  const paginate = (newDirection: number) => {
    setIndex((prev) => (prev + newDirection + images.length) % images.length);
  };

  if (images.length === 0) return (
    <div className="aspect-[4/5] w-full rounded-2xl bg-neutral-100 flex items-center justify-center">
      <span className="text-neutral-400">No Image Available</span>
    </div>
  );

  return (
    <div className="group relative w-full flex flex-col space-y-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full w-full"
          >
            <Image
              src={images[index]}
              alt={`Product Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 backdrop-blur-md transition-all hover:bg-white focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-900" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 backdrop-blur-md transition-all hover:bg-white focus:outline-none"
            >
              <ChevronRight className="h-5 w-5 text-neutral-900" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-[4/5] h-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                index === i ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
