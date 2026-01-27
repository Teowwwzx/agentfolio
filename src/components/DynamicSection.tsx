
import Link from 'next/link'
import sql from '@/lib/db'
import { PageSection } from '@/actions/sections'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from './PropertyCard'
import { ListingWithImages } from '@/types'
import { EditControls } from './SectionEditControls'

// Reusing types from db
type Listing = {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  sqft: number
  images: string[]
  category: string
  type: string
  status: string
  created_at: Date
  tags: string[]
}

async function getListingsForSection(section: PageSection) {
  const limit = section.filter_config?.limit || 6
  
  let query = sql`
    SELECT l.*, 
      COALESCE(
        (SELECT array_agg(json_build_object('url', url, 'display_order', display_order)) 
         FROM listing_images 
         WHERE listing_id = l.id), 
        '{}'
      ) as images,
      pc.name as category,
      pt.name as type,
      COALESCE(
        (SELECT array_agg(pt.name)
         FROM listing_tags lt2
         JOIN property_tags pt ON lt2.tag_id = pt.id
         WHERE lt2.listing_id = l.id),
        '{}'
      ) as tags
    FROM listings l
    LEFT JOIN property_categories pc ON l.category_id = pc.id
    LEFT JOIN property_types pt ON l.type_id = pt.id
    LEFT JOIN listing_tags lt ON l.id = lt.listing_id
    WHERE l.status = 'active'
  `

  if (section.section_type === 'category' && section.filter_config?.category_id) {
    query = sql`${query} AND l.category_id = ${section.filter_config.category_id}`
  } else if (section.section_type === 'tag' && section.filter_config?.tag_id) {
    query = sql`${query} AND lt.tag_id = ${section.filter_config.tag_id}`
  } else if (section.section_type === 'featured') {
    // Assuming 'featured' means specific tag or logic, for now just latest
  }

  // Finalize query
  const listings = await sql<Listing[]>`
    ${query}
    GROUP BY l.id, pc.name, pt.name
    ORDER BY l.created_at DESC
    LIMIT ${limit}
  `
  
  // Transform images to match ListingWithImages
  return listings.map(l => ({
    ...l,
    price: Number(l.price),
    images: (l.images as any[]).map((img: any) => ({
      id: '',
      listing_id: l.id,
      url: img.url,
      display_order: img.display_order,
      created_at: new Date()
    }))
  })) as unknown as ListingWithImages[]
}

export default async function DynamicSection({ section, savedListingIds, isEditMode }: { section: PageSection, savedListingIds: Set<string>, isEditMode?: boolean }) {
  const listings = await getListingsForSection(section)

  if (listings.length === 0) return null

  // Layout Logic
  if (section.layout_type === 'hero_grid') {
    const firstListing = listings[0]
    const remainingListings = listings.slice(1)

    return (
      <section className={`py-12 relative group ${isEditMode ? 'border-2 border-transparent hover:border-dashed hover:border-blue-300' : ''}`}>
        {isEditMode && <EditControls sectionId={section.id} />}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
              {section.section_type === 'latest' && (
                <p className="text-slate-500 mt-2">Discover the newest properties on the market</p>
              )}
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
    <section className={`py-12 relative group ${isEditMode ? 'border-2 border-transparent hover:border-dashed hover:border-blue-300 transition-all' : ''}`}>
      {isEditMode && <EditControls sectionId={section.id} />}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
            {section.section_type === 'latest' && (
              <p className="text-slate-500 mt-2">Discover the newest properties on the market</p>
            )}
          </div>
          <Link href="/properties" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className={`grid gap-8 ${gridClass}`}>
          {listings.map((listing) => (
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
