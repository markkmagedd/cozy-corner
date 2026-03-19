'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-4 mt-20 pt-12 border-t-2 border-muted/50">
      <Link
        href={`${baseUrl}?page=${Math.max(1, currentPage - 1)}`}
        className={cn(
          "p-4 rounded-2xl bg-muted text-black transition-all active:scale-95 shadow-sm group",
          currentPage === 1 ? "pointer-events-none opacity-20" : "hover:bg-black hover:text-white"
        )}
      >
        <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      </Link>

      <div className="flex items-center gap-2">
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <Link
              key={p}
              href={`${baseUrl}?page=${p}`}
              className={cn(
                "min-w-14 h-14 flex items-center justify-center rounded-2xl transition-all active:scale-95 font-black text-lg italic shadow-sm",
                isActive 
                  ? "bg-black text-white" 
                  : "bg-muted text-muted-foreground hover:bg-black/10 hover:text-black"
              )}
            >
              {p}
            </Link>
          );
        })}
      </div>

      <Link
        href={`${baseUrl}?page=${Math.min(totalPages, currentPage + 1)}`}
        className={cn(
          "p-4 rounded-2xl bg-muted text-black transition-all active:scale-95 shadow-sm group",
          currentPage === totalPages ? "pointer-events-none opacity-20" : "hover:bg-black hover:text-white"
        )}
      >
        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
