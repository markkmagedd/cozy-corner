'use server';

import prisma from '@/src/lib/prisma';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';
import { ActionResponse } from '@/src/types/admin';
import { revalidatePath } from 'next/cache';

export async function createCategory(data: any): Promise<ActionResponse<any>> {
  try {
    const existingCats = await prisma.category.findMany({ select: { slug: true } });
    const existingSlugs = existingCats.map(c => c.slug);
    
    // 1. Generate slug
    const finalSlug = ensureUniqueSlug(generateSlug(data.name), existingSlugs);

    // 2. Insert using Prisma
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: finalSlug,
        parentId: data.parent_id || null, // data.parent_id is what's passed from CategoryForm
      }
    });

    revalidatePath('/admin/dashboard/categories');
    revalidatePath('/admin/dashboard/products');
    revalidatePath('/(store)/products', 'layout');
    
    return { success: true, data: category as any };
  } catch (error: any) {
    return { success: false, message: `Insertion failed: ${error.message}` };
  }
}

export async function updateCategory(id: string, data: Partial<any>): Promise<ActionResponse<any>> {
  try {
    // Map data fields to prisma model (camelCase)
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        parentId: data.parent_id !== undefined ? (data.parent_id || null) : undefined,
      }
    });

    revalidatePath('/admin/dashboard/categories');
    revalidatePath('/(store)/products', 'layout');
    
    return { success: true, data: category as any };
  } catch (error: any) {
    return { success: false, message: `Update failed: ${error.message}` };
  }
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  try {
    // 1. Prisma makes it easy to check for related items
    const categoryWithCount = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            products: true,
            children: true
          }
        }
      }
    });

    if (!categoryWithCount) return { success: false, message: 'Category not found' };

    if (categoryWithCount._count.products > 0) {
      return { 
        success: false, 
        message: `Cannot delete category: It still contains ${categoryWithCount._count.products} product(s). Please reassign or delete them first.` 
      };
    }

    if (categoryWithCount._count.children > 0) {
      return { 
        success: false, 
        message: `Cannot delete category: It has ${categoryWithCount._count.children} subcategories. Delete them first.` 
      };
    }

    await prisma.category.delete({
      where: { id }
    });

    revalidatePath('/admin/dashboard/categories');
    return { success: true, message: 'Category deleted successfully' };
  } catch (error: any) {
    return { success: false, message: `Deletion failed: ${error.message}` };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    // Support flat structure compatibility
    return categories.map(c => ({
      ...c,
      parent_id: c.parentId,
      created_at: c.createdAt
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
