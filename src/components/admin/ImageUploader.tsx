'use client'

import { useState } from 'react'
import { X, Star, Image as ImageIcon } from 'lucide-react'
import {
  createImageRecord,
  deleteImage,
  setPrimaryImage,
  reorderImages,
} from '@/lib/actions/image-actions'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ProductImage } from '@/types'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

interface ImageUploaderProps {
  productId: string
  initialImages?: ProductImage[]
}

function SortableImage({
  image,
  onDelete,
  onSetPrimary,
}: {
  image: ProductImage
  onDelete: (id: string) => void
  onSetPrimary: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square flex items-center justify-center"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      />

      <img
        src={image.url}
        alt={image.altText || ''}
        className="object-cover w-full h-full pointer-events-none"
      />

      {/* Actions Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          type="button"
          onClick={() => onSetPrimary(image.id)}
          className={`p-1 rounded-md bg-white/20 hover:bg-white/40 backdrop-blur-sm ${
            image.isPrimary ? 'text-yellow-400 opacity-100' : 'text-white'
          }`}
        >
          <Star
            className={`w-4 h-4 ${image.isPrimary ? 'fill-current' : ''}`}
          />
        </button>
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          className="p-1 rounded-md bg-white/20 hover:bg-red-500/80 hover:text-white backdrop-blur-sm text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {image.isPrimary && (
        <div className="absolute top-2 left-2 z-20 p-1 bg-white rounded-md shadow-sm border border-slate-200 pointer-events-none">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
        </div>
      )}
    </div>
  )
}

export function ImageUploader({
  productId,
  initialImages = [],
}: ImageUploaderProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_SIZE) {
      setError('File is too large. Max size is 5MB.')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // ✅ Step 1: Upload to R2 via our API route
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', `products/${productId}`)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      // ✅ Step 2: Save the record in the database
      const recordRes = await createImageRecord(productId, {
        url: uploadData.url,             // R2 public URL
        storagePath: uploadData.key,     // R2 key for deletion
        altText: file.name,
      })

      if (!recordRes.success || !recordRes.data) {
        throw new Error(recordRes.error || 'Failed to save image record')
      }

      // ✅ Step 3: Update local state
      setImages([...images, recordRes.data as ProductImage])
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    const res = await deleteImage(id)
    if (res.success) {
      setImages(images.filter((img) => img.id !== id))
    }
  }

  const handleSetPrimary = async (id: string) => {
    setImages(images.map((img) => ({ ...img, isPrimary: img.id === id })))
    await setPrimaryImage(id)
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setImages((items) => {
      const oldIndex = items.findIndex((t) => t.id === active.id)
      const newIndex = items.findIndex((t) => t.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)

      reorderImages(
        productId,
        newItems.map((i) => i.id)
      )
      return newItems
    })
  }

  if (!productId) {
    return (
      <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-sm">
        Save the product first to enable image uploads.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((i) => i.id)}
            strategy={horizontalListSortingStrategy}
          >
            {images.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onDelete={handleDelete}
                onSetPrimary={handleSetPrimary}
              />
            ))}
          </SortableContext>
        </DndContext>

        <label className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-slate-100 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <span className="text-sm text-slate-500 font-medium">
              Uploading...
            </span>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs font-semibold">Max 5MB</span>
            </div>
          )}
        </label>
      </div>
    </div>
  )
}