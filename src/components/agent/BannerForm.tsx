'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BannerFormProps {
    action: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function BannerForm({ action }: BannerFormProps) {
    const [imageUrl, setImageUrl] = useState('')
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
                router.push('/agent/banners')
                router.refresh()
            } else {
                setError(result.error || 'Failed to create banner')
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

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">Banner Image *</label>
                {imageUrl && (
                    <div className="mb-3 relative w-full h-48 rounded overflow-hidden bg-gray-100">
                        <Image src={imageUrl} alt="Banner preview" fill className="object-cover" />
                    </div>
                )}
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                    onSuccess={(result: any) => {
                        setImageUrl(result.info.secure_url)
                    }}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            {imageUrl ? 'Change Image' : 'Upload Image'}
                        </button>
                    )}
                </CldUploadWidget>
                <input type="hidden" name="image_url" value={imageUrl} required />
            </div>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Banner title"
                />
            </div>

            {/* Link URL */}
            <div>
                <label htmlFor="link_url" className="block text-sm font-medium mb-2">
                    Link URL (optional)
                </label>
                <input
                    type="url"
                    id="link_url"
                    name="link_url"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                />
            </div>

            {/* Position */}
            <div>
                <label htmlFor="position" className="block text-sm font-medium mb-2">
                    Position *
                </label>
                <select
                    id="position"
                    name="position"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="hero">Hero (Top of homepage)</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                </select>
            </div>

            {/* Display Order */}
            <div>
                <label htmlFor="display_order" className="block text-sm font-medium mb-2">
                    Display Order
                </label>
                <input
                    type="number"
                    id="display_order"
                    name="display_order"
                    defaultValue={0}
                    min={0}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                    {isPending ? 'Creating...' : 'Create Banner'}
                </button>
                <Link
                    href="/agent/banners"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    Cancel
                </Link>
            </div>
        </form>
    )
}
