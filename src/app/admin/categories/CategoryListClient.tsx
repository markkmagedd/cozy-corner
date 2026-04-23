'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SortableDataTable } from '@/components/admin/SortableDataTable'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { deleteCategory, updateCategoryOrder } from '@/lib/actions/category-actions'
import type { Category, TableColumn, PaginatedResponse } from '@/types'

// Extended category type to include productCount for the UI
type CategoryWithCount = Category & { _count: { products: number }, parent?: Category | null }

interface CategoryListClientProps {
  data: PaginatedResponse<CategoryWithCount>
}

export function CategoryListClient({ data }: CategoryListClientProps) {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>('')
  const [errorToast, setErrorToast] = useState<string | null>(null)

  const handleReorder = async (reorderedItems: CategoryWithCount[]) => {
    const payload = reorderedItems.map((item, index) => ({
      id: item.id,
      displayOrder: index - reorderedItems.length // Negative numbers guarantee they float above default 0
    }))
    await updateCategoryOrder(payload)
  }

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

  const commonColumns: TableColumn<CategoryWithCount>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (cat) => <span className="font-semibold text-slate-800">{cat.name}</span>
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
  ]

  const mainColumns: TableColumn<CategoryWithCount>[] = [
    ...commonColumns,
    {
      header: 'Actions',
      cell: (cat) => (
        <div className="flex gap-2">
          <Button 
            variant={selectedParentId === cat.id ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1.5"
            onClick={() => setSelectedParentId(selectedParentId === cat.id ? null : cat.id)}
          >
            Subcategories
          </Button>
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

  const subColumns: TableColumn<CategoryWithCount>[] = [
    ...commonColumns,
    {
      key: 'parentId',
      header: 'Parent',
      cell: (cat) => cat.parent?.name || <span className="text-slate-400 italic">None</span>
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

  const selectedParent = data.items.find(cat => cat.id === selectedParentId)
  const filteredSubcategories = data.items.filter(cat => cat.parentId === selectedParentId)

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

      <div className="w-full space-y-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Main Categories</h2>
          <SortableDataTable 
            data={{ ...data, items: data.items.filter(cat => !cat.parentId) }} 
            columns={mainColumns} 
            searchPlaceholder="Search main categories..." 
            onReorder={handleReorder} 
          />
        </div>
        
        {selectedParentId && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">
                  Subcategories of <span className="text-accent underline underline-offset-4">{selectedParent?.name}</span>
                </h2>
                <span className="text-sm text-slate-500 font-normal">Drag to reorder within this group</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedParentId(null)} className="text-slate-500">
                Close
              </Button>
            </div>
            
            {filteredSubcategories.length > 0 ? (
              <SortableDataTable 
                data={{ ...data, items: filteredSubcategories }} 
                columns={subColumns} 
                searchPlaceholder={`Search subcategories of ${selectedParent?.name}...`} 
                onReorder={handleReorder} 
              />
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-slate-500">This category has no subcategories yet.</p>
                <Link href={`/admin/categories/new?parentId=${selectedParentId}`}>
                  <Button variant="outline" size="sm" className="mt-3">Create one</Button>
                </Link>
              </div>
            )}
          </div>
        )}
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
