import { redirect } from 'next/navigation'
import { loginAgent, getSession } from '@/lib/auth'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function AgentLoginPage() {
    const session = await getSession()
    if (session) {
        redirect('/agent/dashboard')
    }
    async function handleLogin(formData: FormData) {
        'use server'
        const result = await loginAgent(formData)
        if (result.success) {
            redirect('/agent/dashboard')
        }
        return result
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white px-8 py-10 shadow-lg rounded-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">Agent Login</h1>
                    <LoginForm action={handleLogin} />
                </div>
            </div>
        </div>
    )
}
