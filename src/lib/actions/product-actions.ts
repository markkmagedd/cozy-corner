'use server';

import prisma from '@/src/lib/prisma';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';
import { ActionResponse } from '@/src/types/admin';
import { revalidatePath } from 'next/cache';

export async function createProduct(data: any): Promise<ActionResponse<any>> {
  try {
    // 1. Fetch all existing slugs to ensure uniqueness
    const existingProducts = await prisma.product.findMany({
      select: { slug: true }
    });
    const existingSlugs = existingProducts.map((p: { slug: string }) => p.slug);
    
    // 2. Generate slug
    const finalSlug = ensureUniqueSlug(generateSlug(data.title), existingSlugs);

    // 3. Insert into DB using Prisma
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: finalSlug,
        description: data.description,
        price: data.price,
        originalPrice: data.original_price || null,
        imageUrl: data.image_url,
        categoryId: data.category_id,
        inStock: data.in_stock ?? true,
        sizes: data.sizes ?? [],
      }
    });

    revalidatePath('/admin/dashboard/products');
    revalidatePath('/(store)/products', 'layout');
    
    return { success: true, data: product as any };
  } catch (error: any) {
    console.error('Prisma Create Error:', error);
    return { success: false, message: `Insertion failed: ${error.message}` };
  }
}

export async function updateProduct(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price !== undefined ? data.price : undefined,
        originalPrice: data.original_price !== undefined ? (data.original_price || null) : undefined,
        imageUrl: data.image_url,
        categoryId: data.category_id,
        inStock: data.in_stock,
        sizes: data.sizes,
      }
    });

    revalidatePath('/admin/dashboard/products');
    revalidatePath(`/(store)/products/${product.slug}`, 'page');
    
    return { success: true, data: product as any };
  } catch (error: any) {
    return { success: false, message: `Update failed: ${error.message}` };
  }
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/admin/dashboard/products');
    return { success: true, message: 'Product deleted successfully' };
  } catch (error: any) {
    return { success: false, message: `Deletion failed: ${error.message}` };
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map to match the previous structure compatibility
    return products.map((p: any) => ({
      ...p,
      categories: p.category, // provide compatibility
      original_price: p.originalPrice,
      image_url: p.imageUrl,
      category_id: p.categoryId,
      in_stock: p.inStock,
      created_at: p.createdAt
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
