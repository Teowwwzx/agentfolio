'use client'

import { useEffect, useState } from 'react'
import { useSavedProperties } from '@/hooks/useSavedProperties'
import { PropertyCard } from '@/components/PropertyCard'
import { ListingWithImages } from '@/types'
import { Heart, Home as HomeIcon } from 'lucide-react'
import Link from 'next/link'

export default function SavedPropertiesPage() {
    const { savedIds, isLoaded } = useSavedProperties()
    const [listings, setListings] = useState<ListingWithImages[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoaded) return

        const fetchSavedListings = async () => {
            if (savedIds.size === 0) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch('/api/listings/saved', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: Array.from(savedIds) })
                })

                if (response.ok) {
                    const data = await response.json()
                    setListings(data)
                }
            } catch (error) {
                console.error('Failed to fetch saved listings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSavedListings()
    }, [savedIds, isLoaded])

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md">
                    <div className="mx-auto max-w-5xl">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">AgentFolio</h1>
                    </div>
                </header>
                <main className="mx-auto max-w-5xl px-4 py-8">
                    <div className="flex items-center justify-center h-60">
                        <p className="text-slate-500">Loading...</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header - Sticky */}
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md">
                <div className="mx-auto max-w-5xl">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">AgentFolio</h1>
                </div>
            </header>

            {/* Scrollable Main Content */}
            <main className="flex-1 overflow-y-auto mx-auto max-w-5xl px-4 py-8">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Heart className="h-6 w-6 text-red-600 fill-red-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Saved Properties</h2>
                        <p className="text-slate-600 mt-1">
                            {savedIds.size === 0
                                ? 'No saved properties yet'
                                : `${savedIds.size} ${savedIds.size === 1 ? 'property' : 'properties'} saved`
                            }
                        </p>
                    </div>
                </div>

                {savedIds.size === 0 ? (
                    <div className="flex h-96 flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-card">
                        <div className="rounded-full bg-slate-100 p-4 mb-4">
                            <Heart className="h-12 w-12 text-slate-400" />
                        </div>
                        <p className="text-2xl font-semibold text-slate-900 mb-2">No Saved Properties</p>
                        <p className="text-slate-500 mb-6 max-w-md">
                            Start exploring properties and save your favorites for easy access later!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
                        >
                            <HomeIcon className="h-5 w-5" />
                            Browse Properties
                        </Link>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="flex items-center justify-center h-60">
                        <p className="text-slate-500">Loading saved properties...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <PropertyCard
                                key={listing.id}
                                listing={listing}
                                isSaved={true}
                            />
                        ))}
                    </div>
                )}
            </main>


        </div>
    )
}
