'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { categorySchema } from '@/lib/validations'
import type { ActionResult, Category } from '@/types'

export async function createCategory(formData: FormData): Promise<ActionResult<Category>> {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string | null,
      parentId: (formData.get('parentId') as string) || null,
      isFeatured: formData.get('isFeatured') === 'on',
      displayOrder: parseInt((formData.get('displayOrder') as string) || '0', 10),
    }

    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { name, description, parentId, isFeatured, displayOrder } = parsed.data
    const slug = slugify(name)

    // Check if slug already exists
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return { success: false, error: 'A category with this name already exists.' }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId,
        isFeatured,
        displayOrder,
      },
      include: { children: true },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    
    // Convert Dates to string for client component boundary although Next15 might handle it
    return { success: true, data: category as any }
  } catch (error) {
    console.error('Failed to create category:', error)
    return { success: false, error: 'Failed to create category.' }
  }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult<Category>> {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string | null,
      parentId: (formData.get('parentId') as string) || null,
      isFeatured: formData.get('isFeatured') === 'on',
      displayOrder: parseInt((formData.get('displayOrder') as string) || '0', 10),
    }

    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { name, description, parentId, isFeatured, displayOrder } = parsed.data
    
    if (parentId === id) {
      return { success: false, error: 'A category cannot be its own parent.' }
    }

    const slug = slugify(name)

    // Check slug collision with OTHER categories
    const existing = await prisma.category.findFirst({
      where: { slug, id: { not: id } }
    })
    
    if (existing) {
      return { success: false, error: 'Another category with this name already exists.' }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        parentId,
        isFeatured,
        displayOrder,
      },
      include: { children: true }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath(`/category/${slug}`)

    return { success: true, data: category as any }
  } catch (error) {
    console.error('Failed to update category:', error)
    return { success: false, error: 'Failed to update category.' }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    // Prevent deletion if products exist
    const productsCount = await prisma.product.count({ where: { categoryId: id } })
    if (productsCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete category with ${productsCount} assigned products. Reassign or remove products first.` 
      }
    }
    
    // Prevent deletion if children exist
    const childrenCount = await prisma.category.count({ where: { parentId: id } })
    if (childrenCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete category with ${childrenCount} child categories. Delete or reassign children first.` 
      }
    }

    await prisma.category.delete({ where: { id } })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to delete category:', error)
    return { success: false, error: 'Failed to delete category.' }
  }
}
