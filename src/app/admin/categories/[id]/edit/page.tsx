import prisma from '@/lib/prisma'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { updateCategory } from '@/lib/actions/category-actions'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id: resolvedParams.id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!category) {
    notFound()
  }

  const updateCategoryWithId = updateCategory.bind(null, category.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Category</h1>
        <p className="text-slate-600">Update category details or parent hierarchy</p>
      </div>
      <CategoryForm 
        initialData={category} 
        categories={categories} 
        action={updateCategoryWithId} 
      />
    </div>
  )
}
