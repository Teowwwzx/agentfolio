'use client'

import { useEffect, useState } from 'react'
import { updateListingAction } from '@/actions/listings'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { X, UploadCloud } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { ListingWithImages } from '@/types'

interface EditListingModalProps {
  listing: ListingWithImages & { tag_ids: string[] } | null
  isOpen: boolean
  onClose: () => void
  options: {
    categories: { id: string, name: string }[],
    types: { id: string, name: string }[],
    tags: { id: string, name: string, color: string }[]
  } | null
}

export function EditListingModal({ listing, isOpen, onClose, options }: EditListingModalProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  // Reset state when listing changes
  useEffect(() => {
    if (listing) {
      setImageUrls(listing.images.map(img => img.url))
      setError(null)
    }
  }, [listing])

  if (!listing) return null

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
      const result = await updateListingAction(undefined, formData)
      if (result?.success) {
        onClose()
      } else {
        setError(result?.error || 'Failed to update listing')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Listing" maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="id" value={listing.id} />
        <input type="hidden" name="imageUrls" value={imageUrls.join(',')} />

        <div className="space-y-4">
          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Images</label>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              {imageUrls.map((url, index) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 group">
                  <Image src={url} alt={`Listing image ${index + 1}`} fill className="object-cover" />
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
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                    <span className="text-xs text-slate-500">Upload</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              name="title"
              defaultValue={listing.title || ''}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (RM)</label>
              <input
                name="price"
                type="number"
                defaultValue={listing.price || ''}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                name="status"
                defaultValue={listing.status}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                name="categoryId"
                defaultValue={listing.category_id || ''}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {options?.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
              <select
                name="typeId"
                defaultValue={listing.type_id || ''}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
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
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag.id}
                    defaultChecked={listing.tag_ids?.includes(tag.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span style={{ color: tag.color }}>{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
              <input
                name="location"
                defaultValue={listing.location || ''}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Place ID (Google Maps)</label>
              <input
                name="placeId"
                defaultValue={listing.place_id || ''}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sqft</label>
              <input
                name="sqft"
                type="number"
                defaultValue={listing.sqft || ''}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
              <input
                name="bedrooms"
                type="number"
                defaultValue={listing.bedrooms || ''}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
              <input
                name="bathrooms"
                type="number"
                defaultValue={listing.bathrooms || ''}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={5}
              defaultValue={listing.description || ''}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
