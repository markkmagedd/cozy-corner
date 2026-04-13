import Link from "next/link"
import type { Category } from "@/types"

interface SubcategoryNavProps {
  subcategories: Category[]
}

export function SubcategoryNav({ subcategories }: SubcategoryNavProps) {
  if (subcategories.length === 0) return null

  return (
    <div className="mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/category/${sub.slug}`}
            className="flex-shrink-0 px-6 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:shadow-sm transition-all duration-300 active:scale-95 snap-start"
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

