'use server'

import { loginAdmin, logout } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const result = await loginAdmin(formData)
  if (result.success) {
    return { success: true }
  } else {
    return { success: false, error: result.error || 'Invalid credentials' }
  }
}

export async function logoutAction() {
  await logout()
  redirect('/admin/login')
}
