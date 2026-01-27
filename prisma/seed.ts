
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = '123123'
    const hashedPassword = await bcrypt.hash(password, 10)

    // 1. Create/Update Admin User
    const adminEmail = 'admin@gmail.com'
    const admin = await prisma.users.upsert({
        where: { email: adminEmail },
        update: {
            hashed_password: hashedPassword,
            role: 'admin',
            status: 'active',
        },
        create: {
            email: adminEmail,
            hashed_password: hashedPassword,
            role: 'admin',
            status: 'active',
        },
    })
    console.log(`✅ Admin user upserted: ${admin.email}`)

    // 2. Create/Update Agent User
    const agentEmail = 'agent1@gmail.com'
    const agent = await prisma.users.upsert({
        where: { email: agentEmail },
        update: {
            hashed_password: hashedPassword,
            role: 'agent',
            status: 'active',
        },
        create: {
            email: agentEmail,
            hashed_password: hashedPassword,
            role: 'agent',
            status: 'active',
        },
    })
    console.log(`✅ Agent user upserted: ${agent.email}`)

    // 3. Create/Update Agent Profile
    // Profiles share the same ID as the user
    await prisma.profiles.upsert({
        where: { id: agent.id },
        update: {
            full_name: 'Demo Agent 1',
            // If intro fields are supported, we can set them here, otherwise rely on defaults
            intro_title: 'Find Your Dream Home',
            intro_description: 'Discover the best properties in the market.',
        },
        create: {
            id: agent.id,
            email: agentEmail,
            full_name: 'Demo Agent 1',
            description: 'Top rated agent with 10 years experience.',
            phone_number: '60123456789',
            intro_title: 'Find Your Dream Home',
            intro_description: 'Discover the best properties in the market.',
        },
    })
    console.log(`✅ Agent profile upserted for: ${agentEmail}`)

    // 4. Create sample listings for the agent if none exist
    const listingCount = await prisma.listings.count({
        where: { user_id: agent.id }
    })

    if (listingCount === 0) {
        console.log('creating sample listings...')

        // Ensure categories/types exist first (optional, but good practice)
        // We'll skip complex category logic for now and just insert raw if needed, 
        // or rely on the simpler listings model.

        await prisma.listings.create({
            data: {
                user_id: agent.id,
                title: 'Luxury KLCC Condo',
                description: 'Walking distance to Twin Towers.',
                price: 1250000,
                location: 'Kuala Lumpur',
                bedrooms: 3,
                bathrooms: 2,
                sqft: 1500,
                status: 'active',
                listing_images: {
                    create: {
                        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                        display_order: 0
                    }
                }
            }
        })

        await prisma.listings.create({
            data: {
                user_id: agent.id,
                title: 'Spacious Bungalow in Damansara',
                description: 'Private pool and large garden.',
                price: 4500000,
                location: 'Damansara Heights',
                bedrooms: 6,
                bathrooms: 7,
                sqft: 5000,
                status: 'active',
                listing_images: {
                    create: {
                        url: 'https://images.unsplash.com/photo-1600596542815-2250c385e381?auto=format&fit=crop&w=1200&q=80',
                        display_order: 0
                    }
                }
            }
        })

        console.log('✅ Sample listings created')
    }

    // 5. Create default Hero Banner
    const bannerCount = await prisma.banners.count({
        where: { user_id: agent.id }
    })

    if (bannerCount === 0) {
        await prisma.banners.create({
            data: {
                user_id: agent.id,
                title: 'Summer Sale',
                image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
                link_url: 'https://example.com',
                position: 'hero',
                is_active: true,
                display_order: 0
            }
        })
        console.log('✅ Default Hero Banner created')
    }

    console.log(`\n🎉 Seed finished. Password for all users is: ${password}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
