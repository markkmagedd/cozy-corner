import { notFound } from "next/navigation"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { ProductGrid } from "@/components/storefront/ProductGrid"
import { FilterSidebar } from "@/components/storefront/FilterSidebar"
import { Pagination } from "@/components/storefront/Pagination"
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs"
import { SubcategoryNav } from "@/components/storefront/SubcategoryNav"
import prisma from "@/lib/prisma"
import { getCategoryDescendantIds } from "@/lib/actions/category-actions"

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
    include: { 
      parent: true,
      children: {
        orderBy: { displayOrder: 'asc' }
      }
    }
  })

  if (!category) {
    notFound()
  }

  const descendantIds = await getCategoryDescendantIds(category.id)
  const allCategoryIds = [category.id, ...descendantIds]

  const page = typeof resolvedSP.page === "string" ? parseInt(resolvedSP.page) : 1
  const brandsParam = typeof resolvedSP.brand === "string" ? [resolvedSP.brand] : Array.isArray(resolvedSP.brand) ? resolvedSP.brand : undefined
  const colorsParam = typeof resolvedSP.color === "string" ? [resolvedSP.color] : Array.isArray(resolvedSP.color) ? resolvedSP.color : undefined
  const sizesParam = typeof resolvedSP.size === "string" ? [resolvedSP.size] : Array.isArray(resolvedSP.size) ? resolvedSP.size : undefined
  const minPriceParam = typeof resolvedSP.minPrice === "string" ? resolvedSP.minPrice : undefined
  const maxPriceParam = typeof resolvedSP.maxPrice === "string" ? resolvedSP.maxPrice : undefined

  const limit = 12
  const skip = (page - 1) * limit
  
  const where: any = { isActive: true, categoryId: { in: allCategoryIds } }
  if (brandsParam) where.brand = { in: brandsParam }
  if (minPriceParam || maxPriceParam) {
    where.price = {}
    if (minPriceParam) where.price.gte = parseFloat(minPriceParam)
    if (maxPriceParam) where.price.lte = parseFloat(maxPriceParam)
  }

  if (colorsParam || sizesParam) {
    where.variants = {
      some: {
        isAvailable: true,
        ...(colorsParam ? { color: { in: colorsParam } } : {}),
        ...(sizesParam ? { size: { in: sizesParam } } : {}),
      }
    }
  }

  const [productsData, total, availableFilters] = await Promise.all([
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
    prisma.productVariant.findMany({
      where: { product: { categoryId: { in: allCategoryIds }, isActive: true }, isAvailable: true },
      select: { color: true, colorHex: true, size: true },
    }).then(variants => {
      const colorMap = new Map<string, string>()
      variants.forEach(v => {
        if (v.color) {
          colorMap.set(v.color, v.colorHex || v.color)
        }
      })
      const colors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }))
      const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean))) as string[]
      return { colors, sizes }
    }),
  ])

  // Get available brands for this category
  const availableBrands = await prisma.product.findMany({
    where: { categoryId: { in: allCategoryIds }, isActive: true, brand: { not: null } },
    select: { brand: true },
    distinct: ['brand'],
  }).then(products => products.map(p => p.brand as string))

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
            <div className="mt-8">
              <SubcategoryNav subcategories={category.children as any} />
            </div>
          </div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
          <FilterSidebar 
            options={{
              brands: availableBrands,
              colors: availableFilters.colors,
              sizes: availableFilters.sizes
            }} 
          />
          
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
