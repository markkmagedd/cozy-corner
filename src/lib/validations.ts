import { z } from 'zod';

export const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().optional().nullable(),
  colorHex: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  sku: z.string().min(1, 'SKU is required').max(50),
  isAvailable: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional().nullable(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  compareAtPrice: z.number().min(0, 'Compare at price must be 0 or greater').nullable().optional(),
  brand: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isOffer: z.boolean().default(false),
  variants: z.array(variantSchema).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export const imageUploadSchema = z.object({
  files: z.any(), // File[] validated mostly on the client / API parsing
  altTexts: z.array(z.string().nullable()).optional(),
});
