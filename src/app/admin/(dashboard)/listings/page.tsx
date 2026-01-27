import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAdminListings } from '@/actions/listings'
import { getListingOptions } from '@/actions/options'
import { DashboardFilters } from '@/components/admin/DashboardFilters'
import { ListingTable } from '@/components/admin/ListingTable'
import { getSession } from '@/lib/auth'

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  const userId = session?.user?.id

  const params = await searchParams
  const page = Number(params.page) || 1
  const query = (params.query as string) || ''
  const status = (params.status as string) || ''
  const categoryId = (params.categoryId as string) || ''

  const [listingsData, options] = await Promise.all([
    getAdminListings({ 
      page, 
      limit: 10, 
      query, 
      status, 
      categoryId,
      userId // Filter by current user
    }),
    getListingOptions()
  ])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Listings</h1>
          <p className="text-slate-500">Manage your property portfolio</p>
        </div>
        <Link href="/admin/listings/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </Link>
      </div>

      <DashboardFilters categories={options.categories} />

      <ListingTable 
        listings={listingsData.listings} 
        options={options} 
        totalPages={listingsData.totalPages}
        currentPage={listingsData.currentPage}
      />
    </div>
  )
}