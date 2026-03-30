import { Suspense } from "react"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { HeroSection } from "@/components/storefront/HeroSection"
import { ProductGrid } from "@/components/storefront/ProductGrid"
import { FeaturedCategories } from "@/components/storefront/FeaturedCategories"
import { PromoBanner } from "@/components/storefront/PromoBanner"
import { NewsletterSignup } from "@/components/storefront/NewsletterSignup"
import { Pagination } from "@/components/storefront/Pagination"
import prisma from "@/lib/prisma"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1
  const searchQuery = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined
  const brandParam = typeof resolvedParams.brand === "string" ? resolvedParams.brand : undefined
  const minPriceParam = typeof resolvedParams.minPrice === "string" ? resolvedParams.minPrice : undefined
  const maxPriceParam = typeof resolvedParams.maxPrice === "string" ? resolvedParams.maxPrice : undefined

  // Construct query explicitly for server-side initial rendering
  const queryParams = new URLSearchParams()
  if (page > 1) queryParams.set('page', page.toString())
  if (searchQuery) queryParams.set('search', searchQuery)
  if (brandParam) queryParams.set('brand', brandParam)
  if (minPriceParam) queryParams.set('minPrice', minPriceParam)
  if (maxPriceParam) queryParams.set('maxPrice', maxPriceParam)

  // Fetch from our API or directly call Prisma. For Next.js Server Components, 
  // directly calling DB is more efficient, but we mimic the route.
  // Actually, we should just fetch absolute URL or call prisma. Let's call Prisma.
  const limit = 12
  const skip = (page - 1) * limit
  
  const where: any = { isActive: true }
  if (brandParam) where.brand = brandParam
  if (minPriceParam || maxPriceParam) {
    where.price = {}
    if (minPriceParam) where.price.gte = parseFloat(minPriceParam)
    if (maxPriceParam) where.price.lte = parseFloat(maxPriceParam)
  }
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { brand: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }

  const [productsData, total, featuredCategories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isFeatured: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ])

  const formattedProducts = productsData.map((p: any) => {
    const primaryImage = p.images.find((img: any) => img.isPrimary) || p.images[0] || null
    const availableColors = Array.from(new Set(p.variants.filter((v: any) => v.isAvailable && v.color).map((v: any) => v.color as string))) as string[]
    const availableSizes = Array.from(new Set(p.variants.filter((v: any) => v.isAvailable && v.size).map((v: any) => v.size as string))) as string[]
    
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      slug: p.slug,
      price: p.price,
      brand: p.brand,
      categoryId: p.categoryId,
      isActive: p.isActive,
      primaryImage: primaryImage ? { url: primaryImage.url, altText: primaryImage.altText } : null,
      availableColors,
      availableSizes,
    }
  })

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {!searchQuery && !brandParam && !minPriceParam && !maxPriceParam && page === 1 && (
          <HeroSection />
        )}
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {searchQuery ? (
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-slate-900">Search Results</h1>
              <p className="text-slate-500 mt-2">Showing {total} product{total !== 1 ? 's' : ''} for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-slate-900">
                {page === 1 ? 'New Arrivals' : 'All Products'}
              </h1>
            </div>
          )}

          <div className="w-full">
            <ProductGrid products={formattedProducts} />
            <Pagination totalPages={totalPages} />
          </div>
        </div>

        {!searchQuery && !brandParam && !minPriceParam && !maxPriceParam && page === 1 && (
          <>
            <FeaturedCategories categories={featuredCategories} />
            <PromoBanner />
            <NewsletterSignup />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
