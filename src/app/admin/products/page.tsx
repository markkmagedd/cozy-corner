import prisma from '@/lib/prisma'
import { ProductListClient } from './ProductListClient'
import { getCategoryDescendantIds } from '@/lib/actions/category-actions'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; categoryId?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const page = parseInt(resolvedParams.page || '1', 10)
  const categoryId = resolvedParams.categoryId || ''
  const limit = 10
  const skip = (page - 1) * limit

  const whereClause: any = {}
  
  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: 'insensitive' as const } },
      { brand: { contains: query, mode: 'insensitive' as const } },
    ]
  }

  if (categoryId) {
    const descendantIds = await getCategoryDescendantIds(categoryId)
    whereClause.categoryId = { in: [categoryId, ...descendantIds] }
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: true
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: { name: 'asc' }
    })
  ])

  const totalPages = Math.ceil(total / limit)

  const data = {
    items: products as any[], 
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    categories: categories as any[]
  }

  return <ProductListClient data={data} />
}
