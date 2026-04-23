// src/lib/actions/category-actions.ts

'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { categorySchema } from '@/lib/validations'
import { deleteFromR2 } from '@/lib/r2'
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

    // ✅ Read image fields from form
    const imageUrl = (formData.get('imageUrl') as string) || null
    const imageStoragePath = (formData.get('imageStoragePath') as string) || null

    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { name, description, parentId, isFeatured, displayOrder } = parsed.data
    const slug = slugify(name)

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
        imageUrl,              // ✅ Save image URL
        imageStoragePath,      // ✅ Save R2 key
      },
      include: { children: true },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')

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

    // ✅ Read image fields from form
    const imageUrl = (formData.get('imageUrl') as string) || null
    const imageStoragePath = (formData.get('imageStoragePath') as string) || null

    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { name, description, parentId, isFeatured, displayOrder } = parsed.data

    if (parentId === id) {
      return { success: false, error: 'A category cannot be its own parent.' }
    }

    const slug = slugify(name)

    const existing = await prisma.category.findFirst({
      where: { slug, id: { not: id } }
    })

    if (existing) {
      return { success: false, error: 'Another category with this name already exists.' }
    }

    // ✅ Get old image to clean up from R2 if it changed
    const oldCategory = await prisma.category.findUnique({
      where: { id },
      select: { imageStoragePath: true }
    })

    // Delete old image from R2 if it was replaced or removed
    if (
      oldCategory?.imageStoragePath &&
      oldCategory.imageStoragePath !== imageStoragePath
    ) {
      try {
        await deleteFromR2(oldCategory.imageStoragePath)
      } catch (r2Error) {
        console.error('Failed to delete old image from R2:', r2Error)
        // Continue with update even if R2 delete fails
      }
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
        imageUrl,              // ✅ Update image URL
        imageStoragePath,      // ✅ Update R2 key
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
    const productsCount = await prisma.product.count({ where: { categoryId: id } })
    if (productsCount > 0) {
      return {
        success: false,
        error: `Cannot delete category with ${productsCount} assigned products. Reassign or remove products first.`
      }
    }

    const childrenCount = await prisma.category.count({ where: { parentId: id } })
    if (childrenCount > 0) {
      return {
        success: false,
        error: `Cannot delete category with ${childrenCount} child categories. Delete or reassign children first.`
      }
    }

    // ✅ Get image path before deleting
    const category = await prisma.category.findUnique({
      where: { id },
      select: { imageStoragePath: true }
    })

    // ✅ Delete image from R2
    if (category?.imageStoragePath) {
      try {
        await deleteFromR2(category.imageStoragePath)
      } catch (r2Error) {
        console.error('Failed to delete image from R2:', r2Error)
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

/**
 * Recursively fetches all descendant category IDs for a given category ID.
 * This is used to aggregate products from child categories into the parent category view.
 */
export async function getCategoryDescendantIds(categoryId: string): Promise<string[]> {
  try {
    // Fetch all categories once to build tree in-memory - efficient for typical category counts
    const allCategories = await prisma.category.findMany({
      select: { id: true, parentId: true }
    })

    const descendantIds: string[] = []
    
    const findChildren = (parentId: string) => {
      const children = allCategories.filter(c => c.parentId === parentId)
      for (const child of children) {
        descendantIds.push(child.id)
        findChildren(child.id)
      }
    }

    findChildren(categoryId)
    return descendantIds
  } catch (error) {
    console.error('Failed to fetch category descendants:', error)
    return []
  }
}

export async function updateCategoryOrder(items: { id: string; displayOrder: number }[]): Promise<ActionResult> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.category.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    )
    revalidatePath('/admin/categories')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to reorder categories:', error)
    return { success: false, error: 'Failed to reorder categories.' }
  }
}