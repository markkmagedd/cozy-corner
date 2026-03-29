'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { ActionResult, ProductImage } from '@/types'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function getImageUploadUrl(productId: string, fileName: string, fileSize: number, mimeType: string): Promise<ActionResult<{ uploadUrl: string, storagePath: string }>> {
  if (fileSize > MAX_FILE_SIZE) {
    return { success: false, error: 'File size exceeds 5MB limit.' }
  }

  if (!mimeType.startsWith('image/')) {
    return { success: false, error: 'Invalid file type. Must be an image.' }
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} },
  })

  const ext = fileName.split('.').pop()
  const storagePath = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  const { data, error } = await supabase.storage.from('product-images').createSignedUploadUrl(storagePath)

  if (error || !data) {
    return { success: false, error: error?.message || 'Failed to generate upload URL' }
  }

  return { success: true, data: { uploadUrl: data.signedUrl, storagePath } }
}

export async function createImageRecord(productId: string, data: { url: string, storagePath: string, altText?: string, isPrimary?: boolean }): Promise<ActionResult<ProductImage>> {
  try {
    if (data.isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false }
      })
    }

    const count = await prisma.productImage.count({ where: { productId } })

    const image = await prisma.productImage.create({
      data: {
        productId,
        url: data.url,
        storagePath: data.storagePath,
        altText: data.altText,
        isPrimary: data.isPrimary ?? (count === 0),
        displayOrder: count
      }
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    return { success: true, data: image as any }
  } catch (error) {
    return { success: false, error: 'Failed to create DB record' }
  }
}

export async function deleteImage(imageId: string): Promise<ActionResult> {
  try {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } })
    if (!image) return { success: false, error: 'Not found' }

    // In a real app we might delete from Supabase storage here using service role key
    
    await prisma.productImage.delete({ where: { id: imageId } })

    // If it was primary, promote the next one
    if (image.isPrimary) {
      const next = await prisma.productImage.findFirst({
        where: { productId: image.productId },
        orderBy: { displayOrder: 'asc' }
      })
      if (next) {
        await prisma.productImage.update({
          where: { id: next.id },
          data: { isPrimary: true }
        })
      }
    }

    revalidatePath(`/admin/products/${image.productId}/edit`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete image' }
  }
}

export async function reorderImages(productId: string, orderedIds: string[]): Promise<ActionResult> {
  try {
    const updates = orderedIds.map((id, index) => 
      prisma.productImage.update({
        where: { id },
        data: { displayOrder: index }
      })
    )

    await prisma.$transaction(updates)
    revalidatePath(`/admin/products/${productId}/edit`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder' }
  }
}

export async function setPrimaryImage(imageId: string): Promise<ActionResult> {
  try {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } })
    if (!image) return { success: false, error: 'Not found' }

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { productId: image.productId },
        data: { isPrimary: false }
      }),
      prisma.productImage.update({
        where: { id: imageId },
        data: { isPrimary: true }
      })
    ])

    revalidatePath(`/admin/products/${image.productId}/edit`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to set primary' }
  }
}
