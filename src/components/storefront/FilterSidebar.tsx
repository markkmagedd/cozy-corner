"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Filter, X, ChevronDown, Check, Loader2 } from "lucide-react"

interface FilterOptions {
  colors: { name: string; hex: string }[]
  sizes: string[]
  brands: string[]
}

interface FilterSidebarProps {
  options?: FilterOptions
}

export function FilterSidebar({ options }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Prices
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  // Multi-select states
  const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.getAll("brand"))
  const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.getAll("color"))
  const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.getAll("size"))

  // Synchronize state with URL on initial load or popstate
  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"))
    setSelectedColors(searchParams.getAll("color"))
    setSelectedSizes(searchParams.getAll("size"))
    setMinPrice(searchParams.get("minPrice") || "")
    setMaxPrice(searchParams.get("maxPrice") || "")
  }, [searchParams])

  const toggleFilter = (type: "brand" | "color" | "size", value: string) => {
    const setters = {
      brand: setSelectedBrands,
      color: setSelectedColors,
      size: setSelectedSizes,
    }
    const current = {
      brand: selectedBrands,
      color: selectedColors,
      size: selectedSizes,
    }

    const next = current[type].includes(value)
      ? current[type].filter(v => v !== value)
      : [...current[type], value]
    
    setters[type](next)
  }

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Clear existing
    params.delete("brand")
    params.delete("color")
    params.delete("size")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("page")

    // Set new
    selectedBrands.forEach(v => params.append("brand", v))
    selectedColors.forEach(v => params.append("color", v))
    selectedSizes.forEach(v => params.append("size", v))
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
      setIsOpen(false)
    })
  }, [selectedBrands, selectedColors, selectedSizes, minPrice, maxPrice, router, searchParams])

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("brand")
    params.delete("color")
    params.delete("size")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("page")
    
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedSizes([])
    setMinPrice("")
    setMaxPrice("")
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
      setIsOpen(false)
    })
  }, [router, searchParams])

  const hasSelectedFilters = selectedBrands.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || minPrice || maxPrice

  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h3 className="font-serif text-xl font-bold text-slate-900">Filters</h3>
        {hasSelectedFilters && (
          <button onClick={clearFilters} className="text-xs font-bold text-accent uppercase tracking-widest hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Brands */}
      {options?.brands && options.brands.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Brands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {options.brands.map(brand => (
              <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                    selectedBrands.includes(brand) 
                      ? 'bg-accent border-accent text-white' 
                      : 'border-slate-300 group-hover:border-accent'
                  }`}
                  onClick={() => toggleFilter("brand", brand)}
                >
                  {selectedBrands.includes(brand) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className={`text-sm ${selectedBrands.includes(brand) ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {options?.colors && options.colors.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Colors</h4>
          <div className="flex flex-wrap gap-3">
            {options.colors.map(color => (
              <button
                key={color.name}
                onClick={() => toggleFilter("color", color.name)}
                className={`group relative flex flex-col items-center gap-2`}
              >
                <div 
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColors.includes(color.name) 
                      ? 'border-accent p-1' 
                      : 'border-transparent group-hover:border-slate-200'
                  }`}
                >
                  <div className="w-full h-full rounded-full border border-black/5" style={{ backgroundColor: color.hex }} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${selectedColors.includes(color.name) ? 'text-accent' : 'text-slate-400'}`}>
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {options?.sizes && options.sizes.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sizes</h4>
          <div className="grid grid-cols-4 gap-2">
            {options.sizes.map(size => (
              <button
                key={size}
                onClick={() => toggleFilter("size", size)}
                className={`h-10 text-xs font-bold border transition-all rounded-lg flex items-center justify-center ${
                  selectedSizes.includes(size)
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-accent hover:text-accent'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Price Range</h4>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">€</span>
            <Input 
              type="number" 
              placeholder="Min" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)} 
              className="pl-7 h-10 text-sm border-slate-200 focus:border-accent transition-all"
            />
          </div>
          <span className="text-slate-300 font-bold">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">€</span>
            <Input 
              type="number" 
              placeholder="Max" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)} 
              className="pl-7 h-10 text-sm border-slate-200 focus:border-accent transition-all"
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={applyFilters} 
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        {isPending ? 'Applying...' : 'Apply Filters'}
      </Button>
    </div>
  )

  return (
    <>
      <Button 
        variant="outline" 
        className="md:hidden w-full mb-2 py-4 flex items-center justify-center gap-3 rounded-xl border-slate-200 bg-white shadow-sm font-bold"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="w-5 h-5 text-accent" /> Filter & Sort
      </Button>

      <div className="hidden md:block w-72 shrink-0">
        <div className="sticky top-24 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 backdrop-blur-sm">
          {content}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl overflow-y-auto p-8 z-[101] ml-auto flex flex-col animate-in slide-in-from-right duration-300">
            <button className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-slate-500" />
            </button>
            <div className="mt-8">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
