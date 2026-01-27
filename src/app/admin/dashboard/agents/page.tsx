import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllAgents } from '@/actions/admin'
import { AgentTable } from '@/components/admin/AgentTable'
import Link from 'next/link'

export default async function AdminAgentsPage() {
    const session = await getAdminSession()
    if (!session) {
        redirect('/admin/auth/login')
    }

    const agents = await getAllAgents()

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Agent Management</h1>
                <Link
                    href="/admin/dashboard/agents/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create Agent
                </Link>
            </div>

            <AgentTable agents={agents} />
        </div>
    )
}
