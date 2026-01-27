'use server'

import { login, logout } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: unknown, formData: FormData) {
  const success = await login(formData)
  if (success) {
    redirect('/admin')
  } else {
    return { error: 'Invalid credentials' }
  }
}

export async function logoutAction() {
  await logout()
  redirect('/admin/login')
}
