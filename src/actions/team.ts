'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAgentAuth() {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }
    return session.user.id
}

// Get team for current user (as leader or member)
export async function getMyTeam() {
    const userId = await requireAgentAuth()

    // Check if user is a leader
    const teamAsLeader = await prisma.teams.findFirst({
        where: { leader_id: userId },
        include: {
            members: true
        }
    })

    if (teamAsLeader) {
        return { team: teamAsLeader, role: 'leader' as const }
    }

    // Check if user is a member
    const membership = await prisma.team_members.findFirst({
        where: { user_id: userId },
        include: {
            team: {
                include: { members: true }
            }
        }
    })

    if (membership) {
        return { team: membership.team, role: 'member' as const }
    }

    return { team: null, role: null }
}

// Create a new team (current user becomes leader)
export async function createTeamAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const name = formData.get('name') as string
    const description = formData.get('description') as string || null

    if (!name) {
        return { success: false, error: 'Team name is required' }
    }

    try {
        // Check if user already leads a team
        const existingTeam = await prisma.teams.findFirst({
            where: { leader_id: userId }
        })

        if (existingTeam) {
            return { success: false, error: 'You already lead a team' }
        }

        // Create team
        const team = await prisma.teams.create({
            data: {
                name,
                description,
                leader_id: userId,
                members: {
                    create: {
                        user_id: userId,
                        role: 'leader'
                    }
                }
            }
        })

        revalidatePath('/agent/team')
        return { success: true, team }
    } catch (error) {
        console.error('Create team error:', error)
        return { success: false, error: 'Failed to create team' }
    }
}

// Add member to team (leader only)
export async function addTeamMemberAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const teamId = formData.get('team_id') as string
    const memberEmail = formData.get('email') as string

    if (!teamId || !memberEmail) {
        return { success: false, error: 'Team ID and email are required' }
    }

    try {
        // Verify current user is the leader
        const team = await prisma.teams.findFirst({
            where: { id: teamId, leader_id: userId }
        })

        if (!team) {
            return { success: false, error: 'You are not the leader of this team' }
        }

        // Find user by email
        const member = await prisma.profiles.findFirst({
            where: { email: memberEmail }
        })

        if (!member) {
            return { success: false, error: 'User not found' }
        }

        // Check if already a member
        const existing = await prisma.team_members.findFirst({
            where: { team_id: teamId, user_id: member.id }
        })

        if (existing) {
            return { success: false, error: 'User is already a team member' }
        }

        // Add member
        await prisma.team_members.create({
            data: {
                team_id: teamId,
                user_id: member.id,
                role: 'member'
            }
        })

        revalidatePath('/agent/team')
        return { success: true }
    } catch (error) {
        console.error('Add team member error:', error)
        return { success: false, error: 'Failed to add member' }
    }
}

// Remove member from team (leader only)
export async function removeTeamMemberAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const teamId = formData.get('team_id') as string
    const memberId = formData.get('member_id') as string

    if (!teamId || !memberId) {
        return { success: false, error: 'Team ID and member ID are required' }
    }

    try {
        // Verify current user is the leader
        const team = await prisma.teams.findFirst({
            where: { id: teamId, leader_id: userId }
        })

        if (!team) {
            return { success: false, error: 'You are not the leader of this team' }
        }

        // Cannot remove self (leader)
        if (memberId === userId) {
            return { success: false, error: 'Cannot remove yourself from the team' }
        }

        // Remove member
        await prisma.team_members.deleteMany({
            where: { team_id: teamId, user_id: memberId }
        })

        revalidatePath('/agent/team')
        return { success: true }
    } catch (error) {
        console.error('Remove team member error:', error)
        return { success: false, error: 'Failed to remove member' }
    }
}

// Get team members with profile info
export async function getTeamMembers(teamId: string) {
    const members = await prisma.team_members.findMany({
        where: { team_id: teamId }
    })

    // Fetch profiles for each member
    const memberProfiles = await Promise.all(
        members.map(async (m) => {
            const profile = await prisma.profiles.findFirst({
                where: { id: m.user_id },
                select: {
                    id: true,
                    full_name: true,
                    email: true,
                    avatar_url: true,
                    phone_number: true
                }
            })
            return { ...m, profile }
        })
    )

    return memberProfiles
}

// Delete team (leader only)
export async function deleteTeamAction(formData: FormData) {
    const userId = await requireAgentAuth()

    const teamId = formData.get('team_id') as string

    if (!teamId) {
        return { success: false, error: 'Team ID is required' }
    }

    try {
        // Verify current user is the leader
        const team = await prisma.teams.findFirst({
            where: { id: teamId, leader_id: userId }
        })

        if (!team) {
            return { success: false, error: 'You are not the leader of this team' }
        }

        // Delete team (cascade deletes members)
        await prisma.teams.delete({
            where: { id: teamId }
        })

        revalidatePath('/agent/team')
        return { success: true }
    } catch (error) {
        console.error('Delete team error:', error)
        return { success: false, error: 'Failed to delete team' }
    }
}
