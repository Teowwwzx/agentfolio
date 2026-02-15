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
    slug?: string | null  // Custom URL (V4)
    // Social Links (V1)
    whatsapp_number?: string | null
    telegram_handle?: string | null
    instagram_handle?: string | null
    facebook_url?: string | null
    email_contact?: string | null
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

            {/* Custom URL Slug */}
            <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-2">
                    Your Portfolio URL
                </label>
                <div className="flex items-center">
                    <span className="px-3 py-2 bg-slate-100 border border-r-0 rounded-l-lg text-slate-500 text-sm">
                        agentfolio.com/a/
                    </span>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        defaultValue={profile.slug || ''}
                        placeholder="your-name"
                        pattern="[a-z0-9-]+"
                        minLength={3}
                        maxLength={20}
                        className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lowercase"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    3-20 characters. Lowercase letters, numbers, and hyphens only.
                </p>
                {profile.slug && (
                    <p className="text-xs text-blue-600 mt-1">
                        Your portfolio: <a href={`/a/${profile.slug}`} className="underline" target="_blank">/a/{profile.slug}</a>
                    </p>
                )}
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

            {/* Social Links Section */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Contact Links</h3>
                <p className="text-sm text-green-700 mb-4">
                    Add your social media handles so visitors can contact you easily.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WhatsApp */}
                    <div>
                        <label htmlFor="whatsapp_number" className="block text-sm font-medium mb-1">
                            📱 WhatsApp
                        </label>
                        <input
                            type="tel"
                            id="whatsapp_number"
                            name="whatsapp_number"
                            defaultValue={profile.whatsapp_number || ''}
                            placeholder="60123456789"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Telegram */}
                    <div>
                        <label htmlFor="telegram_handle" className="block text-sm font-medium mb-1">
                            ✈️ Telegram
                        </label>
                        <input
                            type="text"
                            id="telegram_handle"
                            name="telegram_handle"
                            defaultValue={profile.telegram_handle || ''}
                            placeholder="@username"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label htmlFor="instagram_handle" className="block text-sm font-medium mb-1">
                            📷 Instagram
                        </label>
                        <input
                            type="text"
                            id="instagram_handle"
                            name="instagram_handle"
                            defaultValue={profile.instagram_handle || ''}
                            placeholder="@username"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Facebook */}
                    <div>
                        <label htmlFor="facebook_url" className="block text-sm font-medium mb-1">
                            👤 Facebook
                        </label>
                        <input
                            type="url"
                            id="facebook_url"
                            name="facebook_url"
                            defaultValue={profile.facebook_url || ''}
                            placeholder="https://facebook.com/yourpage"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    {/* Email Contact */}
                    <div className="md:col-span-2">
                        <label htmlFor="email_contact" className="block text-sm font-medium mb-1">
                            ✉️ Contact Email
                        </label>
                        <input
                            type="email"
                            id="email_contact"
                            name="email_contact"
                            defaultValue={profile.email_contact || ''}
                            placeholder="contact@example.com"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>
                </div>
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
