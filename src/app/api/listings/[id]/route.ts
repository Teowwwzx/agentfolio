import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const listing = await prisma.listings.findFirst({
      where: {
        id,
        status: 'active'
      },
      include: {
        listing_images: {
          orderBy: { display_order: 'asc' }
        },
        profiles: {
          select: {
            full_name: true,
            phone_number: true,
            email: true,
            // Social links for ContactFAB
            whatsapp_number: true,
            telegram_handle: true,
            instagram_handle: true,
            facebook_url: true,
            email_contact: true
          }
        },
        property_categories: {
          select: { name: true }
        },
        property_types: {
          select: { name: true }
        }
      }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Transform to match expected format
    const response = {
      ...listing,
      price: listing.price ? Number(listing.price) : null,
      images: listing.listing_images,
      agent_name: listing.profiles?.full_name,
      phone_number: listing.profiles?.phone_number,
      agent_email: listing.profiles?.email,
      category: listing.property_categories?.name,
      type: listing.property_types?.name,
      // Social links
      whatsapp: (listing.profiles as any)?.whatsapp_number || listing.profiles?.phone_number,
      telegram: (listing.profiles as any)?.telegram_handle,
      instagram: (listing.profiles as any)?.instagram_handle,
      facebook: (listing.profiles as any)?.facebook_url,
      email_contact: (listing.profiles as any)?.email_contact
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}
