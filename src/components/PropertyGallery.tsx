'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ListingImage } from '@/types'

interface PropertyGalleryProps {
  images: ListingImage[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
    document.body.style.overflow = 'hidden' // Prevent scrolling
  }

  const closeModal = () => {
    setIsOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images.length) {
    return (
      <div className="flex h-[300px] sm:h-[500px] w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        No Images Available
      </div>
    )
  }

  return (
    <>
      {/* Modern Grid Gallery */}
      <div className="mb-4 hidden sm:grid gap-2 overflow-hidden rounded-xl sm:grid-cols-4 sm:grid-rows-2 sm:h-[500px]">
        {/* Main Hero Image */}
        <div 
          className="relative col-span-2 row-span-2 aspect-[4/3] sm:aspect-auto bg-slate-100 cursor-pointer group"
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0].url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        
        {/* Secondary Images */}
        {images.slice(1, 5).map((img, idx) => (
          <div 
            key={img.id} 
            className="relative col-span-1 row-span-1 bg-slate-100 cursor-pointer group"
            onClick={() => openModal(idx + 1)}
          >
            <Image 
              src={img.url} 
              alt={`${title} - ${idx + 2}`} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            
            {/* Show "More" overlay on the last grid item if there are more images */}
            {idx === 3 && images.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg backdrop-blur-[2px]">
                +{images.length - 5}
              </div>
            )}
          </div>
        ))}
        
        {/* Fill remaining grid slots if less than 5 images */}
        {images.length < 5 && Array.from({ length: 5 - images.length }).map((_, idx) => (
           <div key={`placeholder-${idx}`} className="relative bg-slate-50" />
        ))}
      </div>

      {/* Mobile Scrollable Gallery */}
      <div className="sm:hidden flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
         {images.map((img, idx) => (
            <div 
              key={img.id} 
              className="relative h-[300px] w-[85vw] flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 snap-center"
              onClick={() => openModal(idx)}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
          ))}
      </div>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeModal}>
          <button 
            onClick={closeModal}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors hidden sm:block"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors hidden sm:block"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="relative h-full w-full max-w-7xl p-4 sm:p-10" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-full w-full">
              <Image
                src={images[currentIndex].url}
                alt={`${title} - Preview`}
                fill
                className="object-contain"
                quality={100}
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-md">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}