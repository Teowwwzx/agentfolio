'use client'

import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteSection } from '@/actions/sections'
import { useTransition } from 'react'

export function EditControls({ sectionId }: { sectionId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this section?')) {
      startTransition(async () => {
        await deleteSection(sectionId)
      })
    }
  }

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-lg shadow-sm border border-slate-200 backdrop-blur-sm">
      <Link 
        href={`/admin/sections/${sectionId}`}
        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        title="Edit Section"
      >
        <Pencil size={16} />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
        title="Delete Section"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
