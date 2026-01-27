'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CreateAgentFormProps {
    action: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function CreateAgentForm({ action }: CreateAgentFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await action(formData)
            if (result.success) {
                router.push('/admin/dashboard/agents')
                router.refresh()
            } else {
                setError(result.error || 'Failed to create agent')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="agent@example.com"
                />
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password *
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Minimum 6 characters"
                />
            </div>

            {/* Full Name */}
            <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Agent's full name"
                />
            </div>

            {/* Phone Number */}
            <div>
                <label htmlFor="phone_number" className="block text-sm font-medium mb-2">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="60123456789"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isPending ? 'Creating...' : 'Create Agent'}
                </button>
                <Link
                    href="/admin/dashboard/agents"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    Cancel
                </Link>
            </div>
        </form>
    )
}
