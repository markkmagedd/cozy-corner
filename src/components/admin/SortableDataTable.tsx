'use client'

import { useState, startTransition, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { PaginatedResponse, TableColumn } from '@/types'
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

interface SortableDataTableProps<T> {
  data: PaginatedResponse<T>
  columns: TableColumn<T>[]
  searchPlaceholder?: string
  onReorder?: (items: T[]) => void
}

function SortableRow<T extends { id: string }>({ 
  row, 
  columns, 
  isDragEnabled 
}: { 
  row: T, 
  columns: TableColumn<T>[],
  isDragEnabled: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: row.id, disabled: !isDragEnabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? 'relative' as const : 'static' as const,
  }

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`bg-white hover:bg-slate-50 transition-colors ${isDragging ? 'shadow-lg border border-slate-300' : ''}`}
    >
      {isDragEnabled && (
        <td className="px-3 py-4 whitespace-nowrap text-left w-10">
          <div {...attributes} {...listeners} className="cursor-grab hover:text-accent">
            <GripVertical className="w-5 h-5 text-slate-400" />
          </div>
        </td>
      )}
      {columns.map((col, i) => (
        <td key={`${row.id}-${col.key as string || i}`} className="px-6 py-4 whitespace-nowrap text-left">
          {col.cell ? col.cell(row) : (col.key ? String(row[col.key as keyof T]) : null)}
        </td>
      ))}
    </tr>
  )
}

export function SortableDataTable<T extends { id: string }>({ 
  data, 
  columns, 
  searchPlaceholder = 'Search...',
  onReorder 
}: SortableDataTableProps<T>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('q') || ''
  
  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [items, setItems] = useState<T[]>(data.items)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Reset items when data changes
  useState(() => {
    setItems(data.items)
  })

  // Determine if drag is enabled (only on first page, no search)
  const isFirstPage = !searchParams.get('page') || searchParams.get('page') === '1'
  const hasNoSearch = !currentSearch
  const isDragEnabled = !!onReorder && isFirstPage && hasNoSearch

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('q', searchTerm)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // reset page on search
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      
      if (onReorder) {
        startTransition(() => {
          onReorder(newItems)
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full">
          <div className="relative w-full">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input 
                className="pl-10" 
                placeholder={searchPlaceholder} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </div>

      <div className="bg-white border text-slate-800 border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-sm text-left align-middle border-collapse table-auto text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 text-left">
                <tr>
                  {isDragEnabled && mounted && <th className="px-3 py-4 w-10"></th>}
                  {columns.map((col, i) => (
                    <th key={col.key as string || i} className="px-6 py-4 font-semibold text-left">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-left">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (isDragEnabled && mounted ? 1 : 0)} className="px-6 py-8 text-center text-slate-500">
                      No results found
                    </td>
                  </tr>
                ) : (
                  <SortableContext 
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((row) => (
                      <SortableRow 
                        key={row.id} 
                        row={row} 
                        columns={columns} 
                        isDragEnabled={isDragEnabled && mounted} 
                      />
                    ))}
                  </SortableContext>
                )}
              </tbody>
            </table>
          </DndContext>
        </div>
        
        {data.pagination && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center gap-4 justify-between border-t border-slate-200 bg-slate-50 text-slate-700">
            <div className="text-sm">
              Page <span className="font-semibold">{data.pagination.page}</span> of <span className="font-semibold text-slate-900">{data.pagination.totalPages}</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(data.pagination!.page - 1)}
                disabled={data.pagination.page <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(data.pagination!.page + 1)}
                disabled={data.pagination.page >= data.pagination.totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
