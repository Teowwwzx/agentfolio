'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { updateProfileAction } from '@/actions/profile'
import Image from 'next/image'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Profile {
    id: string
    full_name: string | null
    description: string | null
    phone_number: string | null
    avatar_url: string | null
    intro_title?: string | null
    intro_description?: string | null
}

export function ProfileForm({ profile }: { profile: Profile }) {
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setSuccess(false)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await updateProfileAction(formData)
            if (result.success) {
                setSuccess(true)
                router.refresh()
            } else {
                setError(result.error || 'Failed to update profile')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Profile updated successfully!
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Avatar Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                        onSuccess={(result: any) => {
                            setAvatarUrl(result.info.secure_url)
                        }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Upload Photo
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
                <input type="hidden" name="avatar_url" value={avatarUrl} />
            </div>

            {/* Full Name */}
            <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    defaultValue={profile.full_name || ''}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Bio / Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={profile.description || ''}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell visitors about yourself and your expertise..."
                />
            </div>

            {/* Phone Number */}
            <div>
                <label htmlFor="phone_number" className="block text-sm font-medium mb-2">
                    Phone Number (WhatsApp) *
                </label>
                <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    defaultValue={profile.phone_number || ''}
                    placeholder="60123456789"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Include country code without + (e.g., 60123456789 for Malaysia)
                </p>
            </div>

            <hr className="border-gray-200 my-6" />

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Homepage Settings</h3>
                <p className="text-sm text-blue-700 mb-4">
                    Customize the welcome message on your homepage. Leave blank to use defaults.
                </p>

                {/* Intro Title */}
                <div className="mb-4">
                    <label htmlFor="intro_title" className="block text-sm font-medium mb-2">
                        Welcome Title
                    </label>
                    <input
                        type="text"
                        id="intro_title"
                        name="intro_title"
                        defaultValue={profile.intro_title || 'Find Your Dream Home'}
                        placeholder="e.g. Find Your Dream Home"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Intro Description */}
                <div>
                    <label htmlFor="intro_description" className="block text-sm font-medium mb-2">
                        Welcome Description
                    </label>
                    <input
                        type="text"
                        id="intro_description"
                        name="intro_description"
                        defaultValue={profile.intro_description || 'Discover the best properties in the market.'}
                        placeholder="e.g. Discover the best properties in the market."
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
                {isPending ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    )
}
