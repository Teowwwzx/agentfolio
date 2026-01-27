'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { Search } from 'lucide-react'

// Simple debounce hook to avoid extra dependency
function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return [debouncedValue]
}

interface DashboardFiltersProps {
  categories: { id: string, name: string }[]
}

export function DashboardFilters({ categories }: DashboardFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('query') || '')
  const [debouncedSearch] = useDebounce(search, 500)
  
  const handleFilterChange = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // Reset to page 1 on filter change
    router.push(`/admin?${params.toString()}`)
  }, [router, searchParams])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set('query', debouncedSearch)
    } else {
      params.delete('query')
    }
    // Only push if changed to avoid loop (though router.push is safe usually)
    if (params.get('query') !== searchParams.get('query')) {
      params.set('page', '1')
      router.push(`/admin?${params.toString()}`)
    }
  }, [debouncedSearch, router, searchParams])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
      </div>
      
      <div className="flex gap-2">
        <select
          value={searchParams.get('status') || 'all'}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="hidden">Hidden</option>
        </select>
        
        <select
          value={searchParams.get('categoryId') || 'all'}
          onChange={(e) => handleFilterChange('categoryId', e.target.value)}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
