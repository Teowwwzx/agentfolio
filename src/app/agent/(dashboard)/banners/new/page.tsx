import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { createBannerAction } from '@/actions/banners'
import { BannerForm } from '@/components/agent/BannerForm'

export default async function NewBannerPage() {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }

    async function handleCreate(formData: FormData) {
        'use server'
        const result = await createBannerAction(formData)
        if (result.success) {
            redirect('/agent/banners')
        }
        return result
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Banner</h1>
            <BannerForm action={handleCreate} />
        </div>
    )
}
