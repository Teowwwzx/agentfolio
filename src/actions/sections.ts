'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Prisma } from '@prisma/client'

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
  const sections = await prisma.page_sections.findMany({
    orderBy: { display_order: 'asc' }
  })

  return sections.map(section => ({
    ...section,
    section_type: section.section_type as PageSection['section_type'],
    layout_type: section.layout_type as PageSection['layout_type'],
    filter_config: section.filter_config as PageSection['filter_config'],
    is_active: section.is_active ?? true
  })) as PageSection[]
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
  const maxOrderResult = await prisma.page_sections.aggregate({
    _max: { display_order: true }
  })
  const nextOrder = (maxOrderResult._max.display_order ?? -1) + 1

  await prisma.page_sections.create({
    data: {
      title,
      section_type,
      layout_type,
      filter_config: filter_config as Prisma.InputJsonValue,
      display_order: nextOrder
    }
  })

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

  await prisma.page_sections.update({
    where: { id },
    data: {
      title,
      section_type,
      layout_type,
      filter_config: filter_config as Prisma.InputJsonValue,
      is_active
    }
  })

  revalidatePath('/admin/sections')
  revalidatePath('/')
}

export async function deleteSection(id: string) {
  await requireAuth()
  await prisma.page_sections.delete({ where: { id } })
  revalidatePath('/admin/sections')
  revalidatePath('/')
}

export async function updateSectionOrder(items: { id: string; display_order: number }[]) {
  await requireAuth()

  // Use transaction for bulk update
  await prisma.$transaction(
    items.map(item =>
      prisma.page_sections.update({
        where: { id: item.id },
        data: { display_order: item.display_order }
      })
    )
  )

  revalidatePath('/admin/sections')
  revalidatePath('/')
}
