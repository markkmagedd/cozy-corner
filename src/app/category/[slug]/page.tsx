import { notFound } from "next/navigation"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { ProductGrid } from "@/components/storefront/ProductGrid"
import { FilterSidebar } from "@/components/storefront/FilterSidebar"
import { Pagination } from "@/components/storefront/Pagination"
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs"
import prisma from "@/lib/prisma"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const resolvedSP = await searchParams
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { parent: true }
  })

  if (!category) {
    notFound()
  }

  const page = typeof resolvedSP.page === "string" ? parseInt(resolvedSP.page) : 1
  const brandParam = typeof resolvedSP.brand === "string" ? resolvedSP.brand : undefined
  const minPriceParam = typeof resolvedSP.minPrice === "string" ? resolvedSP.minPrice : undefined
  const maxPriceParam = typeof resolvedSP.maxPrice === "string" ? resolvedSP.maxPrice : undefined

  const limit = 12
  const skip = (page - 1) * limit
  
  const where: any = { isActive: true, categoryId: category.id }
  if (brandParam) where.brand = brandParam
  if (minPriceParam || maxPriceParam) {
    where.price = {}
    if (minPriceParam) where.price.gte = parseFloat(minPriceParam)
    if (maxPriceParam) where.price.lte = parseFloat(maxPriceParam)
  }

  const [productsData, total] = await Promise.all([
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
  ])

  const formattedProducts = productsData.map((p: any) => {
    const primaryImage = p.images.find((img: any) => img.isPrimary) || p.images[0] || null
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
    }
  })

  const totalPages = Math.ceil(total / limit)

  const breadcrumbs = [
    ...(category.parent ? [{ name: category.parent.name, href: `/category/${category.parent.slug}` }] : []),
    { name: category.name, href: `/category/${category.slug}` }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-slate-50 py-12 border-b border-slate-200">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="text-4xl font-serif font-bold text-slate-900">{category.name}</h1>
            {category.description && (
              <p className="mt-4 text-lg text-slate-600 max-w-2xl">{category.description}</p>
            )}
          </div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
          <FilterSidebar />
          
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-500">Showing {total} product{total !== 1 ? 's' : ''}</p>
            </div>
            <ProductGrid products={formattedProducts} />
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
