'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Folders, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/lib/actions/auth-actions'

interface AdminSidebarProps {
  className?: string
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Categories', icon: Folders },
  { href: '/admin/products', label: 'Products', icon: Package },
]

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  // Don't show sidebar on login page
  if (pathname === '/admin/login') return null

  return (
    <aside className={cn('bg-white flex flex-col', className)}>
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <Package className="w-6 h-6 text-pink-600" />
          Cozy Corner Admin
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
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
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
