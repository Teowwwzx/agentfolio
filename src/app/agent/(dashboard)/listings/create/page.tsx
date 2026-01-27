'use client'

import { useState, useEffect } from 'react'
import { createListingAction } from '@/actions/listings'
import { getListingOptions } from '@/actions/options'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, X, UploadCloud } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CreateListingPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [options, setOptions] = useState<{
        categories: { id: string, name: string, slug: string }[],
        types: { id: string, name: string, slug: string }[],
        tags: { id: string, name: string, color: string }[]
    } | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Fetch options on mount
        getListingOptions().then(setOptions).catch(console.error)
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = (result: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const info = result.info as any;
        if (result.event === 'success') {
            setImageUrls((prev) => [...prev, info.secure_url])
        }
    }

    const removeImage = (urlToRemove: string) => {
        setImageUrls((prev) => prev.filter((url) => url !== urlToRemove))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createListingAction(undefined, formData)
            if (result?.error) {
                setError(result.error)
            } else {
                // Explicitly redirect to agent listings on success
                router.push('/agent/listings')
            }
        } catch (err) {
            console.log('Error submitting form', err)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/agent/listings" className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Listings
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Add New Listing</h1>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="imageUrls" value={imageUrls.join(',')} />

                    <div className="space-y-4">
                        {/* Images Section */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Images</label>

                            <div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
                                {imageUrls.map((url: string, index: number) => (
                                    <div key={url} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 group">
                                        <Image src={url} alt={`Uploaded ${index}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(url)}
                                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                <CldUploadWidget
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "agentfolio_unsigned"}
                                    onSuccess={handleUpload}
                                >
                                    {({ open }) => {
                                        return (
                                            <button
                                                type="button"
                                                onClick={() => open()}
                                                className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 hover:bg-slate-50 transition-colors"
                                            >
                                                <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                                                <span className="text-xs text-slate-500">Upload</span>
                                            </button>
                                        );
                                    }}
                                </CldUploadWidget>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input name="title" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" placeholder="e.g. Modern Condo in KLCC" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price (RM)</label>
                                <input name="price" type="number" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select name="status" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500">
                                    <option value="active">Active</option>
                                    <option value="sold">Sold</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select name="categoryId" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500">
                                    <option value="">Select Category</option>
                                    {options?.categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                                <select name="typeId" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500">
                                    <option value="">Select Type</option>
                                    {options?.types.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {options?.tags.map((tag) => (
                                    <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-50">
                                        <input type="checkbox" name="tags" value={tag.id} className="rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                        <span style={{ color: tag.color }}>{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
                                <input name="location" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" placeholder="e.g. Kuala Lumpur" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Place ID (Google Maps)</label>
                                <input name="placeId" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" placeholder="e.g. ChIJ..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sqft</label>
                                <input name="sqft" type="number" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                                <input name="bedrooms" type="number" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                                <input name="bathrooms" type="number" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea name="description" rows={5} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" placeholder="Describe the property..." />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link href="/agent/listings">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create Listing'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
