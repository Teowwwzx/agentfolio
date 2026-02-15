import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { PropertyCarousel } from '@/components/PropertyCarousel'
import { ListingFilters } from '@/components/ListingFilters'
import { ListingWithImages } from '@/types'
import { getSavedListingIds } from '@/actions/user'
import { getBanners } from '@/actions/banners'
import { BannerSection } from '@/components/public/BannerSection'
import { CategoryIconsSection } from '@/components/CategoryIconsSection'
import { ContactFAB } from '@/components/public/ContactFAB'
import { Home as HomeIcon, Heart } from 'lucide-react'
import Link from 'next/link'

type PageProps = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getAgentBySlug(slug: string) {
    // Generate prisma client handles this correctly now
    const agent = await prisma.profiles.findFirst({
        where: { slug },
    })
    return agent
}

async function getListings(agentId: string, searchParams: { search?: string; location?: string; type?: string; category?: string; minPrice?: string; maxPrice?: string }) {
    const listings = await prisma.listings.findMany({
        where: {
            user_id: agentId,
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

async function getBannersByAgent(agentId: string) {
    const banners = await prisma.banners.findMany({
        where: { user_id: agentId, is_active: true },
        orderBy: { display_order: 'asc' }
    })
    return banners
}

export default async function AgentPortfolioPage({ params, searchParams }: PageProps) {
    const { slug } = await params
    const search = await searchParams

    const agent = await getAgentBySlug(slug)

    if (!agent) {
        notFound()
    }

    const filters = {
        search: typeof search.search === 'string' ? search.search : undefined,
        location: typeof search.location === 'string' ? search.location : undefined,
        type: typeof search.type === 'string' ? search.type : undefined,
        category: typeof search.category === 'string' ? search.category : undefined,
        minPrice: typeof search.minPrice === 'string' ? search.minPrice : undefined,
        maxPrice: typeof search.maxPrice === 'string' ? search.maxPrice : undefined,
    }

    const [listings, filterOptions, savedIds, banners] = await Promise.all([
        getListings(agent.id, filters),
        getFilterOptions(),
        getSavedListingIds(),
        getBannersByAgent(agent.id)
    ])

    // Convert Set<unknown> to Set<string> safely
    const savedListingIds = new Set(Array.from(savedIds as unknown as Set<unknown>).map(String))

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {agent.avatar_url && (
                            <img
                                src={agent.avatar_url}
                                alt={agent.full_name || 'Agent'}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900">
                                {agent.full_name || 'Property Agent'}
                            </h1>
                            {agent.phone_number && (
                                <p className="text-sm text-slate-500">{agent.phone_number}</p>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-5xl px-4 py-8 pb-24">
                {/* Hero Banners */}
                <BannerSection banners={banners as any} position="hero" />

                {/* Category Icons */}
                <div className="mb-6">
                    <CategoryIconsSection />
                </div>

                {/* Search */}
                <ListingFilters
                    categories={filterOptions.categories}
                    types={filterOptions.types}
                />

                {/* Filtered Results or All Listings */}
                {listings.length > 0 && (
                    <div className="my-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Latest Properties
                        </h2>
                        <PropertyCarousel
                            listings={listings}
                            savedListingIds={savedListingIds}
                        />
                    </div>
                )}

                {listings.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No properties available yet.</p>
                    </div>
                )}

                {/* Footer Banners */}
                <BannerSection banners={banners as any} position="footer" />
            </main>

            {/* Contact FAB */}
            <ContactFAB
                whatsapp={(agent as any).whatsapp_number}
                telegram={(agent as any).telegram_handle}
                instagram={(agent as any).instagram_handle}
                facebook={(agent as any).facebook_url}
                email={(agent as any).email_contact}
                phone={agent.phone_number}
            />
        </div>
    )
}
