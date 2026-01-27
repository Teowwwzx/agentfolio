
'use client'

import { AuthView } from '@neondatabase/neon-js/auth/react'

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Or create a new account to get started
          </p>
        </div>
        
        <div className="bg-white p-8 shadow-card rounded-xl">
          <AuthView />
        </div>
      </div>
    </div>
  )
}
