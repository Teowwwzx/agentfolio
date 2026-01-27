import { ListingWithImages } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LatestProjectsSectionProps {
  listings: ListingWithImages[]
}

export function LatestProjectsSection({ listings }: LatestProjectsSectionProps) {
  if (!listings.length) return null

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[var(--brand-navy)]">Latest Projects</h2>
      </div>
      
      <div className="space-y-8">
        {listings.map((listing) => {
           const thumbnail = listing.images.length > 0 
            ? listing.images.sort((a, b) => a.display_order - b.display_order)[0].url 
            : 'https://placehold.co/600x400?text=No+Image'

          return (
            <Link key={listing.id} href={`/property/${listing.id}`} className="group block">
              <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
                {/* Large Banner Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted sm:aspect-[2/1]">
                  <Image
                    src={thumbnail}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    NEW PROJECT
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--brand-navy)] group-hover:text-[var(--brand-accent)] transition-colors">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-base text-slate-500">{listing.location}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}