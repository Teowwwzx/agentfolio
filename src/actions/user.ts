
'use server'

import sql from '@/lib/db'
import { verifySession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { ListingWithImages } from '@/types'

export async function toggleSavedProperty(listingId: string) {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    throw new Error('Unauthorized')
  }

  const userId = session.userId

  // Check if exists
  const existing = await sql`
    SELECT id FROM saved_properties 
    WHERE user_id = ${userId} AND listing_id = ${listingId}
  `

  if (existing.length > 0) {
    // Delete
    await sql`
      DELETE FROM saved_properties 
      WHERE user_id = ${userId} AND listing_id = ${listingId}
    `
    return { saved: false }
  } else {
    // Insert
    await sql`
      INSERT INTO saved_properties (user_id, listing_id)
      VALUES (${userId}, ${listingId})
    `
    return { saved: true }
  }
}

export async function getSavedProperties() {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    return []
  }

  const listings = await sql`
    SELECT l.*, 
      COALESCE(
        json_agg(
          json_build_object(
            'id', li.id,
            'listing_id', li.listing_id,
            'url', li.url,
            'display_order', li.display_order
          ) ORDER BY li.display_order ASC
        ) FILTER (WHERE li.id IS NOT NULL),
        '[]'
      ) as images
    FROM listings l
    JOIN saved_properties sp ON l.id = sp.listing_id
    LEFT JOIN listing_images li ON l.id = li.listing_id
    WHERE sp.user_id = ${session.userId}
    GROUP BY l.id, sp.created_at
    ORDER BY sp.created_at DESC
  `

  return listings as unknown as ListingWithImages[]
}

export async function getSavedListingIds() {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    return []
  }

  const rows = await sql`
    SELECT listing_id FROM saved_properties 
    WHERE user_id = ${session.userId}
  `
  return rows.map(r => r.listing_id as string)
}

export async function logSearch(queryText: string, filters: any) {
  const session = await verifySession()
  
  // We can log for anonymous users too if we track them, but for now only auth
  if (!session.isAuth || !session.userId) {
    return
  }

  // Only log if there's actual search intent
  const hasFilters = queryText || filters.location || filters.category || filters.type || filters.minPrice || filters.maxPrice
  if (!hasFilters) return

  await sql`
    INSERT INTO search_history (user_id, query_text, filters)
    VALUES (${session.userId}, ${queryText}, ${sql.json(filters)})
  `
}
