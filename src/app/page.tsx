
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { PropertyCarousel } from '@/components/PropertyCarousel'
import { ListingFilters } from '@/components/ListingFilters'
import { ListingWithImages } from '@/types'
import DynamicSection from '@/components/DynamicSection'
import { getSections } from '@/actions/sections'
import { getSavedListingIds } from '@/actions/user'
import { getBanners } from '@/actions/banners'
import { BannerSection } from '@/components/public/BannerSection'
import { CategoryIconsSection } from '@/components/CategoryIconsSection'
import { Home as HomeIcon, Heart } from 'lucide-react'
import Link from 'next/link'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function getListings(searchParams: { search?: string; location?: string; type?: string; category?: string; minPrice?: string; maxPrice?: string }) {
  const listings = await prisma.listings.findMany({
    where: {
      status: 'active',
      ...(searchParams.search && {
        OR: [
          { title: { contains: searchParams.search, mode: 'insensitive' } },
          { location: { contains: searchParams.search, mode: 'insensitive' } },
        ]
      }),
      ...(searchParams.location && {
        location: { contains: searchParams.location, mode: 'insensitive' }
      }),
      ...(searchParams.type && {
        OR: [
          { property_type: { equals: searchParams.type, mode: 'insensitive' } },
          { property_types: { slug: searchParams.type } }
        ]
      }),
      ...(searchParams.category && {
        property_categories: { slug: searchParams.category }
      }),
      ...(searchParams.minPrice && {
        price: { gte: Number(searchParams.minPrice) }
      }),
      ...(searchParams.maxPrice && {
        price: { lte: Number(searchParams.maxPrice) }
      }),
    },
    include: {
      listing_images: {
        orderBy: { display_order: 'asc' }
      },
      property_categories: true,
      property_types: true,
    },
    orderBy: { created_at: 'desc' }
  })

  // Transform to match the expected ListingWithImages type
  return listings.map(listing => ({
    id: listing.id,
    user_id: listing.user_id,
    title: listing.title,
    description: listing.description,
    price: Number(listing.price),
    location: listing.location,
    place_id: listing.place_id,
    property_type: listing.property_type,
    category_id: listing.category_id,
    type_id: listing.type_id,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    sqft: listing.sqft,
    status: listing.status as 'active' | 'sold' | 'hidden',
    created_at: listing.created_at,
    images: listing.listing_images.map(img => ({
      id: img.id,
      listing_id: img.listing_id,
      url: img.url,
      display_order: img.display_order,
      created_at: img.created_at
    })),
    category: listing.property_categories?.name,
    type: listing.property_types?.name,
  })) as ListingWithImages[]
}

async function getFilterOptions() {
  const [categories, types] = await Promise.all([
    prisma.property_categories.findMany({
      select: { name: true, slug: true },
      orderBy: { name: 'asc' }
    }),
    prisma.property_types.findMany({
      select: { name: true, slug: true },
      orderBy: { name: 'asc' }
    })
  ])
  return { categories, types }
}

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const cookieStore = await cookies()
  const filters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
    type: typeof searchParams.type === 'string' ? searchParams.type : undefined,
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    minPrice: typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined,
  }

  const [listings, filterOptions, sections, savedIds, banners] = await Promise.all([
    getListings(filters),
    getFilterOptions(),
    getSections(),
    getSavedListingIds(),
    getBanners() as Promise<any[]>
  ])

  const savedListingIds = new Set(savedIds)

  // If no specific filters are applied, show the featured sections
  const showFeatured = !filters.search && !filters.location && !filters.type && !filters.category && !filters.minPrice && !filters.maxPrice

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 pb-24">
        {/* Hero Banners (Adv Banner) */}
        <BannerSection banners={banners} position="hero" />

        {/* Category Icons (Category buttons) */}
        <div className="mb-6">
          <CategoryIconsSection />
        </div>

        {/* Searchbar with filter button inside right */}
        <ListingFilters
          categories={filterOptions.categories}
          types={filterOptions.types}
        />

        {/* Dynamic Sections */}
        {showFeatured && sections.length > 0 && sections.map(section => (
          <DynamicSection
            key={section.id}
            section={section}
            savedListingIds={savedListingIds}
          />
        ))}

        {/* Filtered Results */}
        {!showFeatured && (
          <div className="my-12">
            <PropertyCarousel
              listings={listings}
              savedListingIds={savedListingIds}
            />
          </div>
        )}

        {/* Footer Banners */}
        <BannerSection banners={banners} position="footer" />
      </main>


    </div>
  )
}
