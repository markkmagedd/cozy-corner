'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Plus, Pencil, Trash2, Check, X, ChevronRight, Home, Search as SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SortableDataTable } from '@/components/admin/SortableDataTable'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { deleteCategory, updateCategoryOrder } from '@/lib/actions/category-actions'
import type { Category, TableColumn, PaginatedResponse } from '@/types'
import { cn } from '@/lib/utils'

// Extended category type to include productCount for the UI
type CategoryWithCount = Category & { _count: { products: number }, parent?: Category | null }

interface CategoryListClientProps {
  data: PaginatedResponse<CategoryWithCount>
}

export function CategoryListClient({ data }: CategoryListClientProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const isSearching = !!searchQuery

  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>('')
  const [errorToast, setErrorToast] = useState<string | null>(null)

  // Helper to derive path for any category
  const getPath = (id: string | null): CategoryWithCount[] => {
    if (!id) return []
    const cat = data.items.find(c => c.id === id)
    if (!cat) return []
    const parentPath = getPath(cat.parentId)
    return [...parentPath, cat]
  }

  // Current selection path for breadcrumbs
  const selectionPath = useMemo(() => getPath(selectedParentId), [selectedParentId, data.items])

  // Calculate recursive product counts
  const recursiveProductCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    
    const calculateCount = (id: string): number => {
      if (counts[id] !== undefined) return counts[id]
      const cat = data.items.find(c => c.id === id)
      if (!cat) return 0
      let total = cat._count.products
      const children = data.items.filter(c => c.parentId === id)
      children.forEach(child => {
        total += calculateCount(child.id)
      })
      counts[id] = total
      return total
    }

    data.items.forEach(cat => calculateCount(cat.id))
    return counts
  }, [data.items])

  const handleReorder = async (reorderedItems: CategoryWithCount[]) => {
    const payload = reorderedItems.map((item, index) => ({
      id: item.id,
      displayOrder: index - reorderedItems.length
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
      cell: (cat) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800" title="Total products including subcategories">
          {recursiveProductCounts[cat.id] || 0}
        </span>
      )
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      cell: (cat) => cat.isFeatured ? 
        <Check className="w-5 h-5 text-emerald-500" /> : 
        <X className="w-5 h-5 text-slate-300" />
    },
  ]

  const actionsCell = (cat: CategoryWithCount) => (
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

  const searchColumns: TableColumn<CategoryWithCount>[] = [
    ...commonColumns,
    {
      header: 'Full Path',
      cell: (cat) => {
        const path = getPath(cat.parentId)
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 font-medium">
              {path.length === 0 ? (
                <span>Top Level</span>
              ) : (
                path.map((p, i) => (
                  <span key={p.id} className="flex items-center gap-1">
                    {p.name}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                ))
              )}
            </div>
            <div className="text-sm font-semibold text-slate-900">{cat.name}</div>
          </div>
        )
      }
    },
    {
      header: 'Nesting',
      cell: (cat) => {
        const subCount = data.items.filter(c => c.parentId === cat.id).length
        return (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-600">{subCount} Subcategories</span>
            {cat.parentId && (
              <span className="text-[10px] text-slate-400">Child of {data.items.find(c => c.id === cat.parentId)?.name}</span>
            )}
          </div>
        )
      }
    },
    {
      header: 'Actions',
      cell: actionsCell
    }
  ]

  const mainColumns: TableColumn<CategoryWithCount>[] = [
    ...commonColumns,
    {
      header: 'Actions',
      cell: actionsCell
    }
  ]

  const subColumns: TableColumn<CategoryWithCount>[] = [
    ...commonColumns,
    {
      header: 'Actions',
      cell: (cat) => (
        <div className="flex gap-2">
          <Button 
            variant={selectedParentId === cat.id ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1.5"
            onClick={() => setSelectedParentId(cat.id)}
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

  const selectedParent = selectionPath[selectionPath.length - 1]
  const filteredSubcategories = data.items.filter(cat => cat.parentId === selectedParentId)

  const filteredItems = useMemo(() => {
    if (!isSearching) return data.items
    return data.items.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data.items, isSearching, searchQuery])

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
        <Link href={`/admin/categories/new${selectedParentId ? `?parentId=${selectedParentId}` : ''}`}>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </Link>
      </div>

      <div className="w-full space-y-8">
        {isSearching ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <SearchIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Search Results</h2>
                <p className="text-slate-500 text-sm">Showing all categories matching "{searchQuery}"</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-slate-400"
                onClick={() => {
                   const params = new URLSearchParams(searchParams)
                   params.delete('q')
                   window.location.search = params.toString()
                }}
              >
                Clear Search
              </Button>
            </div>
            <SortableDataTable 
              data={{ ...data, items: filteredItems }} 
              columns={searchColumns} 
              searchPlaceholder="Search all categories..." 
            />
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Main Categories</h2>
              <SortableDataTable 
                data={{ ...data, items: data.items.filter(cat => !cat.parentId) }} 
                columns={mainColumns} 
                searchPlaceholder="Search all categories..." 
                onReorder={handleReorder} 
              />
            </div>
            
            {selectedParentId && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center justify-between">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
                      <button 
                        onClick={() => setSelectedParentId(null)}
                        className="flex items-center gap-1 hover:text-accent transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        <span>Main</span>
                      </button>
                      {selectionPath.map((cat, index) => (
                        <div key={cat.id} className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                          <button 
                            onClick={() => setSelectedParentId(cat.id)}
                            disabled={index === selectionPath.length - 1}
                            className={cn(
                              "hover:text-accent transition-colors",
                              index === selectionPath.length - 1 ? "font-bold text-slate-900 cursor-default" : "hover:underline"
                            )}
                          >
                            {cat.name}
                          </button>
                        </div>
                      ))}
                    </nav>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedParentId(null)} className="text-slate-500 hover:bg-slate-200">
                      Close
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800">
                      Subcategories of <span className="text-accent underline underline-offset-4">{selectedParent?.name}</span>
                    </h2>
                    <span className="text-sm text-slate-500 font-normal hidden sm:inline">Drag to reorder within this group</span>
                  </div>
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
          </>
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
