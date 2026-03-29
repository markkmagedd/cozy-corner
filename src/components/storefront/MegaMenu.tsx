"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Category } from "@/types"

export function MegaMenu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error)
  }, [])

  const featured = categories.filter(c => c.isFeatured)
  const allCategories = categories

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-sm font-medium transition-colors hover:text-accent h-10 px-4">
        Shop
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full w-screen max-w-2xl translate-x-[-100px] bg-white border border-slate-200 shadow-xl rounded-b-lg overflow-hidden">
          <div className="grid grid-cols-2 p-6 gap-8">
            <div>
              <h3 className="font-serif text-lg font-bold mb-4 border-b pb-2">All Categories</h3>
              <ul className="space-y-3">
                {allCategories.map(cat => (
                  <li key={cat.id} className="group">
                    <Link href={`/category/${cat.slug}`} className="text-slate-600 hover:text-accent font-medium">
                      {cat.name}
                    </Link>
                    {cat.children && cat.children.length > 0 && (
                      <ul className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100 hidden group-hover:block">
                        {cat.children.map(child => (
                          <li key={child.id}>
                            <Link href={`/category/${child.slug}`} className="text-sm text-slate-500 hover:text-accent">
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 p-6 -m-6 rounded-r-lg">
              <h3 className="font-serif text-lg font-bold mb-4">Curated Collections</h3>
              <ul className="space-y-4">
                {featured.map(f => (
                  <li key={f.id}>
                    <Link 
                      href={`/category/${f.slug}`}
                      className="block p-4 bg-white rounded-md shadow-sm border border-slate-100 hover:border-accent hover:shadow-md transition-all"
                    >
                      <div className="font-medium text-primary">{f.name}</div>
                      {f.description && <p className="text-xs text-slate-500 mt-1">{f.description}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
