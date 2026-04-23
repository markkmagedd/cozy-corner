import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Cozy Corner',
  description: 'Manage products and categories for Cozy Corner Store.',
}

import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  )
}
