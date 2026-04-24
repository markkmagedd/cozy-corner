import prisma from "@/lib/prisma"
import { ProductGrid } from "./ProductGrid"
import { FilterSidebar } from "./FilterSidebar"
import { Pagination } from "./Pagination"
import { getCategoryDescendantIds } from "@/lib/actions/category-actions"
import { notFound } from "next/navigation"

interface CategoryContentProps {
  slug: string
  resolvedSP: { [key: string]: string | string[] | undefined }
}

export async function CategoryContent({ slug, resolvedSP }: CategoryContentProps) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true }
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

  const [productsData, total, availableFilters, availableBrands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: {
          where: { isAvailable: true }
        },
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
    prisma.product.findMany({
      where: { categoryId: { in: allCategoryIds }, isActive: true, brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
    }).then(products => products.map(p => p.brand as string))
  ])

  const formattedProducts = productsData.map((p: any) => {
    const primaryImage = p.images.find((img: any) => img.isPrimary) || p.images[0] || null
    const availableColors = Array.from(
      new Set(p.variants.map((v: any) => v.color).filter(Boolean))
    ) as string[]
    const availableSizes = Array.from(
      new Set(p.variants.map((v: any) => v.size).filter(Boolean))
    ) as string[]
    
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      brand: p.brand,
      categoryId: p.categoryId,
      isActive: p.isActive,
      isOffer: p.isOffer,
      primaryImage: primaryImage ? { url: primaryImage.url, altText: primaryImage.altText } : null,
      availableColors,
      availableSizes,
    }
  })

  const totalPages = Math.ceil(total / limit)

  return (
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
  )
}
