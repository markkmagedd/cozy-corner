import { createClient } from './client'

const BUCKET_NAME = 'product-images'

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `products/${fileName}`

  // 1. Upload the file
  const { error: uploadError, data } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // 2. Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Deletes a file from Supabase Storage using its public URL.
 */
export async function deleteProductImage(url: string): Promise<void> {
  const supabase = createClient()
  
  // Extract path from URL (e.g. from /storage/v1/object/public/product-images/products/123.jpg)
  const path = url.split(`${BUCKET_NAME}/`)[1]
  
  if (!path) return

  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (deleteError) {
    console.error(`Delete failed: ${deleteError.message}`)
  }
}
