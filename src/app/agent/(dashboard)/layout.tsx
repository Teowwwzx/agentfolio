import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AgentSidebar } from '@/components/agent/AgentSidebar'

export default async function AgentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }

    // Ensure user object matches expected structure
    const user = {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar / Navigation */}
            <AgentSidebar user={user} />

            {/* Main Content Area */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
