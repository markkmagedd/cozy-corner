"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalPages: number
}

export function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get("page")) || 1

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1
        const isActive = page === currentPage
        
        // Simple window for pagination
        if (totalPages > 5) {
          if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
            if (page === 2 || page === totalPages - 1) {
               return <span key={page} className="px-2">...</span>
            }
            return null
          }
        }

        return (
          <Button
            key={page}
            variant={isActive ? "default" : "outline"}
            className={isActive ? "" : "hidden md:inline-flex"}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
