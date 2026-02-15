'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Home, SlidersHorizontal, ChevronDown, ChevronUp, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logSearch } from '@/actions/user'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

interface ListingFiltersProps {
  categories: { name: string; slug: string }[]
  types: { name: string; slug: string }[]
}

export function ListingFilters({ categories, types }: ListingFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const isFirstRender = useRef(true)

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  // Debounce values that change frequently
  const debouncedSearch = useDebounce(searchQuery, 1000) // Increase delay to avoid too many logs
  const debouncedLocation = useDebounce(location, 1000)
  const debouncedMinPrice = useDebounce(minPrice, 1000)
  const debouncedMaxPrice = useDebounce(maxPrice, 1000)

  // Effect to trigger search when debounced values or immediate values change
  useEffect(() => {
    // Skip the first render to avoid clearing params on mount if state initializes from params
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (debouncedLocation) params.set('location', debouncedLocation)
    if (category) params.set('category', category)
    if (propertyType) params.set('type', propertyType)
    if (debouncedMinPrice) params.set('minPrice', debouncedMinPrice)
    if (debouncedMaxPrice) params.set('maxPrice', debouncedMaxPrice)

    // FIXED: Preserve current pathname instead of hardcoding '/'
    const currentPath = window.location.pathname
    router.push(`${currentPath}?${params.toString()}`)

    // Log search history (fire and forget)
    logSearch(debouncedSearch, {
      location: debouncedLocation,
      category,
      type: propertyType,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice
    })
  }, [debouncedSearch, debouncedLocation, category, propertyType, debouncedMinPrice, debouncedMaxPrice, router])

  const activeFiltersCount = [searchQuery, location, category, propertyType, minPrice, maxPrice].filter(Boolean).length

  return (
    <div className="mb-8">
      {/* Search Bar & Toggle */}
      {/* Search Bar & Toggle */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border-none bg-white py-4 pl-12 pr-32 shadow-soft outline-none ring-1 ring-slate-100 transition-all focus:ring-2 focus:ring-[var(--brand-navy)] placeholder:text-slate-400 text-base"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="sm"
            className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 h-10 gap-2 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-navy)] text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-100/50">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Location Search */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[var(--brand-navy)] transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. Kuala Lumpur"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-[var(--brand-navy)] shadow-sm focus:bg-white focus:ring-2 focus:ring-[var(--brand-navy)]/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Category (Buy/Rent/New Project) */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[var(--brand-navy)] transition-colors" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-8 text-sm font-medium text-[var(--brand-navy)] shadow-sm focus:bg-white focus:ring-2 focus:ring-[var(--brand-navy)]/20 transition-all outline-none cursor-pointer"
                >
                  <option value="">Any Category</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Property Type</label>
              <div className="relative group">
                <Home className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[var(--brand-navy)] transition-colors" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full appearance-none rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-8 text-sm font-medium text-[var(--brand-navy)] shadow-sm focus:bg-white focus:ring-2 focus:ring-[var(--brand-navy)]/20 transition-all outline-none cursor-pointer"
                >
                  <option value="">Any Type</option>
                  {types.map((type) => (
                    <option key={type.slug} value={type.slug}>{type.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Price Range (RM)</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 group">
                    <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">RM</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-[var(--brand-navy)] shadow-sm focus:bg-white focus:ring-2 focus:ring-[var(--brand-navy)]/20 transition-all outline-none"
                    />
                  </div>
                  <span className="text-slate-300 font-medium">-</span>
                  <div className="relative flex-1 group">
                    <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">RM</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-[var(--brand-navy)] shadow-sm focus:bg-white focus:ring-2 focus:ring-[var(--brand-navy)]/20 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
