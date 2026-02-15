'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    const [currentIndex, setCurrentIndex] = useState(0)

    if (positionBanners.length === 0) return null

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (positionBanners.length <= 1) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % positionBanners.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [positionBanners.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % positionBanners.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + positionBanners.length) % positionBanners.length)
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    // If only one banner, show without carousel controls
    if (positionBanners.length === 1) {
        return (
            <section className="mb-8">
                <BannerCard banner={positionBanners[0]} />
            </section>
        )
    }

    if (position === 'hero') {
        return (
            <section className="mb-8 relative group">
                {/* Carousel Container */}
                <div className="relative overflow-hidden rounded-xl">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {positionBanners.map((banner) => (
                            <div key={banner.id} className="w-full flex-shrink-0">
                                <BannerCard banner={banner} />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous banner"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next banner"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                    {positionBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-blue-600 w-8'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                }`}
                            aria-label={`Go to banner ${index + 1}`}
                        />
                    ))}
                </div>
            </section>
        )
    }

    // Keep sidebar and footer as grid for now
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
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group">
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
