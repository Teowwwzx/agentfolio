
import { getSections } from '@/actions/sections'
import { getListingOptions } from '@/actions/options'
import SectionsClient from '@/components/admin/SectionsClient'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SectionsPage() {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }

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
