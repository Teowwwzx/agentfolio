'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

async function requireAgentAuth() {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }
    return session.user.id
}

export async function getBanners(userId?: string) {
    try {
        if (userId) {
            // Get agent's banners
            const banners = await prisma.banners.findMany({
                where: { user_id: userId },
                orderBy: [
                    { display_order: 'asc' },
                    { created_at: 'desc' }
                ]
            })
            return banners
        } else {
            // Get active banners for public
            const banners = await prisma.banners.findMany({
                where: { is_active: true },
                orderBy: [
                    { display_order: 'asc' },
                    { created_at: 'desc' }
                ]
            })
            return banners
        }
    } catch (error) {
        console.error('Get banners error:', error)
        return []
    }
}

export async function createBannerAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const title = formData.get('title') as string
    const image_url = formData.get('image_url') as string
    const link_url = formData.get('link_url') as string
    const position = formData.get('position') as string
    const display_order = parseInt(formData.get('display_order') as string) || 0

    try {
        await prisma.banners.create({
            data: {
                user_id: userId,
                title,
                image_url,
                link_url,
                position,
                display_order
            }
        })

        revalidatePath('/agent/banners')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Create banner error:', error)
        return { success: false, error: 'Failed to create banner' }
    }
}

export async function updateBannerAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const image_url = formData.get('image_url') as string
    const link_url = formData.get('link_url') as string
    const position = formData.get('position') as string
    const display_order = parseInt(formData.get('display_order') as string) || 0

    try {
        await prisma.banners.updateMany({
            where: {
                id,
                user_id: userId  // Ensure user owns this banner
            },
            data: {
                title,
                image_url,
                link_url,
                position,
                display_order
            }
        })

        revalidatePath('/agent/banners')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Update banner error:', error)
        return { success: false, error: 'Failed to update banner' }
    }
}

export async function toggleBannerActiveAction(id: string) {
    const userId = await requireAgentAuth()

    try {
        // First get current state
        const banner = await prisma.banners.findFirst({
            where: { id, user_id: userId },
            select: { is_active: true }
        })

        if (!banner) {
            return { success: false, error: 'Banner not found' }
        }

        await prisma.banners.update({
            where: { id },
            data: { is_active: !banner.is_active }
        })

        revalidatePath('/agent/banners')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Toggle banner error:', error)
        return { success: false, error: 'Failed to toggle banner' }
    }
}

export async function deleteBannerAction(id: string) {
    const userId = await requireAgentAuth()

    try {
        await prisma.banners.deleteMany({
            where: {
                id,
                user_id: userId  // Ensure user owns this banner
            }
        })

        revalidatePath('/agent/banners')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Delete banner error:', error)
        return { success: false, error: 'Failed to delete banner' }
    }
}
