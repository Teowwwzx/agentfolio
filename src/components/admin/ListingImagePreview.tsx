'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/modal'
import { X } from 'lucide-react'

interface ListingImagePreviewProps {
  images: { url: string }[]
  title: string
}

export function ListingImagePreview({ images, title }: ListingImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const coverImage = images[0]?.url

  if (!coverImage) {
    return (
      <div className="flex h-16 w-24 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
        No Img
      </div>
    )
  }

  return (
    <>
      <div 
        className="relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-slate-100 transition-transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <Image src={coverImage} alt={title} fill className="object-cover" />
        {images.length > 1 && (
          <div className="absolute bottom-0 right-0 bg-black/60 px-1.5 py-0.5 text-[10px] text-white rounded-tl-md">
            +{images.length - 1}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title} maxWidth="max-w-4xl">
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
            <Image 
              src={images[selectedIndex].url} 
              alt={`${title} - Image ${selectedIndex + 1}`} 
              fill 
              className="object-contain" 
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    idx === selectedIndex ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
