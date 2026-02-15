import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { getDb } from './db'

// password: 123123, email: {role}@gmail.com. Never change.
async function main() {
  const sql = getDb()

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('123123', 10)

    // Clear existing data (in reverse dependency order)
    console.log('Cleaning database...')
    await sql`TRUNCATE TABLE public.listing_images, public.listings, public.banners, public.profiles, public.users CASCADE`

    // Create admin user
    const [adminUser] = await sql`
      INSERT INTO public.users (email, hashed_password, role, status)
      VALUES ('admin@gmail.com', ${hashedPassword}, 'admin', 'active')
      ON CONFLICT (email) DO UPDATE
      SET hashed_password = EXCLUDED.hashed_password
      RETURNING id
    `
    console.log(`Created/Updated admin user: ${adminUser.id}`)

    // Create agent user
    const [agentUser] = await sql`
      INSERT INTO public.users (email, hashed_password, role, status)
      VALUES ('agent@gmail.com', ${hashedPassword}, 'agent', 'active')
      ON CONFLICT (email) DO UPDATE
      SET hashed_password = EXCLUDED.hashed_password
      RETURNING id
    `
    console.log(`Created/Updated agent user: ${agentUser.id}`)

    // Create/update agent profile with demo slug
    await sql`
      INSERT INTO public.profiles (id, full_name, description, phone_number, email, slug)
      VALUES (
        ${agentUser.id}::uuid,
        'Demo Agent',
        'Experienced property agent specializing in residential properties.',
        '60123456789',
        'agent@gmail.com',
        'demo'
      )
      ON CONFLICT (id) DO UPDATE
      SET 
        full_name = EXCLUDED.full_name,
        description = EXCLUDED.description,
        phone_number = EXCLUDED.phone_number,
        email = EXCLUDED.email,
        slug = EXCLUDED.slug
    `
    console.log(`Created/Updated agent profile`)

    // Seed some sample listings for the agent
    const sampleListings = [
      {
        title: 'Modern 3BR Condo in KLCC',
        description: 'Stunning city views, fully furnished, 2 parking bays, swimming pool and gym.',
        price: 850000,
        location: 'Kuala Lumpur',
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1200,
      },
      {
        title: 'Spacious Landed House in Petaling Jaya',
        description: 'Corner lot, renovated kitchen, large backyard, quiet neighborhood.',
        price: 1200000,
        location: 'Petaling Jaya',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2400,
      },
    ]

    for (const listing of sampleListings) {
      const listingId = crypto.randomUUID()
      await sql`
        INSERT INTO public.listings (
          id,
          user_id,
          title,
          description,
          price,
          location,
          bedrooms,
          bathrooms,
          sqft,
          status
        ) VALUES (
          ${listingId}::uuid,
          ${agentUser.id}::uuid,
          ${listing.title},
          ${listing.description},
          ${listing.price},
          ${listing.location},
          ${listing.bedrooms},
          ${listing.bathrooms},
          ${listing.sqft},
          'active'
        )
        ON CONFLICT (id) DO NOTHING
      `

      // Add sample image
      await sql`
        INSERT INTO public.listing_images (id, listing_id, url, display_order)
        VALUES (
          ${crypto.randomUUID()}::uuid,
          ${listingId}::uuid,
          'https://picsum.photos/1200/800?random=' || ${listingId}::text,
          0
        )
        ON CONFLICT (listing_id, display_order) DO NOTHING
      `
    }

    console.log(`\n✅ Seed completed successfully!\n`)
    console.log(`Admin Login:`)
    console.log(`  Email: admin@gmail.com`)
    console.log(`  Password: 123123`)
    console.log(`  URL: http://localhost:3000/admin/auth/login\n`)
    console.log(`Agent Login:`)
    console.log(`  Email: agent@gmail.com`)
    console.log(`  Password: 123123`)
    console.log(`  URL: http://localhost:3000/agent/login\n`)
  } catch (error) {
    console.error('Seed error:', error)
    throw error
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
