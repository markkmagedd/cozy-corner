import prisma from '@/lib/prisma'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { createCategory } from '@/lib/actions/category-actions'

export const dynamic = 'force-dynamic'

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">New Category</h1>
        <p className="text-slate-600">Create a new product category</p>
      </div>
      <CategoryForm categories={categories} action={createCategory} />
    </div>
  )
}
