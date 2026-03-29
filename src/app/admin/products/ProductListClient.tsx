'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/admin/DataTable'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { deleteProduct, toggleProductActive } from '@/lib/actions/product-actions'
import { formatPrice } from '@/lib/utils'
import type { Product, TableColumn, PaginatedResponse } from '@/types'

interface ProductListClientProps {
  data: PaginatedResponse<Product>
}

export function ProductListClient({ data }: ProductListClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>('')
  const [isToggling, setIsToggling] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    await deleteProduct(deleteId)
    setDeleteId(null)
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
        <DataTable data={data} columns={columns} searchPlaceholder="Search products by name or brand..." />
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
