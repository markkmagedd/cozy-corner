import prisma from '@/lib/prisma'
import { ProductForm } from '@/components/admin/ProductForm'
import { updateProduct } from '@/lib/actions/product-actions'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ 
      where: { id: resolvedParams.id },
      include: { 
        variants: true,
        images: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) {
    notFound()
  }

  const updateProductWithId = updateProduct.bind(null, product.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
        <p className="text-slate-600">Update product specifics, inventory, and images</p>
      </div>
      {/* We need to pass the images array to initialData so ImageUploader can use it */}
      <ProductForm 
        initialData={product as any} 
        categories={categories} 
        action={updateProductWithId} 
      />
    </div>
  )
}
