'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Banner {
    id: string
    title: string
    image_url: string
    link_url: string | null
    position: string
}

interface BannerSectionProps {
    banners: Banner[]
    position: 'hero' | 'sidebar' | 'footer'
}

export function BannerSection({ banners, position }: BannerSectionProps) {
    const positionBanners = banners.filter(b => b.position === position)

    if (positionBanners.length === 0) return null

    if (position === 'hero') {
        return (
            <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {positionBanners.map((banner) => (
                        <BannerCard key={banner.id} banner={banner} />
                    ))}
                </div>
            </section>
        )
    }

    if (position === 'sidebar') {
        return (
            <aside className="space-y-4">
                {positionBanners.map((banner) => (
                    <BannerCard key={banner.id} banner={banner} />
                ))}
            </aside>
        )
    }

    if (position === 'footer') {
        return (
            <section className="mt-12 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {positionBanners.map((banner) => (
                        <BannerCard key={banner.id} banner={banner} />
                    ))}
                </div>
            </section>
        )
    }

    return null
}

function BannerCard({ banner }: { banner: Banner }) {
    const content = (
        <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group">
            <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <p className="text-white font-semibold p-4">{banner.title}</p>
            </div>
        </div>
    )

    if (banner.link_url) {
        return (
            <Link href={banner.link_url} target="_blank" rel="noopener noreferrer">
                {content}
            </Link>
        )
    }

    return content
}
