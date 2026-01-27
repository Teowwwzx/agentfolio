import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([])
    }

    // Fetch listings by IDs
    const listings = await prisma.listings.findMany({
      where: {
        id: { in: ids }
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
      orderBy: { created_at: 'desc' }
    })

    // Transform to match expected format
    const response = listings.map(listing => ({
      ...listing,
      price: listing.price ? Number(listing.price) : null,
      images: listing.listing_images,
      category: listing.property_categories?.name,
      type: listing.property_types?.name
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching saved listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}
