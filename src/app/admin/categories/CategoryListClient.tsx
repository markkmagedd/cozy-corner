'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/admin/DataTable'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { deleteCategory } from '@/lib/actions/category-actions'
import type { Category, TableColumn, PaginatedResponse } from '@/types'

// Extended category type to include productCount for the UI
type CategoryWithCount = Category & { _count: { products: number }, parent?: Category | null }

interface CategoryListClientProps {
  data: PaginatedResponse<CategoryWithCount>
}

export function CategoryListClient({ data }: CategoryListClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>('')
  const [errorToast, setErrorToast] = useState<string | null>(null) // Will be replaced by real toast component later

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteId(id)
    setDeleteName(name)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    
    const result = await deleteCategory(deleteId)
    if (!result.success) {
      setErrorToast(result.error || 'Failed to delete category')
      // Auto-hide error toast after 5s
      setTimeout(() => setErrorToast(null), 5000)
    }
    setDeleteId(null)
  }

  const columns: TableColumn<CategoryWithCount>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (cat) => <span className="font-semibold text-slate-800">{cat.name}</span>
    },
    {
      key: 'parentId',
      header: 'Parent',
      cell: (cat) => cat.parent?.name || <span className="text-slate-400 italic">None</span>
    },
    {
      header: 'Products',
      cell: (cat) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
        {cat._count.products}
      </span>
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      cell: (cat) => cat.isFeatured ? 
        <Check className="w-5 h-5 text-emerald-500" /> : 
        <X className="w-5 h-5 text-slate-300" />
    },
    {
      header: 'Actions',
      cell: (cat) => (
        <div className="flex gap-2">
          <Link href={`/admin/categories/${cat.id}/edit`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit Category">
              <Pencil className="w-4 h-4 text-slate-600" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:text-red-600" 
            onClick={() => handleDeleteClick(cat.id, cat.name)}
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 flex flex-col items-center">
      {errorToast && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-md flex items-center gap-3 w-screen max-w-sm">
           <span className="flex-1 text-sm font-medium">{errorToast}</span>
           <button onClick={() => setErrorToast(null)} className="text-red-500 hover:text-red-700">
             <X className="w-5 h-5" />
           </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-600 text-sm mt-1">Manage product categories and hierarchy</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </Link>
      </div>

      <div className="w-full">
        <DataTable data={data} columns={columns} searchPlaceholder="Search categories..." />
      </div>

      <DeleteConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete"
        itemName={deleteName}
      />
    </div>
  )
}
