import prisma from '@/lib/prisma'
import { CategoryListClient } from './CategoryListClient'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1', 10)
  const limit = 10
  const skip = (page - 1) * limit

  const whereClause = query
    ? {
        name: {
          contains: query,
          mode: 'insensitive' as const,
        },
      }
    : {}

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: whereClause,
      include: {
        parent: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      skip,
      take: limit,
    }),
    prisma.category.count({ where: whereClause }),
  ])

  const totalPages = Math.ceil(total / limit)

  const data = {
    items: categories as any[], // Casting because of the Prisma include adding parent and _count
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }

  return <CategoryListClient data={data} />
}
