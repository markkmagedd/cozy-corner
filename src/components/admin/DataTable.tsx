'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { PaginatedResponse, TableColumn } from '@/types'

interface DataTableProps<T> {
  data: PaginatedResponse<T>
  columns: TableColumn<T>[]
  searchPlaceholder?: string
}

export function DataTable<T extends { id: string }>({ data, columns, searchPlaceholder = 'Search...' }: DataTableProps<T>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('q') || ''
  
  const [searchTerm, setSearchTerm] = useState(currentSearch)

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
          <table className="w-full text-sm text-left align-middle border-collapse table-auto text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                {columns.map((col, i) => (
                  <th key={col.key as string || i} className="px-6 py-4 font-semibold text-left">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-left">
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                    No results found
                  </td>
                </tr>
              ) : (
                data.items.map((row) => (
                  <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors">
                    {columns.map((col, i) => (
                      <td key={`${row.id}-${col.key as string || i}`} className="px-6 py-4 whitespace-nowrap text-left">
                        {col.cell ? col.cell(row) : (col.key ? String(row[col.key as keyof T]) : null)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
