import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, MapPin, Bed, Bath, Square } from 'lucide-react'
import sql from '@/lib/db'
import { ListingWithImages, Profile } from '@/types'
import { StickyContactBar } from '@/components/StickyContactBar'
import { PropertyGallery } from '@/components/PropertyGallery'

async function getListing(id: string) {
  try {
    const rows = await sql`
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
        ) as images
      FROM listings l
      LEFT JOIN listing_images li ON l.id = li.listing_id
      WHERE l.id = ${id}
      GROUP BY l.id
    `
    
    if (rows.length === 0) return null
    return rows[0] as unknown as ListingWithImages
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

async function getAgentProfile(userId: string) {
  const rows = await sql`
    SELECT * FROM profiles WHERE id = ${userId}
  `
  if (rows.length === 0) return null
  return rows[0] as unknown as Profile
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListing(id)

  if (!listing) {
    notFound()
  }

  const agent = await getAgentProfile(listing.user_id)
  
  // Default to a placeholder if no agent found or no phone (should ideally enforce this in DB or app logic)
  const agentPhone = agent?.phone_number || '60123456789'
  const whatsappMessage = `Hi, I'm interested in ${listing.title} at ${listing.location}...`

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 flex items-center border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
        <Link href="/" className="mr-4 rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Link>
        <h1 className="line-clamp-1 text-lg font-semibold text-slate-900">{listing.title}</h1>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Modern Grid Gallery with Modal Preview */}
        <PropertyGallery images={listing.images} title={listing.title} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{listing.title}</h1>
                  <div className="mt-2 flex items-center text-slate-500">
                    <MapPin className="mr-1.5 h-4 w-4 text-[var(--brand-navy)]" />
                    {listing.location}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                   <div className="text-3xl font-bold tracking-tight text-[var(--brand-navy)]">
                    RM {Number(listing.price).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-slate-500 mt-1">
                    {listing.property_type}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Specs */}
            <div className="mb-8 grid grid-cols-3 gap-4 border-y border-slate-100 py-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 p-2.5 text-[var(--brand-navy)]">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{listing.bedrooms}</div>
                  <div className="text-xs font-medium text-slate-500">Bedrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="rounded-full bg-blue-50 p-2.5 text-[var(--brand-navy)]">
                  <Bath className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{listing.bathrooms}</div>
                  <div className="text-xs font-medium text-slate-500">Bathrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="rounded-full bg-blue-50 p-2.5 text-[var(--brand-navy)]">
                  <Square className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{listing.sqft}</div>
                  <div className="text-xs font-medium text-slate-500">Square Ft</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="mb-4 text-xl font-bold text-slate-900">About this property</h3>
              <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-600 whitespace-pre-line">
                {listing.description}
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-10">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Details</h3>
              <div className="grid grid-cols-2 gap-y-4 rounded-xl bg-slate-50 p-6 text-sm sm:grid-cols-3">
                <div>
                  <div className="font-medium text-slate-500">Type</div>
                  <div className="mt-1 font-semibold text-slate-900">{listing.property_type}</div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Listed On</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </div>
                 <div>
                  <div className="font-medium text-slate-500">Reference ID</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    #{listing.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Agent Card */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white shadow-sm">
                    {agent?.avatar_url ? (
                      <Image src={agent.avatar_url} alt={agent.full_name || 'Agent'} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-100 text-xl font-bold text-[var(--brand-navy)]">
                        {agent?.full_name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{agent?.full_name || 'Property Agent'}</div>
                    <div className="text-sm font-medium text-slate-500">Listing Agent</div>
                  </div>
                </div>

                {agent?.description && (
                  <div className="mb-6 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
                    {agent.description}
                  </div>
                )}

                <div className="space-y-3">
                   <a 
                    href={`tel:${agentPhone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] py-3 font-semibold text-white transition-all hover:bg-[var(--brand-navy-light)] active:scale-[0.98] shadow-md shadow-blue-200"
                  >
                    Call Agent
                  </a>
                   <a 
                    href={`https://wa.me/${agentPhone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 font-semibold text-white transition-all hover:bg-[#20bd5a] active:scale-[0.98] shadow-md shadow-green-100"
                  >
                    WhatsApp
                  </a>
                </div>
             </div>
          </div>
        </div>
      </main>

      <StickyContactBar 
        phoneNumber={agentPhone} 
        message={whatsappMessage} 
      />
    </div>
  )
}
