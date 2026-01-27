import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getAdminListings } from '@/actions/listings'
import { getListingOptions } from '@/actions/options'
import { ListingTable } from '@/components/admin/ListingTable'
import { Button } from '@/components/ui/button'
import { ArrowRight, Building2, Eye, MessageSquare, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getSession()
  const user = session?.user
  const isAgent = user?.role === 'agent'

  // Fetch data for stats
  const [listingsData, options] = await Promise.all([
    getAdminListings({
      page: 1,
      limit: 5,
      userId: isAgent ? user?.id : undefined
    }),
    getListingOptions()
  ])

  const stats = [
    {
      label: 'Total Listings',
      value: listingsData.totalPages * 10, // Approximation or need real count
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Total Views',
      value: '1,234',
      icon: Eye,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Inquiries',
      value: '12',
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      label: 'Active Listings',
      value: listingsData.listings.filter(l => l.status === 'active').length, // This only checks current page
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.name || 'Agent'}!
        </h1>
        <p className="text-slate-500 mt-2">
          Here's what's happening with your property portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Listings</h2>
          <Link href="/admin/listings">
            <Button variant="outline" className="text-slate-600">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <ListingTable
          listings={listingsData.listings}
          options={options}
          totalPages={1} // Hide pagination in dashboard widget
          currentPage={1}
        />
      </div>
    </div>
  )
}