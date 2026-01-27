'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { PropertyCard } from './PropertyCard'
import { ListingWithImages } from '@/types'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback } from 'react'

interface PropertyCarouselProps {
  listings: ListingWithImages[]
  savedListingIds?: Set<string>
}

export function PropertyCarousel({ listings, savedListingIds = new Set() }: PropertyCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    containScroll: 'trimSnaps' 
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {listings.map((listing) => (
            <div className="flex-[0_0_100%] min-w-0 pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]" key={listing.id}>
              <PropertyCard listing={listing} isSaved={savedListingIds.has(listing.id)} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-md hover:bg-slate-50 hover:shadow-lg transition-all"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-md hover:bg-slate-50 hover:shadow-lg transition-all"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </Button>
      </div>
    </div>
  )
}
