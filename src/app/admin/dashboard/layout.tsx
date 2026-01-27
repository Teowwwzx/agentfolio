import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, LogOut, Shield } from 'lucide-react'

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getAdminSession()
    if (!session) {
        redirect('/admin/auth/login')
    }

    async function handleLogout() {
        'use server'
        const { logoutAdmin } = await import('@/lib/auth')
        await logoutAdmin()
        redirect('/admin/auth/login')
    }

    return (
        <div className="flex min-h-screen bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 shadow-xl">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-yellow-400" />
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">AgentFolio</p>
                </div>

                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Overview</span>
                    </Link>

                    <Link
                        href="/admin/dashboard/agents"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition"
                    >
                        <Users className="w-5 h-5" />
                        <span>Agents</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
                    <div className="mb-3">
                        <p className="text-sm font-medium text-white">{session.user.name}</p>
                        <p className="text-xs text-gray-400">{session.user.email}</p>
                    </div>
                    <form action={handleLogout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
                {children}
            </main>
        </div>
    )
}
