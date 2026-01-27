import { ListingWithImages } from '@/types'
import { PropertyCard } from './PropertyCard'

interface HandpickedSectionProps {
  listings: ListingWithImages[]
}

export function HandpickedSection({ listings }: HandpickedSectionProps) {
  if (!listings.length) return null

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[var(--brand-navy)]">Handpicked For You</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {listings.map((listing) => (
          <PropertyCard key={listing.id} listing={listing} className="shadow-soft" />
        ))}
      </div>
    </div>
  )
}