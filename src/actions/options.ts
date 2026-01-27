'use server'

import { prisma } from '@/lib/prisma'

export async function getListingOptions() {
  const [categories, types] = await Promise.all([
    prisma.property_categories.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' }
    }),
    prisma.property_types.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' }
    })
    // property_tags table was removed, so we no longer fetch tags
  ])

  return {
    categories: categories as { id: string, name: string, slug: string }[],
    types: types as { id: string, name: string, slug: string }[],
    tags: [] as { id: string, name: string, color: string }[] // Empty array since tags table was removed
  }
}