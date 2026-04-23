import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [], total: 0 })
    }

    // Since we enabled fullTextSearchPostgres, we can use prisma search directly.
    // Alternatively, we fall back to simple contains if preferred. Let's use Prisma search.
    const cleanSearchQuery = q.split(' ').filter(Boolean).join(' | ')

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          search: cleanSearchQuery,
        },
        description: {
          search: cleanSearchQuery,
        },
      },
      take: limit,
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    })

    // If search returns no results, fallback to a generous ILIKE
    let results = products;
    if (results.length === 0) {
      results = await prisma.product.findMany({
             where: {
               isActive: true,
               OR: [
                 { name: { contains: q, mode: 'insensitive' } },
                 { brand: { contains: q, mode: 'insensitive' } },
               ]
             },
             take: limit,
             include: {
               images: { orderBy: { displayOrder: 'asc' } }
             }
      })
    }

    const formattedResults = results.map((p: any) => {
      const primaryImage = p.images.find((img: any) => img.isPrimary) || p.images[0] || null
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        brand: p.brand,
        primaryImage: primaryImage ? { url: primaryImage.url, altText: primaryImage.altText } : null,
      }
    })

    return NextResponse.json({
      results: formattedResults,
      total: formattedResults.length,
    })
  } catch (error) {
    console.error('Failed to search products:', error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}
