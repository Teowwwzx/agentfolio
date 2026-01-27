
import { getSavedProperties } from '@/actions/user'
import { PropertyCard } from '@/components/PropertyCard'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'

export default async function SavedPropertiesPage() {
  const listings = await getSavedProperties()

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
        {listings.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-card">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Heart className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-xl font-semibold text-[var(--brand-navy)]">No saved properties</p>
            <p className="mt-2 text-slate-500">Tap the heart icon on any property to save it here.</p>
            <Link href="/" className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <PropertyCard 
                key={listing.id} 
                listing={listing} 
                isSaved={true} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
