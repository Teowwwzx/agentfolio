'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function toggleEditMode(formData: FormData) {
  const isEnabled = formData.get('edit_mode') === 'on'
  const cookieStore = await cookies()
  
  if (isEnabled) {
    cookieStore.set('edit_mode', 'true', { httpOnly: true, secure: true })
  } else {
    cookieStore.delete('edit_mode')
  }

  redirect('/admin/settings')
}
