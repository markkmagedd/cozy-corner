"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/Input"
import Link from "next/link"
import { Product } from "@/types"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`)
          const data = await res.json()
          setResults(data.results || [])
          setIsOpen(true)
        } catch (error) {
          console.error(error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300) // Debounce

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-9 bg-slate-100 border-transparent focus-visible:bg-white focus-visible:ring-accent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden z-50">
          <ul className="max-h-96 overflow-y-auto">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className="block px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="font-medium text-slate-900 line-clamp-1">{product.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{product.brand || 'No Brand'}</div>
                </Link>
              </li>
            ))}
          </ul>
          <Link 
            href={`/?search=${encodeURIComponent(query)}`}
            className="block px-4 py-3 text-sm text-center font-medium text-accent bg-slate-50 hover:bg-slate-100"
            onClick={() => setIsOpen(false)}
          >
            View all results
          </Link>
        </div>
      )}
    </div>
  )
}
