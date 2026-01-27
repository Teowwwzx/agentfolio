'use client'

import { useState } from 'react'
import { toggleBannerActiveAction, deleteBannerAction } from '@/actions/banners'
import Image from 'next/image'
import { Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react'

interface Banner {
    id: string
    title: string
    image_url: string
    link_url: string | null
    position: string | null
    is_active: boolean | null
    display_order: number | null
    user_id: string
    created_at: Date
    updated_at: Date
}

export function BannerList({ banners }: { banners: Banner[] }) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleToggleActive = async (id: string) => {
        setLoading(id)
        await toggleBannerActiveAction(id)
        setLoading(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return
        setLoading(id)
        await deleteBannerAction(id)
        setLoading(null)
    }

    if (banners.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No banners yet. Create your first banner!</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {banners.map((banner) => (
                <div
                    key={banner.id}
                    className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                >
                    {/* Image */}
                    <div className="w-32 h-20 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                            src={banner.image_url}
                            alt={banner.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h3 className="font-semibold">{banner.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span className="capitalize">{banner.position}</span>
                            <span>•</span>
                            <span>Order: {banner.display_order}</span>
                            {banner.link_url && (
                                <>
                                    <span>•</span>
                                    <a
                                        href={banner.link_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:underline"
                                    >
                                        Link <ExternalLink className="w-3 h-3" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleToggleActive(banner.id)}
                            disabled={loading === banner.id}
                            className={`p-2 rounded transition ${banner.is_active
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } disabled:opacity-50`}
                            title={banner.is_active ? 'Active' : 'Inactive'}
                        >
                            {banner.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => handleDelete(banner.id)}
                            disabled={loading === banner.id}
                            className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
