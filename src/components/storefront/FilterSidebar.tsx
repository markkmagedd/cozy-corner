"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Filter, X } from "lucide-react"

interface FilterSidebarProps {
  // Pass available filter options if known
}

export function FilterSidebar({}: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [brand, setBrand] = useState(searchParams.get("brand") || "")

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (minPrice) params.set("minPrice", minPrice)
    else params.delete("minPrice")
    
    if (maxPrice) params.set("maxPrice", maxPrice)
    else params.delete("maxPrice")
    
    if (brand) params.set("brand", brand)
    else params.delete("brand")
    
    params.delete("page") // Reset to page 1 on filter change
    
    router.push(`?${params.toString()}`)
    setIsOpen(false)
  }, [minPrice, maxPrice, brand, router, searchParams])

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("brand")
    params.delete("page")
    setMinPrice("")
    setMaxPrice("")
    setBrand("")
    router.push(`?${params.toString()}`)
    setIsOpen(false)
  }, [router, searchParams])

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="font-semibold text-lg">Filters</h3>
        {(minPrice || maxPrice || brand) && (
          <button onClick={clearFilters} className="text-sm text-accent hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm">Brand</h4>
        <Input 
          placeholder="e.g. Patagonia" 
          value={brand} 
          onChange={(e) => setBrand(e.target.value)} 
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            placeholder="Min" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)} 
            className="w-full"
          />
          <span className="text-slate-400">-</span>
          <Input 
            type="number" 
            placeholder="Max" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            className="w-full"
          />
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full bg-primary">
        Apply Filters
      </Button>
    </div>
  )

  return (
    <>
      <Button 
        variant="outline" 
        className="md:hidden w-full mb-4 flex items-center justify-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="w-4 h-4" /> Filters
      </Button>

      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24">
          {content}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-xl overflow-y-auto p-6 z-50 ml-auto flex flex-col">
            <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-slate-500" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  )
}
