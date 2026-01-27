'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ListingWithImages } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/format'
import { useSavedProperties } from '@/hooks/useSavedProperties'
import { ArrowLeft, Heart, MapPin, Bed, Bath, Maximize, Phone, MessageCircle, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'


interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const router = useRouter()
  const [id, setId] = useState<string>('')

  const { toggleSaved, isSaved } = useSavedProperties()
  const [listing, setListing] = useState<ListingWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)

  // Unwrap params Promise
  useEffect(() => {
    params.then(({ id }) => setId(id))
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`)
        if (response.ok) {
          const data = await response.json()
          setListing(data)
        } else {
          console.error('Failed to fetch listing')
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleWhatsApp = () => {
    const phone = listing?.phone_number || '60123456789'
    const message = `Hi! I'm interested in ${listing?.title}`
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
    }
  }

  const prevImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-xl font-semibold text-slate-900 mb-2">Property not found</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  const propertyIsSaved = isSaved(listing.id)
  const images = listing.images || []
  const hasImages = images.length > 0

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header - Sticky */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 truncate max-w-[200px]">
              {listing.title}
            </h1>
            <button
              onClick={() => toggleSaved(listing.id)}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <Heart
                className={`w-6 h-6 ${propertyIsSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'
                  }`}
              />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Gallery */}
          {hasImages && (
            <div className="relative bg-black">
              <div className="relative aspect-[4/3]">
                <Image
                  src={images[currentImageIndex].url}
                  alt={listing.title}
                  fill
                  className="object-contain"
                  priority
                />

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronRight className="w-6 h-6 text-slate-900" />
                    </button>
                  </>
                )}

                {/* View All Photos Button */}
                <button
                  onClick={() => setShowGallery(true)}
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  View all photos
                </button>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${idx === currentImageIndex ? 'ring-2 ring-blue-500' : 'opacity-60'
                        }`}
                    >
                      <Image
                        src={img.url}
                        alt={`${listing.title} - ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-4 py-6">
            {/* Title & Price */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{listing.title}</h2>
              <div className="flex items-center text-slate-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{listing.location}</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(listing.price)}
              </p>
            </div>

            {/* Property Features */}
            <div className="flex gap-6 py-4 border-y border-slate-200 mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bed className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{listing.bedrooms}</p>
                  <p className="text-xs text-slate-500">Bedrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bath className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{listing.bathrooms}</p>
                  <p className="text-xs text-slate-500">Bathrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Maximize className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{formatNumber(listing.sqft)}</p>
                  <p className="text-xs text-slate-500">Square Ft</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">About this property</h3>
              <p className="text-slate-700 leading-relaxed">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Part of normal flow, not fixed */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-black/90">
            <p className="text-white font-medium">
              {currentImageIndex + 1} / {images.length}
            </p>
            <button
              onClick={() => setShowGallery(false)}
              className="text-white p-2 hover:bg-white/10 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 relative">
            <Image
              src={images[currentImageIndex].url}
              alt={listing.title}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition"
                >
                  <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip in Modal */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-black/90">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden ${idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-50'
                    }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
