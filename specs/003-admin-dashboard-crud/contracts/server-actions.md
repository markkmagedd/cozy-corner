# Admin Server Action Contracts

**Feature**: 003-admin-dashboard-crud  
**Date**: 2026-03-29

## Authentication

All admin Server Actions require an authenticated Supabase session. If the user is not authenticated, the action returns `{ error: "Unauthorized" }`.

### `loginAction(formData: FormData)`

**Input**: `{ email: string, password: string }`  
**Output**: `{ success: true }` or `{ error: string }`  
**Behavior**: Calls `supabase.auth.signInWithPassword()`. On success, redirects to `/admin`.

### `logoutAction()`

**Output**: `{ success: true }`  
**Behavior**: Calls `supabase.auth.signOut()`. Redirects to `/admin/login`.

---

## Category Actions (`src/lib/actions/category-actions.ts`)

### `createCategory(formData: FormData)`

**Input (validated via categorySchema)**:
```
{
  name: string        // 1–100 chars
  description?: string
  parentId?: string
  isFeatured?: boolean
  displayOrder?: number
}
```
**Output**: `{ success: true, category: Category }` or `{ error: string }`  
**Behavior**: Auto-generates `slug` from `name`. Creates record via Prisma. Calls `revalidatePath('/admin/categories')`.

### `updateCategory(id: string, formData: FormData)`

**Input**: Same fields as create  
**Output**: `{ success: true, category: Category }` or `{ error: string }`  
**Behavior**: Regenerates `slug` if `name` changed. Updates via Prisma. Revalidates paths.

### `deleteCategory(id: string)`

**Output**: `{ success: true }` or `{ error: string }`  
**Behavior**: Checks `Product.count({ where: { categoryId: id } })`. If > 0, returns `{ error: "Cannot delete category with N assigned products. Reassign or remove products first." }`. Otherwise deletes.

---

## Product Actions (`src/lib/actions/product-actions.ts`)

### `createProduct(formData: FormData)`

**Input (validated via productSchema)**:
```
{
  name: string          // 1–200 chars
  description?: string
  price: number         // >= 0
  brand?: string
  categoryId?: string
  isActive?: boolean
  variants?: Array<{
    color?: string
    colorHex?: string
    size?: string
    sku: string         // 1–50 chars, unique
    isAvailable?: boolean
  }>
}
```
**Output**: `{ success: true, product: Product }` or `{ error: string }`  
**Behavior**: Auto-generates `slug`. Creates product with nested variant upsert. Revalidates `/admin/products`.

### `updateProduct(id: string, formData: FormData)`

**Input**: Same fields as create  
**Output**: `{ success: true, product: Product }` or `{ error: string }`  
**Behavior**: Updates product. Handles variant diff (create new, update existing, delete removed). Revalidates paths.

### `deleteProduct(id: string)`

**Output**: `{ success: true }` or `{ error: string }`  
**Behavior**: Deletes product. Cascades to variants and images. Removes associated files from Supabase Storage.

### `toggleProductActive(id: string)`

**Output**: `{ success: true, isActive: boolean }` or `{ error: string }`  
**Behavior**: Toggles `isActive` field. Revalidates paths.

---

## Image Actions (`src/lib/actions/image-actions.ts`)

### `getImageUploadUrl(productId: string, fileName: string, fileSize: number, mimeType: string)`

**Output**: `{ success: true, uploadUrl: string, storagePath: string }` or `{ error: string }`  
**Behavior**: Validates `fileSize ≤ 5MB` and `mimeType` starts with `image/`. Generates a unique storage path. Returns a presigned upload URL from Supabase Storage.

### `createImageRecord(productId: string, data: { url: string, storagePath: string, altText?: string, isPrimary?: boolean })`

**Output**: `{ success: true, image: ProductImage }` or `{ error: string }`  
**Behavior**: If `isPrimary` is true, sets all other images for this product to `isPrimary: false` first. Creates the image record.

### `deleteImage(imageId: string)`

**Output**: `{ success: true }` or `{ error: string }`  
**Behavior**: Deletes from Supabase Storage using `storagePath`, then deletes the database record. If deleted image was primary, promotes the next image (lowest `displayOrder`) to primary.

### `reorderImages(productId: string, orderedImageIds: string[])`

**Output**: `{ success: true }` or `{ error: string }`  
**Behavior**: Updates `displayOrder` for each image based on array index position. Uses a transaction.

### `setPrimaryImage(imageId: string)`

**Output**: `{ success: true }` or `{ error: string }`  
**Behavior**: Sets `isPrimary: false` on all images for the same product, then sets `isPrimary: true` on the target image.
