import { redirect } from 'next/navigation'
import { loginAdmin, getAdminSession } from '@/lib/auth'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function AdminLoginPage() {
    const session = await getAdminSession()
    if (session) {
        redirect('/admin/dashboard')
    }
    async function handleLogin(formData: FormData) {
        'use server'
        const result = await loginAdmin(formData)
        if (result.success) {
            redirect('/admin/dashboard')
        }
        return result
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-full max-w-md">
                <div className="bg-white px-8 py-10 shadow-xl rounded-lg">
                    <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
                    <p className="text-center text-gray-500 text-sm mb-6">Platform Administration</p>
                    <LoginForm action={handleLogin} />
                </div>
            </div>
        </div>
    )
}
