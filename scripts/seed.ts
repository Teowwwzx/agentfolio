import crypto from 'node:crypto'

import { getDb } from './db'

type ListingSeed = {
  title: string
  description: string
  price: string
  location: string
  place_id: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  sqft: number
  status: 'active' | 'sold' | 'hidden'
  imageUrls: string[]
}

const agentId = '9a3b1d8c-1a6f-4d8f-bc7e-2b1a4c77e9f2'

const listings: ListingSeed[] = [
  {
    title: 'Modern Condo near LRT (High Floor)',
    description: 'Move-in ready. Great city views. 2 parking bays.',
    price: '520000',
    location: 'Kuala Lumpur',
    place_id: 'ChIJSzzWj2e3zDERQqGqC8k5v7E',
    propertyType: 'Condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 980,
    status: 'active',
    imageUrls: [
      'https://picsum.photos/seed/agentfolio-1a/1200/800',
      'https://picsum.photos/seed/agentfolio-1b/1200/800',
      'https://picsum.photos/seed/agentfolio-1c/1200/800'
    ]
  },
  {
    title: 'Corner Terrace in Puchong (Renovated)',
    description: 'Quiet neighborhood. Extended kitchen. 10 min to amenities.',
    price: '890000',
    location: 'Puchong',
    place_id: 'ChIJb2c_1cJOzDERsS9qC8k5v7E',
    propertyType: 'Terrace',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1800,
    status: 'active',
    imageUrls: [
      'https://picsum.photos/seed/agentfolio-2a/1200/800',
      'https://picsum.photos/seed/agentfolio-2b/1200/800'
    ]
  },
  {
    title: 'Affordable Studio (Great for Investment)',
    description: 'Low entry price. Strong rental demand. Near universities.',
    price: '230000',
    location: 'Kuala Lumpur',
    place_id: 'ChIJSzzWj2e3zDERQqGqC8k5v7E',
    propertyType: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 450,
    status: 'hidden',
    imageUrls: [
      'https://picsum.photos/seed/agentfolio-3a/1200/800'
    ]
  }
]

async function main() {
  const sql = getDb()

  try {
    await sql`
      insert into public.profiles (id, full_name, description, phone_number, avatar_url)
      values (
        ${agentId}::uuid, 
        ${'Aiman Tan'}, 
        ${'Experienced real estate professional specializing in residential properties in KL and Selangor. I help first-time homebuyers and investors find the best deals.'},
        ${'60123456789'}, 
        ${''}
      )
      on conflict (id) do update
      set full_name = excluded.full_name,
          description = excluded.description,
          phone_number = excluded.phone_number,
          avatar_url = excluded.avatar_url
    `

    const insertedListingIds: string[] = []

    for (const listing of listings) {
      const listingId = crypto.randomUUID()
      insertedListingIds.push(listingId)

      await sql`
        insert into public.listings (
          id,
          user_id,
          title,
          description,
          price,
          location,
          place_id,
          property_type,
          bedrooms,
          bathrooms,
          sqft,
          status
        ) values (
          ${listingId}::uuid,
          ${agentId}::uuid,
          ${listing.title},
          ${listing.description},
          ${listing.price}::numeric,
          ${listing.location},
          ${listing.place_id},
          ${listing.propertyType},
          ${listing.bedrooms},
          ${listing.bathrooms},
          ${listing.sqft},
          ${listing.status}
        )
        on conflict (id) do nothing
      `

      await sql`delete from public.listing_images where listing_id = ${listingId}::uuid`

      for (let i = 0; i < listing.imageUrls.length; i += 1) {
        const url = listing.imageUrls[i]
        await sql`
          insert into public.listing_images (id, listing_id, url, display_order)
          values (${crypto.randomUUID()}::uuid, ${listingId}::uuid, ${url}, ${i})
        `
      }
    }

    process.stdout.write(`Seeded profile ${agentId} and ${insertedListingIds.length} listings\n`)
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
