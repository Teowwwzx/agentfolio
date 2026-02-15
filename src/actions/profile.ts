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

// Validate slug format: 3-20 chars, alphanumeric + hyphen
function validateSlug(slug: string): { valid: boolean; error?: string } {
    if (slug.length < 3) return { valid: false, error: 'Slug must be at least 3 characters' }
    if (slug.length > 20) return { valid: false, error: 'Slug must be 20 characters or less' }
    if (!/^[a-z0-9-]+$/.test(slug)) return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' }
    if (slug.startsWith('-') || slug.endsWith('-')) return { valid: false, error: 'Slug cannot start or end with a hyphen' }
    return { valid: true }
}

export async function updateProfileAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const full_name = formData.get('full_name') as string
    const description = formData.get('description') as string
    const phone_number = formData.get('phone_number') as string
    const avatar_url = formData.get('avatar_url') as string
    const intro_title = formData.get('intro_title') as string
    const intro_description = formData.get('intro_description') as string
    const slug = (formData.get('slug') as string)?.toLowerCase().trim() || null

    // Social Links (V1)
    const whatsapp_number = formData.get('whatsapp_number') as string || null
    const telegram_handle = formData.get('telegram_handle') as string || null
    const instagram_handle = formData.get('instagram_handle') as string || null
    const facebook_url = formData.get('facebook_url') as string || null
    const email_contact = formData.get('email_contact') as string || null

    try {
        // Validate slug if provided
        if (slug) {
            const validation = validateSlug(slug)
            if (!validation.valid) {
                return { success: false, error: validation.error }
            }

            // Check uniqueness (exclude current user)
            const existing = await prisma.profiles.findFirst({
                where: { slug, NOT: { id: userId } }
            })
            if (existing) {
                return { success: false, error: 'This URL is already taken by another agent' }
            }
        }

        await prisma.profiles.update({
            where: { id: userId },
            data: {
                full_name,
                description,
                phone_number,
                avatar_url,
                intro_title,
                intro_description,
                slug,
                whatsapp_number,
                telegram_handle,
                instagram_handle,
                facebook_url,
                email_contact
            }
        })

        revalidatePath('/agent/profile')
        if (slug) {
            revalidatePath(`/a/${slug}`)
        }
        return { success: true }
    } catch (error) {
        console.error('Update profile error:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

export async function getAgentProfile(userId: string) {
    try {
        const profile = await prisma.profiles.findUnique({
            where: { id: userId }
        })
        return profile
    } catch (error) {
        console.error('Get profile error:', error)
        return null
    }
}
