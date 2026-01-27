'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  listingId: string
  initialSaved?: boolean
  className?: string
  onToggle?: (id: string, saved: boolean) => void
}

export function SaveButton({ listingId, initialSaved = false, className, onToggle }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newState = !isSaved
    setIsSaved(newState)

    // Update localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('agentfolio_saved_properties') || '[]') as string[]
      let updated: string[]
      if (newState) {
        updated = [...new Set([...saved, listingId])]
      } else {
        updated = saved.filter(id => id !== listingId)
      }
      localStorage.setItem('agentfolio_saved_properties', JSON.stringify(updated))

      // Notify parent if callback provided
      if (onToggle) {
        onToggle(listingId, newState)
      }
    } catch (error) {
      console.error('Error updating saved properties:', error)
      // Revert on error
      setIsSaved(!newState)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-full transition-colors hover:bg-slate-100",
        isSaved ? "text-red-500" : "text-slate-400 hover:text-red-500",
        className
      )}
      aria-label={isSaved ? "Unsave property" : "Save property"}
    >
      <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
    </button>
  )
}
