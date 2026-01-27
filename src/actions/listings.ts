'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ListingWithImages } from '@/types'
import { Prisma } from '@prisma/client'

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
  const categoryId = formData.get('categoryId') as string
  const typeId = formData.get('typeId') as string
  const bedrooms = formData.get('bedrooms') as string
  const bathrooms = formData.get('bathrooms') as string
  const sqft = formData.get('sqft') as string
  const status = formData.get('status') as string
  const imageUrlsString = formData.get('imageUrls') as string

  const userId = session?.user?.id

  if (!userId) {
    console.error('CreateListing: User ID missing from session', session)
    return { error: 'Authentication error: User ID missing' }
  }

  try {
    const listing = await prisma.listings.create({
      data: {
        user_id: userId,
        title: title || '',
        description: description || null,
        price: price ? new Prisma.Decimal(price) : null,
        location: location || null,
        place_id: placeId || null,
        category_id: categoryId || null,
        type_id: typeId || null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        sqft: sqft ? parseInt(sqft) : null,
        status: status || 'active'
      }
    })
    console.log('Listing created with ID:', listing.id)

    // Handle Images
    if (imageUrlsString) {
      const urls = imageUrlsString.split(',').filter(Boolean)
      console.log('Inserting images:', urls.length)
      await prisma.listing_images.createMany({
        data: urls.map((url, index) => ({
          listing_id: listing.id,
          url,
          display_order: index
        }))
      })
    }
  } catch (e) {
    console.error('Error creating listing:', e)
    return { error: 'Failed to create listing' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/listings')
  revalidatePath('/agent/listings')
  revalidatePath('/')

  if (session.user.role === 'agent') {
    redirect('/agent/listings')
  } else {
    redirect('/admin')
  }
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

  if (!id) return { error: 'Listing ID is required' }

  try {
    await prisma.listings.update({
      where: { id },
      data: {
        title: title || '',
        description: description || null,
        price: price ? new Prisma.Decimal(price) : null,
        location: location || null,
        place_id: placeId || null,
        category_id: categoryId || null,
        type_id: typeId || null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        sqft: sqft ? parseInt(sqft) : null,
        status: status || 'active',
        updated_at: new Date()
      }
    })

    // Update Images: Delete all and re-insert
    await prisma.listing_images.deleteMany({ where: { listing_id: id } })
    if (imageUrlsString) {
      const urls = imageUrlsString.split(',').filter(Boolean)
      await prisma.listing_images.createMany({
        data: urls.map((url, index) => ({
          listing_id: id,
          url,
          display_order: index
        }))
      })
    }
  } catch (e) {
    console.error('Error updating listing:', e)
    return { error: 'Failed to update listing' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/listings')
  revalidatePath('/agent/listings')
  revalidatePath('/')
  return { success: true }
}

export async function deleteListingAction(id: string) {
  console.log('deleteListingAction started for id:', id)
  await requireAuth()

  try {
    // Delete images first (cascade should handle this, but being explicit)
    await prisma.listing_images.deleteMany({ where: { listing_id: id } })
    await prisma.listings.delete({ where: { id } })
  } catch (e) {
    console.error('Error deleting listing:', e)
    return { error: 'Failed to delete listing' }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/listings')
  revalidatePath('/agent/listings')
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

  // Build where condition
  const where: Prisma.listingsWhereInput = {}

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } }
    ]
  }
  if (status && status !== 'all') {
    where.status = status
  }
  if (categoryId && categoryId !== 'all') {
    where.category_id = categoryId
  }
  if (userId) {
    where.user_id = userId
  }

  const [totalCount, listings] = await Promise.all([
    prisma.listings.count({ where }),
    prisma.listings.findMany({
      where,
      include: {
        listing_images: {
          orderBy: { display_order: 'asc' }
        }
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit
    })
  ])

  const totalPages = Math.ceil(totalCount / limit)

  // Transform to expected format
  const transformedListings = listings.map(listing => ({
    id: listing.id,
    user_id: listing.user_id,
    title: listing.title,
    description: listing.description,
    price: listing.price ? Number(listing.price) : null,
    location: listing.location,
    place_id: listing.place_id,
    property_type: listing.property_type,
    category_id: listing.category_id,
    type_id: listing.type_id,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    sqft: listing.sqft,
    status: listing.status,
    created_at: listing.created_at,
    updated_at: listing.updated_at,
    images: listing.listing_images.map(img => ({
      id: img.id,
      listing_id: img.listing_id,
      url: img.url,
      display_order: img.display_order,
      created_at: img.created_at
    })),
    tag_ids: [] as string[],
    tags: [] as string[]
  }))

  return {
    listings: transformedListings as (ListingWithImages & { tag_ids: string[] })[],
    totalCount,
    totalPages,
    currentPage: page
  }
}
