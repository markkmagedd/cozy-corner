'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { deleteFromR2 } from '@/lib/r2'
import type { ActionResult, ProductImage } from '@/types'

// ❌ REMOVED: getImageUploadUrl (no longer needed — we upload via /api/upload)

export async function createImageRecord(
  productId: string,
  data: {
    url: string
    storagePath: string
    altText?: string
    isPrimary?: boolean
  }
): Promise<ActionResult<ProductImage>> {
  try {
    if (data.isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      })
    }

    const count = await prisma.productImage.count({ where: { productId } })

    const image = await prisma.productImage.create({
      data: {
        productId,
        url: data.url,
        storagePath: data.storagePath,
        altText: data.altText,
        isPrimary: data.isPrimary ?? count === 0,
        displayOrder: count,
      },
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    return { success: true, data: image as any }
  } catch (error) {
    console.error('Failed to create image record:', error)
    return { success: false, error: 'Failed to create DB record' }
  }
}

export async function deleteImage(imageId: string): Promise<ActionResult> {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    })
    if (!image) return { success: false, error: 'Not found' }

    // ✅ DELETE FROM R2
    try {
      await deleteFromR2(image.storagePath)
    } catch (r2Error) {
      console.error('Failed to delete from R2:', r2Error)
      // Continue with DB deletion even if R2 fails
    }

    await prisma.productImage.delete({ where: { id: imageId } })

    // If it was primary, promote the next one
    if (image.isPrimary) {
      const next = await prisma.productImage.findFirst({
        where: { productId: image.productId },
        orderBy: { displayOrder: 'asc' },
      })
      if (next) {
        await prisma.productImage.update({
          where: { id: next.id },
          data: { isPrimary: true },
        })
      }
    }

    revalidatePath(`/admin/products/${image.productId}/edit`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete image:', error)
    return { success: false, error: 'Failed to delete image' }
  }
}

export async function reorderImages(
  productId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  try {
    const updates = orderedIds.map((id, index) =>
      prisma.productImage.update({
        where: { id },
        data: { displayOrder: index },
      })
    )

    await prisma.$transaction(updates)
    revalidatePath(`/admin/products/${productId}/edit`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder' }
  }
}

export async function setPrimaryImage(
  imageId: string
): Promise<ActionResult> {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    })
    if (!image) return { success: false, error: 'Not found' }

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { productId: image.productId },
        data: { isPrimary: false },
      }),
      prisma.productImage.update({
        where: { id: imageId },
        data: { isPrimary: true },
      }),
    ])

    revalidatePath(`/admin/products/${image.productId}/edit`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to set primary' }
  }
}