'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'
import { ListingWithImages } from '@/types'

// Helper to ensure auth
async function requireAuth() {
  const session = await getSession()
  if (!session || !session.user || !session.user.id) {
    redirect('/admin/login')
  }
  return session
}

export async function createListingAction(prevState: unknown, formData: FormData) {
  console.log('createListingAction started')
  const session = await requireAuth()

  // Extract form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const location = formData.get('location') as string
  const placeId = formData.get('placeId') as string
  // const propertyType = formData.get('propertyType') as string // Deprecated
  const categoryId = formData.get('categoryId') as string
  const typeId = formData.get('typeId') as string
  const bedrooms = formData.get('bedrooms') as string
  const bathrooms = formData.get('bathrooms') as string
  const sqft = formData.get('sqft') as string
  const status = formData.get('status') as string
  const imageUrlsString = formData.get('imageUrls') as string
  const tags = formData.getAll('tags') as string[]
  
  console.log('createListingAction data:', { title, price, categoryId, typeId, tagsCount: tags.length, imageUrlsString })

  const userId = session?.user?.id

  if (!userId) {
    console.error('CreateListing: User ID missing from session', session)
    return { error: 'Authentication error: User ID missing' }
  }

  try {
    const [listing] = await sql`
      INSERT INTO listings (
        user_id, title, description, price, location, place_id, category_id, type_id, bedrooms, bathrooms, sqft, status
      ) VALUES (
        ${userId}, ${title || null}, ${description || null}, ${price || null}, ${location || null}, ${placeId || null}, ${categoryId || null}, ${typeId || null}, ${bedrooms || null}, ${bathrooms || null}, ${sqft || null}, ${status || null}
      )
      RETURNING id
    `
    console.log('Listing created with ID:', listing.id)
    
    // Handle Images
    if (imageUrlsString) {
      const urls = imageUrlsString.split(',').filter(Boolean)
      console.log('Inserting images:', urls.length)
      for (let i = 0; i < urls.length; i++) {
        await sql`
          INSERT INTO listing_images (listing_id, url, display_order)
          VALUES (${listing.id}, ${urls[i]}, ${i})
        `
      }
    }

    // Handle Tags
    if (tags && tags.length > 0) {
      console.log('Inserting tags:', tags.length)
      for (const tagId of tags) {
        await sql`
          INSERT INTO listing_tags (listing_id, tag_id)
          VALUES (${listing.id}, ${tagId})
          ON CONFLICT DO NOTHING
        `
      }
    }
  } catch (e) {
    console.error('Error creating listing:', e)
    return { error: 'Failed to create listing' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/listings')
  revalidatePath('/')
  redirect('/admin')
}

export async function updateListingAction(prevState: unknown, formData: FormData) {
  console.log('updateListingAction started')
  await requireAuth()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const location = formData.get('location') as string
  const placeId = formData.get('placeId') as string
  const categoryId = formData.get('categoryId') as string
  const typeId = formData.get('typeId') as string
  const bedrooms = formData.get('bedrooms') as string
  const bathrooms = formData.get('bathrooms') as string
  const sqft = formData.get('sqft') as string
  const status = formData.get('status') as string
  const imageUrlsString = formData.get('imageUrls') as string
  const tags = formData.getAll('tags') as string[] // "tags" from checkboxes

  console.log('updateListingAction data:', { id, title, price, tagsCount: tags.length })

  if (!id) return { error: 'Listing ID is required' }

  try {
    await sql`
      UPDATE listings SET
        title = ${title || null},
        description = ${description || null},
        price = ${price || null},
        location = ${location || null},
        place_id = ${placeId || null},
        category_id = ${categoryId || null},
        type_id = ${typeId || null},
        bedrooms = ${bedrooms || null},
        bathrooms = ${bathrooms || null},
        sqft = ${sqft || null},
        status = ${status || null},
        updated_at = NOW()
      WHERE id = ${id}
    `

    // Update Images: Delete all and re-insert (simplest strategy)
    // Note: In production, might want to be smarter to avoid flickering or ID churn
    await sql`DELETE FROM listing_images WHERE listing_id = ${id}`
    if (imageUrlsString) {
      const urls = imageUrlsString.split(',').filter(Boolean)
      for (let i = 0; i < urls.length; i++) {
        await sql`
          INSERT INTO listing_images (listing_id, url, display_order)
          VALUES (${id}, ${urls[i]}, ${i})
        `
      }
    }

    // Update Tags: Delete all and re-insert
    await sql`DELETE FROM listing_tags WHERE listing_id = ${id}`
    if (tags && tags.length > 0) {
      for (const tagId of tags) {
        await sql`
          INSERT INTO listing_tags (listing_id, tag_id)
          VALUES (${id}, ${tagId})
          ON CONFLICT DO NOTHING
        `
      }
    }

  } catch (e) {
    console.error('Error updating listing:', e)
    return { error: 'Failed to update listing' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/listings')
  revalidatePath('/')
  return { success: true }
}

export async function deleteListingAction(id: string) {
  console.log('deleteListingAction started for id:', id)
  await requireAuth()
  
  try {
    // Relying on ON DELETE CASCADE for related tables (images, tags) if set up. 
    // If not, we should delete them first. Let's delete manually to be safe.
    await sql`DELETE FROM listing_images WHERE listing_id = ${id}`
    await sql`DELETE FROM listing_tags WHERE listing_id = ${id}`
    await sql`DELETE FROM listings WHERE id = ${id}`
  } catch (e) {
    console.error('Error deleting listing:', e)
    return { error: 'Failed to delete listing' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/listings')
  revalidatePath('/')
  return { success: true }
}

export async function getAdminListings({
  page = 1,
  limit = 10,
  query = '',
  status = '',
  categoryId = '',
  userId = ''
}: {
  page?: number
  limit?: number
  query?: string
  status?: string
  categoryId?: string
  userId?: string
} = {}) {
  const offset = (page - 1) * limit

  // Base conditions
  // We use sql helper for safe interpolation
  // Dynamic query construction with postgres.js is done via helper functions or conditional arrays
  // but for simplicity here we might need to be a bit verbose or use helper.

  // NOTE: Postgres.js doesn't compose dynamic WHERE easily without helper functions.
  // We will fetch more and filter in DB if possible, or build the query parts.
  
  // Let's use a simpler approach: filtering
  
  // Construct the WHERE clause dynamically
  const conditions = []
  if (query) {
    conditions.push(sql`(title ILIKE ${'%' + query + '%'} OR location ILIKE ${'%' + query + '%'})`)
  }
  if (status && status !== 'all') {
    conditions.push(sql`status = ${status}`)
  }
  if (categoryId && categoryId !== 'all') {
    conditions.push(sql`category_id = ${categoryId}`)
  }
  if (userId) {
    conditions.push(sql`user_id = ${userId}`)
  }

  const whereClause = conditions.length > 0 
    ? sql`WHERE ${conditions.reduce((a, b) => sql`${a} AND ${b}`)}`
    : sql``

  const [countResult] = await sql`
    SELECT COUNT(*) as count FROM listings l
    ${whereClause}
  `
  const totalCount = parseInt(countResult.count, 10)
  const totalPages = Math.ceil(totalCount / limit)

  const rows = await sql`
    SELECT 
      l.*,
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
      ) as images,
      (
        SELECT COALESCE(json_agg(tag_id), '[]')
        FROM listing_tags lt
        WHERE lt.listing_id = l.id
      ) as tag_ids,
      (
        SELECT COALESCE(json_agg(pt.name), '[]')
        FROM listing_tags lt
        JOIN property_tags pt ON lt.tag_id = pt.id
        WHERE lt.listing_id = l.id
      ) as tags
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    ${whereClause}
    GROUP BY l.id
    ORDER BY l.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  
  return {
    listings: rows as unknown as (ListingWithImages & { tag_ids: string[] })[],
    totalCount,
    totalPages,
    currentPage: page
  }
}

