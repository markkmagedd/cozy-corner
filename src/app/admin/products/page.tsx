import prisma from '@/lib/prisma'
import { ProductListClient } from './ProductListClient'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const page = parseInt(resolvedParams.page || '1', 10)
  const limit = 10
  const skip = (page - 1) * limit

  const whereClause = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { brand: { contains: query, mode: 'insensitive' as const } },
        ]
      }
    : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause }),
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
  }

  return <ProductListClient data={data} />
}
