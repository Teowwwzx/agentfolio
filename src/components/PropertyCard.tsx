import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square } from 'lucide-react'
import { ListingWithImages } from '@/types'
import { cn } from '@/lib/utils'
import { SaveButton } from './SaveButton'

interface PropertyCardProps {
  listing: ListingWithImages
  className?: string
  isSaved?: boolean
}

export function PropertyCard({ listing, className, isSaved = false }: PropertyCardProps) {
  const thumbnail = listing.images.length > 0 
    ? listing.images.sort((a, b) => a.display_order - b.display_order)[0].url 
    : 'https://placehold.co/600x400?text=No+Image'

  // Extract "Renovated" from title or use isRenovated prop
  let displayTitle = listing.title;
  const isRenovated = listing.title.toLowerCase().includes('(renovated)') || listing.isRenovated;
  
  if (displayTitle.toLowerCase().includes('(renovated)')) {
    displayTitle = displayTitle.replace(/\(renovated\)/i, '').trim();
  }

  // Use tags from listing or default to empty
  const tags = listing.tags || [];

  return (
    <Link href={`/property/${listing.id}`} className={cn("group block", className)}>
      <div className="overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 relative">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={thumbnail}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
            RM {Number(listing.price).toLocaleString()}
          </div>
          <div className="absolute top-2 right-2 z-10">
             <SaveButton listingId={listing.id} initialSaved={isSaved} className="bg-white/80 backdrop-blur-sm shadow-sm" />
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {listing.status !== 'active' && (
              <div className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm w-fit">
                {listing.status.toUpperCase()}
              </div>
            )}
            {isRenovated && (
              <div className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-bold text-white shadow-sm w-fit">
                RENOVATED
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-[var(--brand-navy)] group-hover:text-[var(--brand-accent)] transition-colors">
            {displayTitle}
          </h3>
          
          <div className="mt-2 flex items-center text-sm font-medium text-slate-500">
            <MapPin className="mr-1.5 h-4 w-4 text-slate-400" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-slate-400" />
              <span>{listing.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-slate-400" />
              <span>{listing.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4 text-slate-400" />
              <span>{listing.sqft} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
