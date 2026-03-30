import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Cozy Corner',
  description: 'Manage products and categories for Cozy Corner Store.',
}

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      <AdminSidebar className="w-full md:w-64 flex-shrink-0 md:min-h-screen border-r border-slate-200" />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader className="h-16 flex-shrink-0 border-b border-slate-200" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
