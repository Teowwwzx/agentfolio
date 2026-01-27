
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PageSection } from '@/actions/sections'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from './PropertyCard'
import { ListingWithImages } from '@/types'


async function getListingsForSection(section: PageSection) {
  const limit = section.filter_config?.limit || 6

  const listings = await prisma.listings.findMany({
    where: {
      status: 'active',
      ...(section.section_type === 'category' && section.filter_config?.category_id && {
        category_id: section.filter_config.category_id
      })
    },
    include: {
      listing_images: {
        orderBy: { display_order: 'asc' }
      },
      property_categories: {
        select: { name: true }
      },
      property_types: {
        select: { name: true }
      }
    },
    orderBy: { created_at: 'desc' },
    take: limit
  })

  // Transform to match ListingWithImages
  return listings.map(l => ({
    id: l.id,
    user_id: l.user_id,
    title: l.title,
    description: l.description,
    price: l.price ? Number(l.price) : null,
    location: l.location,
    place_id: l.place_id,
    property_type: l.property_type,
    category_id: l.category_id,
    type_id: l.type_id,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    sqft: l.sqft,
    status: l.status as 'active' | 'sold' | 'hidden',
    created_at: l.created_at,
    images: l.listing_images.map(img => ({
      id: img.id,
      listing_id: img.listing_id,
      url: img.url,
      display_order: img.display_order,
      created_at: img.created_at
    })),
    category: l.property_categories?.name,
    type: l.property_types?.name
  })) as ListingWithImages[]
}

export default async function DynamicSection({ section, savedListingIds }: { section: PageSection, savedListingIds: Set<string> }) {
  const listings = await getListingsForSection(section)

  if (listings.length === 0) return null

  // Layout Logic
  if (section.layout_type === 'hero_grid') {
    const firstListing = listings[0]
    const remainingListings = listings.slice(1)

    return (
      <section className="py-12 relative group">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
            </div>
            <Link href="/properties" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Hero Card */}
            <div className="lg:col-span-3">
              <PropertyCard
                listing={firstListing}
                isSaved={savedListingIds.has(firstListing.id)}
                className="shadow-md"
              />
            </div>

            {/* Remaining Grid */}
            {remainingListings.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                isSaved={savedListingIds.has(listing.id)}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const gridClass = section.layout_type === 'grid_3'
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : section.layout_type === 'list_1'
      ? 'grid-cols-1'
      : 'grid-cols-1 md:grid-cols-3' // Fallback for carousel for now (rendering as grid)

  return (

    <section className={`py-12 relative group`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
          </div>
          <Link href="/properties" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-4 snap-x hide-scrollbar md:grid md:gap-8 md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {listings.map((listing) => (
            <div key={listing.id} className="min-w-[280px] w-[85%] md:w-auto md:min-w-0 snap-center">
              <PropertyCard
                listing={listing}
                isSaved={savedListingIds.has(listing.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
