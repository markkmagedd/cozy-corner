// src/components/admin/CategoryForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SingleImageUploader } from '@/components/admin/SingleImageUploader'
import type { Category, ActionResult } from '@/types'

interface CategoryFormProps {
  initialData?: Category | null
  categories: Category[]
  action: (formData: FormData) => Promise<ActionResult<Category>>
}

export function CategoryForm({ initialData, categories, action }: CategoryFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  // ✅ Track the image state
  const [imageData, setImageData] = useState<{
    url: string
    key: string
  } | null>(
    initialData?.imageUrl
      ? { url: initialData.imageUrl, key: initialData.imageStoragePath || '' }
      : null
  )

  const parentOptions = [
    { value: '', label: 'None (Top Level)' },
    ...categories
      .filter((c) => c.id !== initialData?.id)
      .map((c) => ({ value: c.id, label: c.name })),
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // ✅ Append image data to form
    if (imageData) {
      formData.set('imageUrl', imageData.url)
      formData.set('imageStoragePath', imageData.key)
    } else {
      formData.set('imageUrl', '')
      formData.set('imageStoragePath', '')
    }

    try {
      const result = await action(formData)
      if (result.success) {
        router.push('/admin/categories')
        router.refresh()
      } else {
        setError(result.error || 'Failed to save category')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200"
    >
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* ✅ Category Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category Image
          </label>
          <SingleImageUploader
            folder="categories"
            currentImageUrl={initialData?.imageUrl}
            currentStoragePath={initialData?.imageStoragePath}
            onImageChange={(image) => setImageData(image)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Recommended: Square image, at least 400x400px
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-700 mb-1"
            htmlFor="name"
          >
            Category Name
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name || ''}
            required
            placeholder="e.g. Bedding"
            className="w-full"
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-700 mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ''}
            rows={3}
            className="w-full flex min-h-[80px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Description of the category..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-semibold text-slate-700 mb-1"
              htmlFor="parentId"
            >
              Parent Category
            </label>
            <Select
              name="parentId"
              defaultValue={initialData?.parentId || ''}
            >
              {parentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-slate-700 mb-1"
              htmlFor="displayOrder"
            >
              Display Order
            </label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              defaultValue={initialData?.displayOrder || 0}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            defaultChecked={initialData?.isFeatured || false}
            className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-slate-700"
          >
            Feature this category on the storefront
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/categories')}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  )
}