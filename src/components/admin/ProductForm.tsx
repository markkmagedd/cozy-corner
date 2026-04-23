'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { VariantManager } from './VariantManager'
import { ImageUploader } from './ImageUploader'
import type { Product, Category, ActionResult } from '@/types'

interface ProductFormProps {
  initialData?: Product | null
  categories: Category[]
  action: (formData: FormData) => Promise<ActionResult<Product>>
}

export function ProductForm({ initialData, categories, action }: ProductFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const categoryOptions = [
    { value: '', label: 'Select a Category' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await action(formData)
      if (result.success) {
        router.push('/admin/products')
        router.refresh()
      } else {
        setError(result.error || 'Failed to save product')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      {/* Main Details Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Basic Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">
              Product Name *
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name || ''}
              required
              placeholder="e.g. Linen Throw Blanket"
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ''}
              rows={4}
              className="w-full flex rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              placeholder="Full product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="price">
              Current Selling Price (EUR) *
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initialData?.price || 0}
              required
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">This is the price the customer actually pays.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="compareAtPrice">
              Original Price / Compare at Price (EUR)
            </label>
            <Input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initialData?.compareAtPrice || ''}
              placeholder="e.g. 100.00"
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">Leave empty if no discount. This will be shown crossed out.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="brand">
              Brand
            </label>
            <Input
              id="brand"
              name="brand"
              defaultValue={initialData?.brand || ''}
              placeholder="e.g. Cozy Corner Home"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="categoryId">
              Category
            </label>
            <Select name="categoryId" defaultValue={initialData?.categoryId || ''}>
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col justify-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
              <input 
                type="checkbox" 
                name="isActive"
                defaultChecked={initialData === null ? true : initialData?.isActive}
                className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
              />
              <span>Active (Visible on Storefront)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Variants</h2>
        <VariantManager initialVariants={initialData?.variants || []} />
      </div>

      {/* Images Section */}
      <div className="pt-4">
         <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Product Images</h2>
         <ImageUploader productId={initialData?.id || ''} initialImages={initialData?.images || []} />
      </div>

      <div className="pt-6 flex items-center justify-end gap-3 justify-between border-t border-slate-100">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/admin/products')}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? 'Saving Product...' : (initialData ? 'Update Product' : 'Create Product')}
        </Button>
      </div>
    </form>
  )
}
