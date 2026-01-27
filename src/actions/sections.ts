
'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Helper to ensure auth
async function requireAuth() {
  const session = await getSession()
  if (!session || !session.user || !session.user.id) {
    redirect('/admin/login')
  }
  return session
}

export type PageSection = {
  id: string
  title: string
  section_type: 'featured' | 'latest' | 'category' | 'tag'
  layout_type: 'grid_3' | 'list_1' | 'carousel' | 'hero_grid'
  filter_config: {
    tag_id?: string
    category_id?: string
    limit?: number
  } | null
  display_order: number
  is_active: boolean
  created_at: Date
}

export async function getSections() {
  const sections = await sql<PageSection[]>`
    SELECT * FROM page_sections
    ORDER BY display_order ASC
  `
  return sections
}

export async function createSection(formData: FormData) {
  await requireAuth()
  const title = formData.get('title') as string
  const section_type = formData.get('section_type') as string
  const layout_type = formData.get('layout_type') as string
  const tag_id = formData.get('tag_id') as string
  const category_id = formData.get('category_id') as string
  const limit = formData.get('limit') ? parseInt(formData.get('limit') as string) : 6
  
  const filter_config = {
    tag_id: tag_id || undefined,
    category_id: category_id || undefined,
    limit
  }

  // Get max order to append
  const [maxOrder] = await sql`SELECT MAX(display_order) as max_order FROM page_sections`
  const nextOrder = (maxOrder?.max_order ?? -1) + 1

  await sql`
    INSERT INTO page_sections (title, section_type, layout_type, filter_config, display_order)
    VALUES (${title}, ${section_type}, ${layout_type}, ${sql.json(filter_config)}, ${nextOrder})
  `
  
  revalidatePath('/admin/sections')
  revalidatePath('/')
}

export async function updateSection(id: string, formData: FormData) {
  await requireAuth()
  const title = formData.get('title') as string
  const section_type = formData.get('section_type') as string
  const layout_type = formData.get('layout_type') as string
  const tag_id = formData.get('tag_id') as string
  const category_id = formData.get('category_id') as string
  const limit = formData.get('limit') ? parseInt(formData.get('limit') as string) : 6
  const is_active = formData.get('is_active') === 'on'

  const filter_config = {
    tag_id: tag_id || undefined,
    category_id: category_id || undefined,
    limit
  }

  await sql`
    UPDATE page_sections
    SET title = ${title},
        section_type = ${section_type},
        layout_type = ${layout_type},
        filter_config = ${sql.json(filter_config)},
        is_active = ${is_active}
    WHERE id = ${id}
  `

  revalidatePath('/admin/sections')
  revalidatePath('/')
}

export async function deleteSection(id: string) {
  await requireAuth()
  await sql`DELETE FROM page_sections WHERE id = ${id}`
  revalidatePath('/admin/sections')
  revalidatePath('/')
}

export async function updateSectionOrder(items: { id: string; display_order: number }[]) {
  await requireAuth()
  // Use transaction for bulk update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await sql.begin(async (tx: any) => {
    for (const item of items) {
      await tx`
        UPDATE page_sections
        SET display_order = ${item.display_order}
        WHERE id = ${item.id}
      `
    }
  })
  revalidatePath('/admin/sections')
  revalidatePath('/')
}
