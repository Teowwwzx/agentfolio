import { getSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  // Ensure role exists (fallback for old sessions)
  const user = {
    ...session.user,
    role: session.user.role || 'agent'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar / Navigation */}
      <AdminSidebar user={user} />

      {/* Main Content Area */}
      <main className="md:pl-64 pt-16 md:pt-0">
        <div className="container mx-auto max-w-6xl p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}