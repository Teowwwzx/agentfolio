import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Home, Tag, Users, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export default async function AgentDashboard() {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }

    const userId = session.user.id

    // Get agent statistics
    const [totalListings, activeListings, totalBanners, activeBanners] = await Promise.all([
        prisma.listings.count({ where: { user_id: userId } }),
        prisma.listings.count({ where: { user_id: userId, status: 'active' } }),
        prisma.banners.count({ where: { user_id: userId } }),
        prisma.banners.count({ where: { user_id: userId, is_active: true } }),
    ])

    // Get recent listings
    const recentListings = await prisma.listings.findMany({
        where: { user_id: userId },
        select: {
            id: true,
            title: true,
            price: true,
            status: true,
            created_at: true
        },
        orderBy: { created_at: 'desc' },
        take: 5
    })

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
                <p className="text-gray-600 mt-1">Here's an overview of your portfolio</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Listings"
                    value={totalListings}
                    icon={<Home className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Active Listings"
                    value={activeListings}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Total Banners"
                    value={totalBanners}
                    icon={<Tag className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title="Active Banners"
                    value={activeBanners}
                    icon={<Users className="w-6 h-6" />}
                    color="orange"
                />
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Recent Listings</h2>
                {recentListings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No listings yet. Create your first listing!</p>
                ) : (
                    <div className="space-y-3">
                        {recentListings.map((listing) => (
                            <div key={listing.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                <div>
                                    <h3 className="font-medium text-gray-900">{listing.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {formatCurrency(listing.price ? Number(listing.price) : null)} • {listing.created_at.toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${listing.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {listing.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color }: {
    title: string
    value: number
    icon: React.ReactNode
    color: 'blue' | 'green' | 'purple' | 'orange'
}) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
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
}
