import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createAgentAction } from '@/actions/admin'
import { CreateAgentForm } from '@/components/admin/CreateAgentForm'

export default async function NewAgentPage() {
    const session = await getAdminSession()
    if (!session) {
        redirect('/admin/auth/login')
    }

    async function handleCreate(formData: FormData) {
        'use server'
        const result = await createAgentAction(formData)
        if (result.success) {
            redirect('/admin/dashboard/agents')
        }
        return result
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Agent</h1>
            <CreateAgentForm action={handleCreate} />
        </div>
    )
}
