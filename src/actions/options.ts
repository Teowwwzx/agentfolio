'use server'

import sql from '@/lib/db'

export async function getListingOptions() {
  const [categories, types, tags] = await Promise.all([
    sql`SELECT id, name, slug FROM property_categories ORDER BY name`,
    sql`SELECT id, name, slug FROM property_types ORDER BY name`,
    sql`SELECT id, name, color FROM property_tags ORDER BY name`
  ])
  
  return {
    categories: categories as unknown as { id: string, name: string, slug: string }[],
    types: types as unknown as { id: string, name: string, slug: string }[],
    tags: tags as unknown as { id: string, name: string, color: string }[]
  }
}