import { useState } from 'react'
import { Plus, X, GripVertical, Copy } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { ProductVariant } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Note: In a real app we'd use react-hook-form field arrays, but for this component
// manipulating internal state and relying on a hidden JSON input or parsing form data is easier to integrate
// keeping it compatible with standard FormData submissions

interface VariantManagerProps {
  initialVariants?: ProductVariant[]
}

// Generate temp id for new variants so we can key them
const generateId = () => Math.random().toString(36).substr(2, 9)

function SortableVariantRow({
  variant,
  onUpdate,
  onRemove,
  onDuplicate
}: {
  variant: ProductVariant
  onUpdate: (id: string, field: keyof ProductVariant, value: any) => void
  onRemove: (id: string) => void
  onDuplicate: (variant: ProductVariant) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: variant.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? 'relative' as const : 'static' as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl transition-shadow ${isDragging ? 'shadow-lg border-slate-300' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-slate-600 self-center">
        <GripVertical className="w-5 h-5 text-slate-400" />
      </div>
      
      <div className="flex-1 min-w-[120px]">
        <label className="text-xs text-slate-500 mb-1 block">SKU *</label>
        <Input 
          value={variant.sku} 
          onChange={e => onUpdate(variant.id, 'sku', e.target.value)} 
          placeholder="e.g. TSHIRT-RED-M"
          required
        />
      </div>
      <div className="w-24">
        <label className="text-xs text-slate-500 mb-1 block">Size</label>
        <Input 
          value={variant.size || ''} 
          onChange={e => onUpdate(variant.id, 'size', e.target.value)} 
          placeholder="M, L, XL"
        />
      </div>
      <div className="w-32">
        <label className="text-xs text-slate-500 mb-1 block">Color</label>
        <Input 
          value={variant.color || ''} 
          onChange={e => onUpdate(variant.id, 'color', e.target.value)} 
          placeholder="Red"
        />
      </div>
      <div className="w-auto flex-none">
        <label className="text-xs text-slate-500 mb-1 block">Hex</label>
        <div className="flex items-center gap-1">
          <div className="h-10 w-10 rounded-md border border-slate-200 overflow-hidden shrink-0">
            <input 
              type="color" 
              list="recent-colors"
              value={variant.colorHex || '#000000'}
              onChange={e => onUpdate(variant.id, 'colorHex', e.target.value)}
              className="w-full h-full cursor-pointer p-0 border-0"
            />
          </div>
          {variant.secondaryColorHex ? (
            <div className="relative shrink-0 flex">
              <div className="h-10 w-10 rounded-md border border-slate-200 overflow-hidden">
                <input 
                  type="color" 
                  list="recent-colors"
                  value={variant.secondaryColorHex}
                  onChange={e => onUpdate(variant.id, 'secondaryColorHex', e.target.value)}
                  className="w-full h-full cursor-pointer p-0 border-0"
                />
              </div>
              <button 
                type="button" 
                className="absolute -top-1.5 -right-1.5 bg-slate-200 text-slate-600 rounded-full p-0.5 shadow-sm hover:bg-red-500 hover:text-white transition-colors z-10"
                onClick={() => onUpdate(variant.id, 'secondaryColorHex', null)}
                title="Remove secondary color"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="h-10 w-10 flex items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-colors shrink-0"
              onClick={() => onUpdate(variant.id, 'secondaryColorHex', '#ffffff')}
              title="Add secondary color"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center pt-5 pl-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm mb-0">
          <input 
            type="checkbox" 
            checked={variant.isAvailable}
            onChange={e => onUpdate(variant.id, 'isAvailable', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
          />
          <span>Active</span>
        </label>
      </div>
      <div className="pt-4 ml-auto flex gap-1 items-center">
        <Button type="button" variant="outline" size="sm" onClick={() => onDuplicate(variant)} className="border-slate-200 text-slate-500 hover:bg-slate-50" title="Duplicate Variant">
          <Copy className="w-4 h-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onRemove(variant.id)} className="border-red-200 text-red-500 hover:bg-red-50" title="Remove Variant">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function VariantManager({ initialVariants = [] }: VariantManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(() => {
    return initialVariants.length > 0 ? initialVariants : []
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = variants.findIndex((v) => v.id === active.id)
      const newIndex = variants.findIndex((v) => v.id === over.id)
      setVariants(arrayMove(variants, oldIndex, newIndex))
    }
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `temp_${generateId()}`,
        productId: '',
        color: '',
        colorHex: '#000000',
        size: '',
        sku: '',
        isAvailable: true,
      } as unknown as ProductVariant
    ])
  }

  const duplicateVariant = (variant: ProductVariant) => {
    setVariants([
      ...variants,
      {
        ...variant,
        id: `temp_${generateId()}`,
        sku: `${variant.sku}-COPY`
      }
    ])
  }

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const recentColors = Array.from(
    new Set(variants.flatMap(v => [v.colorHex, v.secondaryColorHex]).filter(Boolean))
  ) as string[]
  
  const addVariantWithColor = (colorHex: string) => {
    setVariants([
      ...variants,
      {
        id: `temp_${generateId()}`,
        productId: '',
        color: '',
        colorHex,
        size: '',
        sku: '',
        isAvailable: true,
      } as unknown as ProductVariant
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-slate-700">Product Variants</h3>
          {recentColors.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 mr-1">Recent:</span>
              {recentColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => addVariantWithColor(color as string)}
                  className="w-5 h-5 rounded-full border border-slate-200 shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color as string }}
                  title={`Add variant with color ${color}`}
                />
              ))}
            </div>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addVariant} className="text-xs flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Variant
        </Button>
      </div>
      
      {/* Hidden input to pass the entire variants array as JSON in the form data */}
      <input type="hidden" name="variantsPayload" value={JSON.stringify(variants)} />

      <datalist id="recent-colors">
        {recentColors.map(color => (
          <option key={color} value={color} />
        ))}
      </datalist>

      {variants.length === 0 ? (
        <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
          No variants added. This product will be treated as a single-option item.
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={variants.map(v => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {variants.map((variant) => (
                <SortableVariantRow
                  key={variant.id}
                  variant={variant}
                  onUpdate={updateVariant}
                  onRemove={removeVariant}
                  onDuplicate={duplicateVariant}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
