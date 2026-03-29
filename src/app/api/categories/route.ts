import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    })

    // Build nested tree
    const categoryMap = new Map()
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] })
    })

    const rootCategories: any[] = []

    categoryMap.forEach((cat) => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId)
        if (parent) {
          parent.children.push(cat)
        } else {
          rootCategories.push(cat)
        }
      } else {
        rootCategories.push(cat)
      }
    })

    return NextResponse.json({ categories: rootCategories })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
