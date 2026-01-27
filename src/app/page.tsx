
import sql from '@/lib/db'
import { cookies } from 'next/headers'
import { PropertyCarousel } from '@/components/PropertyCarousel'
import { ListingFilters } from '@/components/ListingFilters'
import { ListingWithImages } from '@/types'
import DynamicSection from '@/components/DynamicSection'
import { getSections } from '@/actions/sections'
import { getSavedListingIds } from '@/actions/user'
import { Home as HomeIcon } from 'lucide-react'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function getListings(searchParams: { search?: string; location?: string; type?: string; category?: string; minPrice?: string; maxPrice?: string }) {
  // Base query parts
  let query = sql`
    SELECT 
      l.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', li.id,
            'listing_id', li.listing_id,
            'url', li.url,
            'display_order', li.display_order,
            'created_at', li.created_at
          ) ORDER BY li.display_order ASC
        ) FILTER (WHERE li.id IS NOT NULL),
        '[]'
      ) as images,
      pc.name as category,
      pt.name as type,
      COALESCE(
        (SELECT json_agg(pt.name)
         FROM listing_tags lt
         JOIN property_tags pt ON lt.tag_id = pt.id
         WHERE lt.listing_id = l.id
        ),
        '[]'
      ) as tags
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN property_categories pc ON l.category_id = pc.id
    LEFT JOIN property_types pt ON l.type_id = pt.id
    WHERE l.status = 'active'
  `

  // Add filters
  if (searchParams.search) {
    const searchPattern = '%' + searchParams.search + '%'
    query = sql`${query} AND (l.title ILIKE ${searchPattern} OR l.location ILIKE ${searchPattern})`
  }
  if (searchParams.location) {
    query = sql`${query} AND l.location ILIKE ${'%' + searchParams.location + '%'}`
  }
  if (searchParams.type) {
    // Support both old text column and new relation
    query = sql`${query} AND (l.property_type ILIKE ${searchParams.type} OR pt.slug = ${searchParams.type})`
  }
  if (searchParams.category) {
    query = sql`${query} AND pc.slug = ${searchParams.category}`
  }
  if (searchParams.minPrice) {
    query = sql`${query} AND l.price >= ${Number(searchParams.minPrice)}`
  }
  if (searchParams.maxPrice) {
    query = sql`${query} AND l.price <= ${Number(searchParams.maxPrice)}`
  }

  // Finalize query
  const rows = await sql`
    ${query}
    GROUP BY l.id, pc.name, pt.name
    ORDER BY l.created_at DESC
  `
  
  return rows as unknown as ListingWithImages[]
}

async function getFilterOptions() {
  const [categories, types] = await Promise.all([
    sql`SELECT name, slug FROM property_categories ORDER BY name`,
    sql`SELECT name, slug FROM property_types ORDER BY name`
  ])
  return {
    categories: categories as unknown as { name: string; slug: string }[],
    types: types as unknown as { name: string; slug: string }[]
  }
}

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const cookieStore = await cookies()
  const isEditMode = cookieStore.get('edit_mode')?.value === 'true'
  
  const filters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
    type: typeof searchParams.type === 'string' ? searchParams.type : undefined,
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    minPrice: typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined,
  }

  const [listings, filterOptions, sections, savedIds] = await Promise.all([
    getListings(filters),
    getFilterOptions(),
    getSections(),
    getSavedListingIds()
  ])

  const savedListingIds = new Set(savedIds)

  // If no specific filters are applied, show the featured sections
  const showFeatured = !filters.search && !filters.location && !filters.type && !filters.category && !filters.minPrice && !filters.maxPrice

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">AgentFolio</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--brand-navy)]">Find Your Dream Home</h2>
          <p className="mt-2 text-lg text-slate-500">Discover the best properties in the market.</p>
        </div>

        <ListingFilters 
          categories={filterOptions.categories}
          types={filterOptions.types}
        />

        {showFeatured && sections.map((section) => (
          <DynamicSection 
            key={section.id} 
            section={section} 
            savedListingIds={savedListingIds} 
            isEditMode={isEditMode}
          />
        ))}

        {/* 
        {showFeatured && (
          <>
             <div className="my-12 h-px bg-slate-200" />
             <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--brand-navy)]">All Properties</h2>
             </div>
          </>
        )}

        {listings.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-card">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <HomeIcon className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-xl font-semibold text-[var(--brand-navy)]">No properties found</p>
            <p className="mt-2 text-slate-500">Try adjusting your search filters to find what you&apos;re looking for.</p>
          </div>
        ) : (
          <PropertyCarousel listings={listings} savedListingIds={savedListingIds} />
        )} 
        */}
      </main>
    </div>
  )
}
