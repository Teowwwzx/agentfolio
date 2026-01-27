import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAgentProfile } from '@/actions/profile'
import { ProfileForm } from '@/components/agent/ProfileForm'

export default async function AgentProfilePage() {
    const session = await getSession()
    if (!session || session.user.role !== 'agent') {
        redirect('/agent/login')
    }

    const profile = await getAgentProfile(session.user.id)

    if (!profile) {
        return <div className="p-6">Profile not found</div>
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
            <ProfileForm profile={profile} />
        </div>
    )
}
