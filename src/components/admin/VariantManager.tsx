import { useState } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
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
  onRemove
}: {
  variant: ProductVariant
  onUpdate: (id: string, field: keyof ProductVariant, value: any) => void
  onRemove: (id: string) => void
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
      <div className="w-16">
        <label className="text-xs text-slate-500 mb-1 block">Hex</label>
        <div className="h-10 rounded-md border border-slate-200 overflow-hidden flex">
          <input 
            type="color" 
            value={variant.colorHex || '#000000'}
            onChange={e => onUpdate(variant.id, 'colorHex', e.target.value)}
            className="w-full h-full cursor-pointer p-0 border-0"
          />
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
      <div className="pt-4 ml-auto">
        <Button type="button" variant="outline" size="sm" onClick={() => onRemove(variant.id)} className="border-red-200 text-red-500 hover:bg-red-50">
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

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-700">Product Variants</h3>
        <Button type="button" variant="outline" size="sm" onClick={addVariant} className="text-xs flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Variant
        </Button>
      </div>
      
      {/* Hidden input to pass the entire variants array as JSON in the form data */}
      <input type="hidden" name="variantsPayload" value={JSON.stringify(variants)} />

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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
