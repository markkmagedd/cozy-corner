'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import { ProductVariant } from '@/types'
import { 
  extractUniqueColors, 
  extractUniqueSizes, 
  buildAvailabilityMatrix, 
  getOptionAvailability, 
  resolveConflict 
} from '@/lib/variant-utils'

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedColor: string | null;
  selectedSize: string | null;
  allOutOfStock?: boolean;
}

export function VariantSelector({ variants, selectedColor, selectedSize, allOutOfStock }: VariantSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSelect = (key: string, value: string) => {
    if (allOutOfStock) return
    const params = new URLSearchParams(searchParams)
    
    // If clicking the already selected value, do nothing
    if (params.get(key) === value) return
    
    params.set(key, value)

    // Conflict resolution: auto-switch the other dimension if needed
    const otherKey = key === 'color' ? 'size' : 'color'
    const otherValue = params.get(otherKey)
    
    const resolvedOtherValue = resolveConflict(
      variants,
      key as 'color' | 'size',
      value,
      otherKey as 'color' | 'size',
      otherValue
    )

    if (resolvedOtherValue && resolvedOtherValue !== otherValue) {
      params.set(otherKey, resolvedOtherValue)
    } else if (!resolvedOtherValue && otherValue) {
      // Should technically not happen if any variants exist, but for safety:
      params.delete(otherKey)
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const colors = extractUniqueColors(variants)
  const sizes = extractUniqueSizes(variants)
  const matrix = buildAvailabilityMatrix(variants)

  const groups = []
  if (colors.length > 0) {
    groups.push({
      id: 'color',
      label: 'Color Options',
      options: colors
    })
  }
  if (sizes.length > 0) {
    groups.push({
      id: 'size',
      label: 'Size Options',
      options: sizes
    })
  }

  if (groups.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {allOutOfStock && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm font-medium text-red-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            This product is currently out of stock.
          </p>
        </div>
      )}

      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-900 uppercase tracking-widest">
            {group.label}
          </span>
          <div className="flex flex-wrap gap-3">
            {group.options.map((option) => {
              const isActive = (group.id === 'color' ? selectedColor : selectedSize) === option.value
              
              const state = allOutOfStock ? 'oos' : getOptionAvailability(
                variants,
                matrix,
                group.id as 'color' | 'size',
                option.value,
                group.id === 'color' ? selectedSize : selectedColor
              )

              const isDisabled = state === 'disabled'
              const isOos = state === 'oos'
              
              if (group.id === 'color') {
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(group.id, option.value)}
                    disabled={isOos || allOutOfStock}
                    className={twMerge(
                      "w-12 h-12 rounded-full border-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900",
                      isActive ? "border-slate-900 scale-110 shadow-md" : "border-slate-200 hover:border-slate-400 cursor-pointer",
                      isDisabled && "opacity-40 cursor-pointer",
                      isOos && "opacity-20 cursor-not-allowed hover:border-slate-200",
                      allOutOfStock && "cursor-not-allowed"
                    )}
                    style={{ backgroundColor: (option as { colorHex?: string | null }).colorHex || option.value.toLowerCase() }}
                    title={
                      allOutOfStock || isOos ? `${option.value} - Out of Stock` : 
                      isDisabled ? `${option.value} - Not available in selected ${group.id === 'color' ? 'size' : 'color'}` : 
                      option.value
                    }
                    aria-label={`Select color ${option.value}`}
                  >
                    {(isOos || allOutOfStock) && (
                       <span className="block w-full h-[1px] bg-slate-500 origin-center -rotate-45 relative top-1/2 left-0 transform"></span>
                    )}
                  </button>
                )
              }

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(group.id, option.value)}
                  disabled={isOos || allOutOfStock}
                  className={twMerge(
                    "min-w-[3.5rem] h-12 px-5 rounded-lg border text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 cursor-pointer flex items-center justify-center",
                    isActive 
                      ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50",
                    isDisabled && "opacity-40",
                    (isOos || allOutOfStock) && "opacity-20 cursor-not-allowed hover:bg-white hover:border-slate-200 bg-slate-50 text-slate-400"
                  )}
                  title={
                    allOutOfStock || isOos ? 'Out of Stock' : 
                    isDisabled ? `Not available in selected ${group.id === 'color' ? 'size' : 'color'}` : 
                    ''
                  }
                >
                  <span className={twMerge((isOos || allOutOfStock) && "relative after:content-[''] after:absolute after:top-1/2 after:left-[-10%] after:w-[120%] after:h-[1px] after:bg-slate-400 after:-rotate-12")}>
                     {option.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
