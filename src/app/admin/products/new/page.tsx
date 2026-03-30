import prisma from '@/lib/prisma'
import { ProductForm } from '@/components/admin/ProductForm'
import { createProduct } from '@/lib/actions/product-actions'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">New Product</h1>
        <p className="text-slate-600">Create a new product with variants and images</p>
      </div>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  )
}
