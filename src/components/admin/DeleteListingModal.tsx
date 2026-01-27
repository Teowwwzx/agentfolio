'use client'

import { useTransition, useEffect } from 'react'
import { deleteListingAction } from '@/actions/listings'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeleteListingModalProps {
  listingId: string | null
  listingTitle?: string
  isOpen: boolean
  onClose: () => void
}

export function DeleteListingModal({ listingId, listingTitle, isOpen, onClose }: DeleteListingModalProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!listingId) return
    startTransition(async () => {
      await deleteListingAction(listingId)
      onClose()
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Listing" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">This action cannot be undone.</p>
        </div>
        
        <p className="text-slate-600">
          Are you sure you want to delete <span className="font-semibold text-slate-900">{listingTitle || 'this listing'}</span>? 
          All associated data including images and tags will be removed.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
            {isPending ? 'Deleting...' : 'Delete Listing'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
