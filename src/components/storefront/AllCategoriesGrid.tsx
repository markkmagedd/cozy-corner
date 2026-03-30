import Image from "next/image"
import Link from "next/link"

interface CategoryWithThumbnail {
  id: string
  name: string
  slug: string
  description: string | null
  thumbnailUrl: string | null
}

interface AllCategoriesGridProps {
  categories: CategoryWithThumbnail[]
}

export function AllCategoriesGrid({ categories }: AllCategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-semibold text-slate-900">No categories found at this time</h2>
        <p className="mt-2 text-slate-500">Please check back later as we expand our curated collections.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/category/${category.slug}`}
          className="group relative h-96 overflow-hidden rounded-2xl bg-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Background Image Container */}
          <div className="relative flex-1">
            {category.thumbnailUrl ? (
              <Image
                src={category.thumbnailUrl}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                 <div className="w-16 h-16 rounded-full bg-slate-300 animate-pulse" />
              </div>
            )}
            
            {/* Scrim for readability */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80 group-hover:to-black/90 transition-colors" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <h3 className="text-2xl font-bold mb-2 group-hover:-translate-y-1 transition-transform">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-slate-200 line-clamp-2 mb-4 group-hover:-translate-y-1 transition-transform delay-75 opacity-70 group-hover:opacity-100 duration-300">
                  {category.description}
                </p>
              )}
              
              <div className="mt-2 inline-flex items-center text-sm font-semibold border-b border-white/30 group-hover:border-white transition-colors pb-1 w-fit">
                Explore Collection
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
