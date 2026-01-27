import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Users, Home, ShieldCheck, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const session = await getAdminSession()
    if (!session) {
        redirect('/admin/auth/login')
    }

    // Get platform statistics
    const [totalAgents, activeAgents, totalListings, activeListings] = await Promise.all([
        prisma.users.count({ where: { role: 'agent' } }),
        prisma.users.count({ where: { role: 'agent', status: 'active' } }),
        prisma.listings.count(),
        prisma.listings.count({ where: { status: 'active' } }),
    ])

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
                <p className="text-gray-600 mt-1">Monitor your AgentFolio platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Agents"
                    value={totalAgents}
                    icon={<Users className="w-6 h-6" />}
                    color="blue"
                    href="/admin/dashboard/agents"
                />
                <StatCard
                    title="Active Agents"
                    value={activeAgents}
                    icon={<Activity className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Total Listings"
                    value={totalListings}
                    icon={<Home className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title="Active Listings"
                    value={activeListings}
                    icon={<ShieldCheck className="w-6 h-6" />}
                    color="orange"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickActionCard
                    title="Manage Agents"
                    description="Create, edit, or deactivate agent accounts"
                    href="/admin/dashboard/agents"
                    icon={<Users className="w-8 h-8" />}
                />
                <QuickActionCard
                    title="Platform Settings"
                    description="Configure platform-wide settings and options"
                    href="/admin/dashboard/settings"
                    icon={<ShieldCheck className="w-8 h-8" />}
                />
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color, href }: {
    title: string
    value: number
    icon: React.ReactNode
    color: 'blue' | 'green' | 'purple' | 'orange'
    href?: string
}) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
    }

    const content = (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }

    return content
}

function QuickActionCard({ title, description, href, icon }: {
    title: string
    description: string
    href: string
    icon: React.ReactNode
}) {
    return (
        <Link href={href}>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition border border-transparent hover:border-blue-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
                        <p className="text-gray-600">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
