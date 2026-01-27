'use client'

import { useState } from 'react'
import { ListingWithImages } from '@/types'
import { MapPin, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingImagePreview } from './ListingImagePreview'
import { EditListingModal } from './EditListingModal'
import { DeleteListingModal } from './DeleteListingModal'
import { useRouter, useSearchParams } from 'next/navigation'

interface ListingTableProps {
  listings: (ListingWithImages & { tag_ids: string[] })[]
  options: {
    categories: { id: string, name: string }[],
    types: { id: string, name: string }[],
    tags: { id: string, name: string, color: string }[]
  }
  totalPages: number
  currentPage: number
}

export function ListingTable({ listings, options, totalPages, currentPage }: ListingTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [editingListing, setEditingListing] = useState<(ListingWithImages & { tag_ids: string[] }) | null>(null)
  const [deletingListing, setDeletingListing] = useState<{ id: string, title: string } | null>(null)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/admin?${params.toString()}`)
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Property</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No listings found.
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <ListingImagePreview images={listing.images} title={listing.title} />
                      <div>
                        <div className="font-medium text-slate-900">{listing.title}</div>
                        <div className="flex items-center text-slate-500 text-xs mt-1">
                          <MapPin className="mr-1 h-3 w-3" />
                          {listing.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border
                      ${listing.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                        listing.status === 'sold' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    RM {Number(listing.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                        onClick={() => setEditingListing(listing)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                        onClick={() => setDeletingListing({ id: listing.id, title: listing.title })}
                      >
                         <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <EditListingModal 
        listing={editingListing} 
        isOpen={!!editingListing} 
        onClose={() => setEditingListing(null)} 
        options={options}
      />

      <DeleteListingModal 
        listingId={deletingListing?.id || null} 
        listingTitle={deletingListing?.title}
        isOpen={!!deletingListing} 
        onClose={() => setDeletingListing(null)} 
      />
    </>
  )
}
