"use client"

import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface SubcategoryNavProps {
  subcategories: any[]
  activeSlug?: string
}

export function SubcategoryNav({ subcategories, activeSlug }: SubcategoryNavProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticSlug, setOptimisticSlug] = useState(activeSlug)

  // Sync optimistic state with the real activeSlug when it changes (navigation finishes)
  useEffect(() => {
    setOptimisticSlug(activeSlug)
  }, [activeSlug])

  if (subcategories.length === 0) return null

  const handleSubcategoryClick = (slug: string) => {
    setOptimisticSlug(slug)
    startTransition(() => {
      router.push(`/category/${slug}`)
    })
  }

  return (
    <div className="mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {subcategories.map((sub) => {
          const isActive = sub.slug === optimisticSlug
          return (
            <button
              key={sub.id}
              onClick={() => handleSubcategoryClick(sub.slug)}
              disabled={isPending && sub.slug !== optimisticSlug}
              className={cn(
                "flex-shrink-0 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 active:scale-95 snap-start cursor-pointer disabled:opacity-50",
                isActive 
                  ? "border-slate-900 bg-slate-900 text-white shadow-md" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:shadow-sm"
              )}
            >
              {sub.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

