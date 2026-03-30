import Link from "next/link"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
}

interface FeaturedCategoriesProps {
  categories: Category[]
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null

  return (
    <section id="featured-categories" className="py-16 bg-slate-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-slate-900">Shop by Category</h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Explore our curated collections designed for every part of your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="group relative h-80 overflow-hidden rounded-xl bg-slate-200"
            >
              {/* Fallback pattern until we have category images */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 group-hover:to-black/70 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2 transform group-hover:-translate-y-1 transition-transform">
                  {category.name}
                </h3>
                <span className="text-sm font-medium text-slate-200 border-b border-white/30 group-hover:border-white transition-colors">
                  View Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
