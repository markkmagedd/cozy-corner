'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Folders, LogOut, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/lib/actions/auth-actions'

interface AdminSidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Categories', icon: Folders },
  { href: '/admin/products', label: 'Products', icon: Package },
]

export function AdminSidebar({ className, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  // Don't show sidebar on login page
  if (pathname === '/admin/login') return null

  return (
    <aside className={cn(
      'bg-white flex flex-col transition-all duration-300 ease-in-out z-50',
      'fixed inset-y-0 left-0 w-72 md:relative md:w-64 md:translate-x-0',
      isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
      className
    )}>
      <div className="p-6 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-slate-900" onClick={onClose}>
          <Package className="w-6 h-6 text-pink-600" />
          Cozy Corner Admin
        </Link>
        <button 
          onClick={onClose}
          className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-pink-50 text-pink-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-pink-600' : 'text-slate-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 mt-auto">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
