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

export async function updateProfileAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const full_name = formData.get('full_name') as string
    const description = formData.get('description') as string
    const phone_number = formData.get('phone_number') as string
    const avatar_url = formData.get('avatar_url') as string
    const intro_title = formData.get('intro_title') as string
    const intro_description = formData.get('intro_description') as string

    try {
        await prisma.profiles.update({
            where: { id: userId },
            data: {
                full_name,
                description,
                phone_number,
                avatar_url,
                intro_title,
                intro_description
            }
        })

        revalidatePath('/agent/profile')
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
