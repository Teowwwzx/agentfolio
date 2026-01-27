'use client'

import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'

// Saved properties feature is now client-side using localStorage
// This page shows a message directing users to use the heart icon while browsing

export default function SavedPropertiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-5xl flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Saved Properties</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex h-60 flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-card">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <Heart className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-xl font-semibold text-[var(--brand-navy)]">Saved Properties</p>
          <p className="mt-2 text-slate-500">
            Saved properties are stored locally in your browser.
            Tap the heart icon on any property while browsing to save it.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Browse Properties
          </Link>
        </div>
      </main>
    </div>
  )
}
