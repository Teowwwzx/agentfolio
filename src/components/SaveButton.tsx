
'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleSavedProperty } from '@/actions/user'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  listingId: string
  initialSaved?: boolean
  className?: string
}

export function SaveButton({ listingId, initialSaved = false, className }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Optimistic update
    const newState = !isSaved
    setIsSaved(newState)

    startTransition(async () => {
      try {
        await toggleSavedProperty(listingId)
        router.refresh()
      } catch (error) {
        // Revert on error
        setIsSaved(!newState)
        // Ideally show toast here (e.g. "Please login to save")
        if (confirm("Please login to save properties. Go to login?")) {
           router.push('/login')
        }
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
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
