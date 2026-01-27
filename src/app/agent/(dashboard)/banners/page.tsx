import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getBanners } from '@/actions/banners'
import { BannerList } from '@/components/agent/BannerList'
import Link from 'next/link'

export default async function BannersPage() {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }

    const banners = await getBanners(session.user.id)

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Banner Management</h1>
                <Link
                    href="/agent/banners/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create Banner
                </Link>
            </div>

            <BannerList banners={banners} />
        </div>
    )
}
