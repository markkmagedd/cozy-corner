import Link from "next/link"
import type { Category } from "@/types"
import { cn } from "@/lib/utils"

interface SubcategoryNavProps {
  subcategories: any[]
  activeSlug?: string
}

export function SubcategoryNav({ subcategories, activeSlug }: SubcategoryNavProps) {
  if (subcategories.length === 0) return null

  return (
    <div className="mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {subcategories.map((sub) => {
          const isActive = sub.slug === activeSlug
          return (
            <Link
              key={sub.id}
              href={`/category/${sub.slug}`}
              className={cn(
                "flex-shrink-0 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 active:scale-95 snap-start",
                isActive 
                  ? "border-slate-900 bg-slate-900 text-white shadow-md" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:shadow-sm"
              )}
            >
              {sub.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

