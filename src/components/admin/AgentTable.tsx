'use client'

import { useState } from 'react'
import { toggleAgentStatusAction, deleteAgentAction } from '@/actions/admin'
import { UserCheck, UserX, Trash2 } from 'lucide-react'

interface Agent {
    id: string
    email: string
    full_name: string | null
    phone_number: string | null
    status: string
    created_at: Date
}

export function AgentTable({ agents }: { agents: Agent[] }) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleToggleStatus = async (id: string) => {
        setLoading(id)
        await toggleAgentStatusAction(id)
        setLoading(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this agent? This will also delete all their listings and data.')) return
        setLoading(id)
        await deleteAgentAction(id)
        setLoading(null)
    }

    if (agents.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No agents yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {agents.map((agent) => (
                        <tr key={agent.id}>
                            <td className="px-6 py-4 text-sm">
                                {agent.full_name || <span className="text-gray-400">Not set</span>}
                            </td>
                            <td className="px-6 py-4 text-sm">{agent.email}</td>
                            <td className="px-6 py-4 text-sm">
                                {agent.phone_number || <span className="text-gray-400">Not set</span>}
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${agent.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {agent.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(agent.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(agent.id)}
                                        disabled={loading === agent.id}
                                        className={`p-2 rounded transition ${agent.status === 'active'
                                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                                            } disabled:opacity-50`}
                                        title={agent.status === 'active' ? 'Deactivate' : 'Activate'}
                                    >
                                        {agent.status === 'active' ? (
                                            <UserX className="w-4 h-4" />
                                        ) : (
                                            <UserCheck className="w-4 h-4" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(agent.id)}
                                        disabled={loading === agent.id}
                                        className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
