// src/components/admin/SingleImageUploader.tsx

'use client'

import { useState } from 'react'
import { X, Image as ImageIcon, Upload } from 'lucide-react'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

interface SingleImageUploaderProps {
  folder: string
  currentImageUrl?: string | null
  currentStoragePath?: string | null
  onImageChange: (image: { url: string; key: string } | null) => void
}

export function SingleImageUploader({
  folder,
  currentImageUrl,
  currentStoragePath,
  onImageChange,
}: SingleImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_SIZE) {
      setError('File is too large. Max size is 5MB.')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP are allowed.')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // If there's an existing image, delete it from R2 first
      if (currentStoragePath) {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: currentStoragePath }),
        })
      }

      // Upload new image to R2
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setPreview(data.url)
      onImageChange({ url: data.url, key: data.key })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleRemove = async () => {
    // Delete from R2 if there's a storage path
    const pathToDelete = currentStoragePath
    if (pathToDelete) {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: pathToDelete }),
      })
    }

    setPreview(null)
    onImageChange(null)
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {preview ? (
        // Show current image with remove button
        <div className="relative group w-48 h-48 rounded-xl overflow-hidden border border-slate-200">
          <img
            src={preview}
            alt="Category"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Replace button */}
          <label className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-2 bg-white/90 rounded-lg hover:bg-white shadow-sm">
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Upload className="w-4 h-4 text-slate-600" />
          </label>
        </div>
      ) : (
        // Show upload placeholder
        <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
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
              <span className="text-xs font-semibold">Upload Image</span>
              <span className="text-xs">Max 5MB</span>
            </div>
          )}
        </label>
      )}
    </div>
  )
}