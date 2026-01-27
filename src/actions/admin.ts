'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

async function requireAdminAuth() {
    const session = await getAdminSession()
    if (!session || session.user.role !== 'admin') {
        redirect('/admin/auth/login')
    }
    return session.user.id
}

export async function getAllAgents() {
    await requireAdminAuth()

    try {
        const agents = await prisma.users.findMany({
            where: { role: 'agent' },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                created_at: true
            }
        })

        // Get profiles for these users
        const agentIds = agents.map(a => a.id)
        const profiles = await prisma.profiles.findMany({
            where: { id: { in: agentIds } },
            select: {
                id: true,
                full_name: true,
                phone_number: true,
                avatar_url: true
            }
        })

        // Merge profiles into agents
        const profileMap = new Map(profiles.map(p => [p.id, p]))
        return agents.map(agent => ({
            ...agent,
            full_name: profileMap.get(agent.id)?.full_name || null,
            phone_number: profileMap.get(agent.id)?.phone_number || null,
            avatar_url: profileMap.get(agent.id)?.avatar_url || null
        }))
    } catch (error) {
        console.error('Get agents error:', error)
        return []
    }
}

export async function createAgentAction(formData: FormData) {
    await requireAdminAuth()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string
    const phone_number = formData.get('phone_number') as string

    if (!email || !password) {
        return { success: false, error: 'Email and password are required' }
    }

    try {
        // Hash password
        const hashed_password = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.users.create({
            data: {
                email,
                hashed_password,
                role: 'agent',
                status: 'active'
            }
        })

        // Create profile
        await prisma.profiles.create({
            data: {
                id: user.id,
                full_name: full_name || null,
                phone_number: phone_number || null,
                email
            }
        })

        revalidatePath('/admin/dashboard/agents')
        return { success: true }
    } catch (error: any) {
        console.error('Create agent error:', error)
        if (error.code === 'P2002') { // Unique constraint violation
            return { success: false, error: 'Email already exists' }
        }
        return { success: false, error: 'Failed to create agent' }
    }
}

export async function updateAgentAction(formData: FormData) {
    await requireAdminAuth()

    const id = formData.get('id') as string
    const email = formData.get('email') as string
    const full_name = formData.get('full_name') as string
    const phone_number = formData.get('phone_number') as string
    const status = formData.get('status') as string

    try {
        // Update user
        await prisma.users.updateMany({
            where: { id, role: 'agent' },
            data: { email, status }
        })

        // Update profile
        await prisma.profiles.update({
            where: { id },
            data: { full_name, phone_number, email }
        })

        revalidatePath('/admin/dashboard/agents')
        return { success: true }
    } catch (error: any) {
        console.error('Update agent error:', error)
        if (error.code === 'P2002') {
            return { success: false, error: 'Email already exists' }
        }
        return { success: false, error: 'Failed to update agent' }
    }
}

export async function deleteAgentAction(id: string) {
    await requireAdminAuth()

    try {
        await prisma.users.deleteMany({
            where: { id, role: 'agent' }
        })

        revalidatePath('/admin/dashboard/agents')
        return { success: true }
    } catch (error) {
        console.error('Delete agent error:', error)
        return { success: false, error: 'Failed to delete agent' }
    }
}

export async function resetAgentPasswordAction(formData: FormData) {
    await requireAdminAuth()

    const id = formData.get('id') as string
    const new_password = formData.get('new_password') as string

    if (!new_password || new_password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
    }

    try {
        const hashed_password = await bcrypt.hash(new_password, 10)

        await prisma.users.updateMany({
            where: { id, role: 'agent' },
            data: { hashed_password }
        })

        revalidatePath('/admin/dashboard/agents')
        return { success: true }
    } catch (error) {
        console.error('Reset password error:', error)
        return { success: false, error: 'Failed to reset password' }
    }
}

export async function toggleAgentStatusAction(id: string) {
    await requireAdminAuth()

    try {
        // Get current status
        const user = await prisma.users.findFirst({
            where: { id, role: 'agent' },
            select: { status: true }
        })

        if (!user) {
            return { success: false, error: 'Agent not found' }
        }

        await prisma.users.update({
            where: { id },
            data: { status: user.status === 'active' ? 'inactive' : 'active' }
        })

        revalidatePath('/admin/dashboard/agents')
        return { success: true }
    } catch (error) {
        console.error('Toggle status error:', error)
        return { success: false, error: 'Failed to toggle status' }
    }
}
