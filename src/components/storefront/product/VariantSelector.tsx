'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface VariantGroup {
  id: string; // "color" or "size"
  label: string;
  options: {
    value: string;
    isAvailable: boolean;
    colorHex?: string | null;
  }[];
}

interface VariantSelectorProps {
  groups: VariantGroup[];
}

export function VariantSelector({ groups }: VariantSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSelect = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    
    // If clicking the already selected value, deselect it
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (groups.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-900 uppercase tracking-widest">
            {group.label}
          </span>
          <div className="flex flex-wrap gap-3">
            {group.options.map((option) => {
              const isActive = searchParams.get(group.id) === option.value
              
              if (group.id === 'color') {
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(group.id, option.value)}
                    disabled={!option.isAvailable}
                    className={twMerge(
                      "w-12 h-12 rounded-full border-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900",
                      isActive ? "border-slate-900 scale-110 shadow-md" : "border-slate-200 hover:border-slate-400 cursor-pointer",
                      !option.isAvailable && "opacity-30 cursor-not-allowed hover:border-slate-200"
                    )}
                    style={{ backgroundColor: option.colorHex || option.value.toLowerCase() }}
                    title={`${option.value}${!option.isAvailable ? ' - Out of Stock' : ''}`}
                    aria-label={`Select color ${option.value}`}
                  >
                    {!option.isAvailable && (
                       <span className="block w-full h-[1px] bg-slate-500 origin-center -rotate-45 relative top-1/2 left-0 transform"></span>
                    )}
                  </button>
                )
              }

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(group.id, option.value)}
                  disabled={!option.isAvailable}
                  className={twMerge(
                    "min-w-[3.5rem] h-12 px-5 rounded-lg border text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 cursor-pointer flex items-center justify-center",
                    isActive 
                      ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50",
                    !option.isAvailable && "opacity-50 cursor-not-allowed hover:bg-white hover:border-slate-200 bg-slate-50 text-slate-400"
                  )}
                  title={!option.isAvailable ? 'Out of Stock' : ''}
                >
                  <span className={twMerge(!option.isAvailable && "relative after:content-[''] after:absolute after:top-1/2 after:left-[-10%] after:w-[120%] after:h-[1px] after:bg-slate-400 after:-rotate-12")}>
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
