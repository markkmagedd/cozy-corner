'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SortableDataTable } from '@/components/admin/SortableDataTable'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { deleteProduct, toggleProductActive, updateProductOrder } from '@/lib/actions/product-actions'
import { formatPrice } from '@/lib/utils'
import type { Product, TableColumn, PaginatedResponse, Category } from '@/types'

interface ProductListClientProps {
  data: PaginatedResponse<Product> & {
    categories?: Partial<Category>[]
  }
}

export function ProductListClient({ data }: ProductListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>('')
  const [isToggling, setIsToggling] = useState<string | null>(null)
  
  const selectedCategoryId = searchParams.get('categoryId') || ''

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value
    const params = new URLSearchParams(searchParams)
    if (newCategoryId) {
      params.set('categoryId', newCategoryId)
    } else {
      params.delete('categoryId')
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    await deleteProduct(deleteId)
    setDeleteId(null)
  }

  const handleReorder = async (reorderedItems: Product[]) => {
    const payload = reorderedItems.map((item, index) => ({
      id: item.id,
      displayOrder: index - reorderedItems.length // Negative numbers guarantee they float above default 0
    }))
    await updateProductOrder(payload)
  }

  const handleToggleActive = async (id: string) => {
    setIsToggling(id)
    await toggleProductActive(id)
    setIsToggling(null)
  }

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      cell: (p) => (
        <div>
          <span className="font-semibold text-slate-800">{p.name}</span>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            {p.brand && <span>{p.brand}</span>}
            {p.brand && p.category && <span className="text-slate-300">•</span>}
            {p.category && <span>{p.category.name}</span>}
          </div>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price',
      cell: (p) => <span className="font-medium text-slate-700">{formatPrice(Number(p.price))}</span>
    },
    {
      header: 'Variants',
      cell: (p) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
           <Tag className="w-3 h-3 mr-1" />
           {p.variants?.length || 0}
        </span>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      cell: (p) => (
        <button
          onClick={() => handleToggleActive(p.id)}
          disabled={isToggling === p.id}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
            p.isActive 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {isToggling === p.id ? '...' : (p.isActive ? 'Active' : 'Draft')}
        </button>
      )
    },
    {
      header: 'Actions',
      cell: (p) => (
        <div className="flex gap-2">
          <Link href={`/admin/products/${p.id}/edit`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit Product">
              <Pencil className="w-4 h-4 text-slate-600" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:text-red-600" 
            onClick={() => {
              setDeleteId(p.id)
              setDeleteName(p.name)
            }}
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  const enrichedCategories = data.categories?.map((cat) => {
    let path = cat.name || ''
    let current = cat
    // Prevent infinite loops just in case of circular references
    let depth = 0
    while (current.parentId && depth < 10) {
      const parent = data.categories?.find((c) => c.id === current.parentId)
      if (parent) {
        path = `${parent.name} > ${path}`
        current = parent
        depth++
      } else {
        break
      }
    }
    return { ...cat, path }
  }).sort((a, b) => a.path.localeCompare(b.path)) || []

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-600 text-sm mt-1">Manage store products, variants and pricing</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="w-full">
        <SortableDataTable 
          data={data} 
          columns={columns} 
          searchPlaceholder="Search products by name or brand..." 
          onReorder={handleReorder} 
          filtersSlot={
            enrichedCategories.length > 0 ? (
              <select
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Categories</option>
                {enrichedCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.path}
                  </option>
                ))}
              </select>
            ) : null
          }
        />
      </div>

      <DeleteConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete"
        itemName={deleteName}
      />
    </div>
  )
}
