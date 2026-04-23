'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
  className?: string
  onMenuClick?: () => void
}

export function AdminHeader({ className, onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()

  // Don't show header on login page
  if (pathname === '/admin/login') return null

  let title = 'Dashboard'
  if (pathname.startsWith('/admin/categories')) title = 'Categories'
  if (pathname.startsWith('/admin/products')) title = 'Products'

  return (
    <header className={cn('bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-30', className)}>
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold border border-pink-200">
            A
          </div>
          <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">Admin User</span>
        </div>
      </div>
    </header>
  )
}
