
import { getSections } from '@/actions/sections'
import { getListingOptions } from '@/actions/options'
import SectionsClient from '@/components/admin/SectionsClient'

export default async function SectionsPage() {
  const [sections, options] = await Promise.all([
    getSections(),
    getListingOptions()
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionsClient sections={sections} options={options} />
    </div>
  )
}
