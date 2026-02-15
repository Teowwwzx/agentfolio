'use client'

import { useState, useEffect } from 'react'
import { getMyTeam, createTeamAction, addTeamMemberAction, removeTeamMemberAction, deleteTeamAction, getTeamMembers } from '@/actions/team'
import { Users, Plus, Trash2, Crown, Mail, UserPlus, AlertTriangle } from 'lucide-react'

interface TeamMember {
    id: string
    user_id: string
    role: string
    profile: {
        id: string
        full_name: string | null
        email: string | null
        avatar_url: string | null
    } | null
}

export default function TeamPage() {
    const [loading, setLoading] = useState(true)
    const [team, setTeam] = useState<any>(null)
    const [role, setRole] = useState<'leader' | 'member' | null>(null)
    const [members, setMembers] = useState<TeamMember[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        loadTeam()
    }, [])

    const loadTeam = async () => {
        setLoading(true)
        const { team: t, role: r } = await getMyTeam()
        setTeam(t)
        setRole(r)

        if (t) {
            const m = await getTeamMembers(t.id)
            setMembers(m)
        }
        setLoading(false)
    }

    const handleCreateTeam = async (formData: FormData) => {
        setError('')
        const result = await createTeamAction(formData)
        if (result.success) {
            setSuccess('Team created!')
            setShowCreateForm(false)
            loadTeam()
        } else {
            setError(result.error || 'Failed to create team')
        }
    }

    const handleAddMember = async (formData: FormData) => {
        setError('')
        formData.append('team_id', team.id)
        const result = await addTeamMemberAction(formData)
        if (result.success) {
            setSuccess('Member added!')
            setShowAddMember(false)
            loadTeam()
        } else {
            setError(result.error || 'Failed to add member')
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Remove this member?')) return
        const formData = new FormData()
        formData.append('team_id', team.id)
        formData.append('member_id', memberId)
        const result = await removeTeamMemberAction(formData)
        if (result.success) {
            loadTeam()
        } else {
            setError(result.error || 'Failed to remove member')
        }
    }

    const handleDeleteTeam = async () => {
        const formData = new FormData()
        formData.append('team_id', team.id)
        const result = await deleteTeamAction(formData)
        if (result.success) {
            setTeam(null)
            setRole(null)
            setMembers([])
            setShowDeleteConfirm(false)
        } else {
            setError(result.error || 'Failed to delete team')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-500">Loading...</p>
            </div>
        )
    }

    // No team - show create form
    if (!team) {
        return (
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">Team Management</h1>

                {!showCreateForm ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
                        <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Team Yet</h2>
                        <p className="text-slate-500 mb-6">Create a team to collaborate with other agents.</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Create Team
                        </button>
                    </div>
                ) : (
                    <form action={handleCreateTeam} className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-lg font-semibold mb-4">Create Your Team</h2>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Team Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Property Masters"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief description of your team"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                )}
            </div>
        )
    }

    // Has team - show team dashboard
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Team Management</h1>
                {role === 'leader' && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Team
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{success}</div>
            )}

            {/* Team Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{team.name}</h2>
                        {team.description && (
                            <p className="text-slate-500 text-sm">{team.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className={`px-2 py-1 rounded-full ${role === 'leader' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'}`}>
                        {role === 'leader' ? '👑 Leader' : '👤 Member'}
                    </span>
                    <span>·</span>
                    <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Members List */}
            <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Team Members</h3>
                    {role === 'leader' && (
                        <button
                            onClick={() => setShowAddMember(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Member
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                {member.profile?.avatar_url ? (
                                    <img
                                        src={member.profile.avatar_url}
                                        alt=""
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                        {member.profile?.full_name?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium flex items-center gap-1">
                                        {member.profile?.full_name || 'Unknown'}
                                        {member.role === 'leader' && <Crown className="w-4 h-4 text-amber-500" />}
                                    </p>
                                    <p className="text-sm text-slate-500">{member.profile?.email}</p>
                                </div>
                            </div>
                            {role === 'leader' && member.role !== 'leader' && (
                                <button
                                    onClick={() => handleRemoveMember(member.user_id)}
                                    className="text-red-500 hover:text-red-600 p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <form action={handleAddMember} className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Member Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="colleague@example.com"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                The user must have an existing AgentFolio account.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowAddMember(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="text-lg font-semibold">Delete Team?</h3>
                        </div>

                        <p className="text-slate-600 mb-6">
                            This will permanently delete "{team.name}" and remove all members. This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTeam}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
