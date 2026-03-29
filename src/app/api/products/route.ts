import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const categoryId = searchParams.get('categoryId')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(48, parseInt(searchParams.get('limit') || '12'))
    
    const where: any = {
      isActive: true,
    }

    if (categoryId) where.categoryId = categoryId
    if (brand) where.brand = brand
    if (minPrice) where.price = { ...((where.price as any) || {}), gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...((where.price as any) || {}), lte: parseFloat(maxPrice) }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = { createdAt: 'desc' }
    
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'name_asc':
        orderBy = { name: 'asc' }
        break
      case 'name_desc':
        orderBy = { name: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ])

    // Format products
    const formattedProducts = products.map((p: any) => {
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
        primaryImage: primaryImage ? { url: primaryImage.url, altText: primaryImage.altText } : null,
        availableColors,
        availableSizes,
      }
    })

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
